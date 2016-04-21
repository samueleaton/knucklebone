'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _lodash = require('lodash.foreach');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isplainobject');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.isobjectlike');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.forown');

var _lodash8 = _interopRequireDefault(_lodash7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {

	/* Create new request
 */
	function newRequest(reqOptions) {
		/*
  	reqOptions.url
  	reqOptions.method
  	reqOptions.contentType
  	reqOptions.data
  */
		var XHR_REQ = addHandlers(new XMLHttpRequest());
		XHR_REQ.addEventListener('readystatechange', function (evt) {
			if (XHR_REQ.readyState === 4) handleResponse(XHR_REQ, reqOptions);
		});

		XHR_REQ.open(reqOptions.method, reqOptions.url);

		if (reqOptions.headers) {
			(0, _lodash8.default)(reqOptions.headers, function (val, key) {
				if (key === 'withCredentials') {
					if (val === true) XHR_REQ.withCredentials = 'true';
				} else {
					XHR_REQ.setRequestHeader(key, val);
				}
			});
		}

		if (reqOptions.method === 'GET') XHR_REQ.send();else {
			if (reqOptions.requestContentType === 'json') {
				XHR_REQ.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
				if ((0, _lodash4.default)(reqOptions.data)) XHR_REQ.send(JSON.stringify(reqOptions.data));else XHR_REQ.send(reqOptions.data);
			} else XHR_REQ.send(reqOptions.data);
		}
		return XHR_REQ;
	}

	/*
 */
	function handleResponse(XHR_REQ, reqOptions) {
		var resObj = {
			response: XHR_REQ.response,
			responseText: XHR_REQ.responseText,
			responseURL: XHR_REQ.responseURL,
			status: XHR_REQ.status,
			statusText: XHR_REQ.statusText
		};
		if (XHR_REQ.status >= 200 && XHR_REQ.status < 400) {
			var contentTypeHeader = XHR_REQ.getResponseHeader('content-type');
			var isJsonResponse = /application\/json/.test(contentTypeHeader);

			if (reqOptions.responseContentType === 'json' || isJsonResponse) return handleJsonResponse(XHR_REQ, resObj);else return callSuccess(XHR_REQ, XHR_REQ.response, resObj);
		} else return callError(XHR_REQ, XHR_REQ.response, resObj);
	}

	/*
 */
	function handleJsonResponse(XHR_REQ, resObj) {
		var jsonData = parseJson(XHR_REQ.response);
		if ((0, _lodash6.default)(jsonData)) return callSuccess(XHR_REQ, jsonData, resObj);else return callError(XHR_REQ, 'Error parsing response. Expected JSON.', resObj);
	}

	/*
 */
	function callSuccess(REQ, res, resObj) {
		if (typeof REQ._onSuccess === 'function') REQ._onSuccess(res, resObj);
	}

	/*
 */
	function callError(REQ, res, resObj) {
		if (typeof REQ._onError === 'function') REQ._onError(res, resObj);
	}

	/*
 */
	function parseJson(data) {
		try {
			var jsonData = JSON.parse(data);
		} catch (e) {
			return null;
		}
		return jsonData;
	}

	/* Add Success/Error Handlers
 */
	function addHandlers(reqOptions) {
		reqOptions.success = function (cb) {
			if (typeof cb === 'function') reqOptions._onSuccess = cb;else throw Error('callback not passed to "success" method');
			return reqOptions;
		};

		reqOptions.error = function (cb) {
			if (typeof cb === 'function') reqOptions._onError = cb;else throw Error('callback not passed to "error" method');
			return reqOptions;
		};
		return reqOptions;
	}

	/*
 */
	function get(url, params, headers) {
		if (typeof url !== 'string') throw Error('url must be a string');

		if ((0, _lodash4.default)(params)) {

			if (url.indexOf('?') === -1) url = url + '?';

			(0, _lodash8.default)(params, function (v, k) {
				url += k + '=' + encodeURIComponent(v);
			});
		}
		return newRequest({ url: url, method: 'GET', headers: headers });
	}

	/*
 */
	function getJson(url, params, headers) {
		if (typeof url !== 'string') throw Error('url must be a string');

		if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {

			if (url.indexOf('?') === -1) url = url + '?';

			(0, _lodash8.default)(params, function (v, k) {
				url += k + '=' + encodeURIComponent(v);
			});
		}
		return newRequest({ url: url, method: 'GET', responseContentType: 'json', headers: headers });
	}

	/*
 */
	function post(url, data, headers) {
		if (typeof url !== 'string') throw Error('url must be a string');
		return newRequest({ url: url, method: 'POST', data: data, headers: headers });
	}

	/*
 */
	function postJson(url, data, headers) {
		if (typeof url !== 'string') throw Error('url must be a string');
		return newRequest({ url: url, method: 'POST', data: data, requestContentType: 'json', headers: headers });
	}

	/*
 */
	function put(url, data) {
		if (typeof url !== 'string') throw Error('url must be a string');
		return newRequest({ url: url, method: 'PUT', data: data });
	}

	/*
 */
	function putJson(url, data, headers) {
		if (typeof url !== 'string') throw Error('url must be a string');
		return newRequest({ url: url, method: 'PUT', data: data, requestContentType: 'json', headers: headers });
	}

	/*
 */
	function _delete(url, data) {
		if (typeof url !== 'string') throw Error('url must be a string');
		return newRequest({ url: url, method: 'DELETE', data: data });
	}

	/*
 */
	function deleteJson(url, data, headers) {
		if (typeof url !== 'string') throw Error('url must be a string');
		return newRequest({ url: url, method: 'DELETE', data: data, requestContentType: 'json', headers: headers });
	}

	return {
		get: get,
		getJson: getJson,
		post: post,
		postJson: postJson,
		put: put,
		putJson: putJson,
		'delete': _delete,
		deleteJson: deleteJson,
		formToObject: formToObject
	};
}();

