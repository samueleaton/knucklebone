
import each from 'lodash.foreach';
import isPlainObject from 'lodash.isplainobject';
import isObjectLike from 'lodash.isobjectlike';
import forOwn from 'lodash.forown';

module.exports = (function() {

	/* Create new request
	*/
	function newRequest(reqOptions) {
		/*
			reqOptions.url
			reqOptions.method
			reqOptions.contentType
			reqOptions.data
		*/
		const XHR_REQ = addHandlers(new XMLHttpRequest());
		XHR_REQ.addEventListener('readystatechange', evt => {
			if (XHR_REQ.readyState === 4) handleResponse(XHR_REQ, reqOptions);
		});

		XHR_REQ.open(reqOptions.method, reqOptions.url);

		if (reqOptions.headers) {
			forOwn(reqOptions.headers, (val, key) => {
				if (key === 'withCredentials') {
					if (val === true)
						XHR_REQ.withCredentials = 'true';
				}
				else {
					XHR_REQ.setRequestHeader(key, val);
				}
			});
		}

		if (reqOptions.method === 'GET')
			XHR_REQ.send();
		else {
			if (reqOptions.requestContentType === 'json') {
				XHR_REQ.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
				if (isPlainObject(reqOptions.data))
					XHR_REQ.send(JSON.stringify(reqOptions.data));
				else
					XHR_REQ.send(reqOptions.data);
			}
			else
				XHR_REQ.send(reqOptions.data);
		}
		return XHR_REQ;

		
	}

	/*
	*/
	function handleResponse(XHR_REQ, reqOptions) {
		const resObj = {
			response: XHR_REQ.response,
			responseText: XHR_REQ.responseText,
			responseURL: XHR_REQ.responseURL,
			status: XHR_REQ.status,
			statusText: XHR_REQ.statusText
		};
		if (XHR_REQ.status >= 200 && XHR_REQ.status < 400) {
			const contentTypeHeader = XHR_REQ.getResponseHeader('content-type');
			const isJsonResponse = /application\/json/.test(contentTypeHeader);

			if (reqOptions.responseContentType === 'json' || isJsonResponse)
				return handleJsonResponse(XHR_REQ, resObj);
			else
				return callSuccess(XHR_REQ, XHR_REQ.response, resObj);
		}
		else
			return callError(XHR_REQ, XHR_REQ.response, resObj);
	}

	/*
	*/
	function handleJsonResponse(XHR_REQ, resObj) {
		const jsonData = parseJson(XHR_REQ.response);
		if (isObjectLike(jsonData))
			return callSuccess(XHR_REQ, jsonData, resObj);
		else
			return callError(XHR_REQ, 'Error parsing response. Expected JSON.', resObj);
	}

	/*
	*/
	function callSuccess(REQ, res, resObj) {
		if (typeof REQ._onSuccess === 'function')
			REQ._onSuccess(res, resObj);
	}

	/*
	*/
	function callError(REQ, res, resObj) {
		if (typeof REQ._onError === 'function')
			REQ._onError(res, resObj);
	}

	/*
	*/
	function parseJson(data) {
		try {
			var jsonData = JSON.parse(data);
		}
		catch (e) {
			return null;
		}
		return jsonData;
	}

	/* Add Success/Error Handlers
	*/
	function addHandlers(reqOptions) {
		reqOptions.success = cb => {
			if (typeof cb === 'function')
				reqOptions._onSuccess = cb;
			else
				throw Error('callback not passed to "success" method');
			return reqOptions;
		}

		reqOptions.error = cb => {
			if (typeof cb === 'function')
				reqOptions._onError = cb;
			else
				throw Error('callback not passed to "error" method');
			return reqOptions;
		}
		return reqOptions;
	}

	/*
	*/
	function get(url, params, headers) {
		if (typeof url !== 'string')
			throw Error('url must be a string');

		if (isPlainObject(params)) {

			if (url.indexOf('?') === -1)
				url = url + '?';

			const queryParams = [];

			forOwn(params, (v, k) => {
				queryParams.push(k + '=' + encodeURIComponent(v));
			});
			
			url += queryParams.join('&');
		}
		return newRequest({ url, method: 'GET', headers });
	}

	/*
	*/
	function getJson(url, params, headers) {
		if (typeof url !== 'string')
			throw Error('url must be a string');

		if (isPlainObject(params)) {

			if (url.indexOf('?') === -1)
				url = url + '?';

			const queryParams = [];

			forOwn(params, (v, k) => {
				queryParams.push(k + '=' + encodeURIComponent(v));
			});
			
			url += queryParams.join('&');
		}
		return newRequest({ url, method: 'GET', responseContentType: 'json', headers });
	}

	/*
	*/
	function post(url, data, headers) {
		if (typeof url !== 'string')
			throw Error('url must be a string');
		return newRequest({ url, method: 'POST', data, headers});
	}

	/*
	*/
	function postJson(url, data, headers) {
		if (typeof url !== 'string')
			throw Error('url must be a string');
		return newRequest({ url, method: 'POST', data, requestContentType: 'json', headers});
	}

	/*
	*/
	function put(url, data) {
		if (typeof url !== 'string')
			throw Error('url must be a string');
		return newRequest({ url, method: 'PUT', data});
	}

	/*
	*/
	function putJson(url, data, headers) {
		if (typeof url !== 'string')
			throw Error('url must be a string');
		return newRequest({ url, method: 'PUT', data, requestContentType: 'json', headers});
	}

	/*
	*/
	function _delete(url, data) {
		if (typeof url !== 'string')
			throw Error('url must be a string');
		return newRequest({ url, method: 'DELETE', data});
	}

	/*
	*/
	function deleteJson(url, data, headers) {
		if (typeof url !== 'string')
			throw Error('url must be a string');
		return newRequest({ url, method: 'DELETE', data, requestContentType: 'json', headers});
	}

	return {
		get,
		getJson,
		post,
		postJson,
		put,
		putJson,
		'delete': _delete,
		deleteJson
	};
})();
