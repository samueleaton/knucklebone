module.exports = (function() {

	/* Lodash-esque helpers
	*/
	const _ = {
		isArray: obj => (Array.isArray && Array.isArray(obj)) || 
			obj.constructor === Array ||
			obj instanceof Array,
		each(list, cb) {
			if (typeof cb !== 'function')
				return list;
			const collection = this.isArray(list) ? list : this.toArray(list);
			for (let i = 0, ii = collection.length; i < ii; i++) {
				cb(collection[i]);
			}
		},
		toArray(list) {
			if (!list || !list.length) return [];
			var arr = [], i = 0;
			while(arr.length < list.length)
				arr.push(list[i++]);
			return arr;
		}
	};

	/* Create new request
	*/
	function newRequest(reqObj) {
		/*
			reqObj.url
			reqObj.method
			reqObj.contentType
			reqObj.data
		*/
		const XHR_REQ = addHandlers(new XMLHttpRequest());
		XHR_REQ.addEventListener('readystatechange', evt => {
			// if (REQ.readyState === 4) handleResponse(REQ, resFormat, type);
			if (XHR_REQ.readyState === 4) handleResponse(XHR_REQ, reqObj);
		});
		// REQ.open(type, reqPath);
		XHR_REQ.open(reqObj.method, reqObj.url);

		// if (type === 'GET')
		if (reqObj.method === 'GET')
			XHR_REQ.send();
		else {
			// if (resFormat === 'json') {
			if (obj.contentType === 'json') {
				XHR_REQ.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
				// if (sendData instanceof Object)
				if (obj.data instanceof Object)
					// REQ.send(JSON.stringify(sendData));
					XHR_REQ.send(JSON.stringify(obj.data));
				else 
					// REQ.send(sendData);
					XHR_REQ.send(obj.data);
			}
			else
				// REQ.send(sendData);
				XHR_REQ.send(obj.data);
		}
		return XHR_REQ;
	}

	/*
	*/
	function handleResponse(XHR_REQ, reqObj) {
		const resObj = {
			response: XHR_REQ.response,
			responseText: XHR_REQ.responseText,
			responseURL: XHR_REQ.responseURL,
			status: XHR_REQ.status,
			statusText: XHR_REQ.statusText
		};
		if (XHR_REQ.status >= 200 && XHR_REQ.status < 400) {
			if (reqObj.method === 'GET' && reqObj.contentType === 'json')
				return handleGetJsonResponse(XHR_REQ, resObj);
			else
				return callSuccess(XHR_REQ, XHR_REQ.response, resObj);
		}
		else
			return callError(XHR_REQ, XHR_REQ.response, resObj);
	}

	/*
	*/
	function handleGetJsonResponse(XHR_REQ, resObj) {
		const jsonData = parseJson(XHR_REQ.response);
		if (typeof jsonData === 'object')
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
	function addHandlers(reqObj) {
		reqObj.success = cb => {
			if (typeof cb === 'function')
				reqObj._onSuccess = cb;
			else
				throw Error('callback not passed to "success" method');
			return reqObj;
		}

		reqObj.error = cb => {
			if (typeof cb === 'function')
				reqObj._onError = cb;
			else
				throw Error('callback not passed to "error" method');
			return reqObj;
		}
		return reqObj;
	}

	/*
	*/
	function get(url, params) {
		if (typeof url !== 'string')
			throw Error('url must be a string');
		
		if (typeof params === 'object') {
			
			if (url.indexOf('?') === -1)
				url = url + '?';

			_.each(Object.keys(params), k => {
				url += k + '=' + encodeURIComponent(params[k])
			});
		}
		return newRequest({ url, method: 'GET' });
	}

	/*
	*/
	function getJson(url, params) {
		if (typeof url !== 'string')
			throw Error('url must be a string');
		
		if (typeof params === 'object') {
			
			if (url.indexOf('?') === -1)
				url = url + '?';

			_.each(Object.keys(params), k => {
				url += k + '=' + encodeURIComponent(params[k])
			});
		}
		return newRequest({ url, method: 'GET', contentType: 'json' });
	}

	/*
	*/
	function post(url, data) {
		if (typeof url !== 'string')
			throw Error('url must be a string');
		return newRequest({ url, method: 'POST', data});
	}

	/*
	*/
	function postJson(url, data) {
		if (typeof url !== 'string')
			throw Error('url must be a string');
		return newRequest({ url, method: 'POST', data, contentType: 'json'});
	}

	/*
	*/
	function putJson(url, data) {
		if (typeof url !== 'string')
			throw Error('url must be a string');
		return newRequest({ url, method: 'PUT', data, contentType: 'json'});
	}

	/*
	*/
	function deleteJson(url, data) {
		if (typeof url !== 'string')
			throw Error('url must be a string');
		return newRequest({ url, method: 'DELETE', data, contentType: 'json'});
	}

	/*
	*/
	function formToObject(formId) {
		const elms = document.getElementById(formId).querySelectorAll('[kb]');
		const obj = {};
		_.each(elms, elm => {
			if (elm.hasAttribute('name')) {
				const key = elm.getAttribute('name').trim();
				if (obj[key]) throw Error('form name dublicated');
				obj[key] = elm.value.trim();
			}
		});
		return obj;
	}

	return {
		get,
		getJson,
		post,
		postJson,
		putJson,
		deleteJson,
		formToObject
	};
})();
