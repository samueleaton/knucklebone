'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

module.exports = function () {

	/* Lodash-esque helpers
 */
	var _ = {
		isArray: function isArray(obj) {
			return Array.isArray && Array.isArray(obj) || obj.constructor === Array || obj instanceof Array;
		},
		each: function each(list, cb) {
			if (typeof cb !== 'function') return list;
			var collection = this.isArray(list) ? list : this.toArray(list);
			for (var i = 0, ii = collection.length; i < ii; i++) {
				cb(collection[i]);
			}
		},
		toArray: function toArray(list) {
			if (!list || !list.length) return [];
			var arr = [],
			    i = 0;
			while (arr.length < list.length) {
				arr.push(list[i++]);
			}return arr;
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
		var XHR_REQ = addHandlers(new XMLHttpRequest());
		XHR_REQ.addEventListener('readystatechange', function (evt) {
			if (XHR_REQ.readyState === 4) handleResponse(XHR_REQ, reqObj);
		});
		XHR_REQ.open(reqObj.method, reqObj.url);

		if (reqObj.method === 'GET') XHR_REQ.send();else {
			if (reqObj.contentType === 'json') {
				XHR_REQ.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
				if (reqObj.data instanceof Object) XHR_REQ.send(JSON.stringify(reqObj.data));else XHR_REQ.send(reqObj.data);
			} else XHR_REQ.send(reqObj.data);
		}
		return XHR_REQ;
	}

	/*
 */
	function handleResponse(XHR_REQ, reqObj) {
		var resObj = {
			response: XHR_REQ.response,
			responseText: XHR_REQ.responseText,
			responseURL: XHR_REQ.responseURL,
			status: XHR_REQ.status,
			statusText: XHR_REQ.statusText
		};
		if (XHR_REQ.status >= 200 && XHR_REQ.status < 400) {
			if (reqObj.method === 'GET' && reqObj.contentType === 'json') return handleGetJsonResponse(XHR_REQ, resObj);else return callSuccess(XHR_REQ, XHR_REQ.response, resObj);
		} else return callError(XHR_REQ, XHR_REQ.response, resObj);
	}

	/*
 */
	function handleGetJsonResponse(XHR_REQ, resObj) {
		var jsonData = parseJson(XHR_REQ.response);
		if ((typeof jsonData === 'undefined' ? 'undefined' : _typeof(jsonData)) === 'object') return callSuccess(XHR_REQ, jsonData, resObj);else return callError(XHR_REQ, 'Error parsing response. Expected JSON.', resObj);
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
	function addHandlers(reqObj) {
		reqObj.success = function (cb) {
			if (typeof cb === 'function') reqObj._onSuccess = cb;else throw Error('callback not passed to "success" method');
			return reqObj;
		};

		reqObj.error = function (cb) {
			if (typeof cb === 'function') reqObj._onError = cb;else throw Error('callback not passed to "error" method');
			return reqObj;
		};
		return reqObj;
	}

	/*
 */
	function get(url, params) {
		if (typeof url !== 'string') throw Error('url must be a string');

		if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {

			if (url.indexOf('?') === -1) url = url + '?';

			_.each(Object.keys(params), function (k) {
				url += k + '=' + encodeURIComponent(params[k]);
			});
		}
		return newRequest({ url: url, method: 'GET' });
	}

	/*
 */
	function getJson(url, params) {
		if (typeof url !== 'string') throw Error('url must be a string');

		if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {

			if (url.indexOf('?') === -1) url = url + '?';

			_.each(Object.keys(params), function (k) {
				url += k + '=' + encodeURIComponent(params[k]);
			});
		}
		return newRequest({ url: url, method: 'GET', contentType: 'json' });
	}

	/*
 */
	function post(url, data) {
		if (typeof url !== 'string') throw Error('url must be a string');
		return newRequest({ url: url, method: 'POST', data: data });
	}

	/*
 */
	function postJson(url, data) {
		if (typeof url !== 'string') throw Error('url must be a string');
		return newRequest({ url: url, method: 'POST', data: data, contentType: 'json' });
	}

	/*
 */
	function put(url, data) {
		if (typeof url !== 'string') throw Error('url must be a string');
		return newRequest({ url: url, method: 'PUT', data: data });
	}

	/*
 */
	function putJson(url, data) {
		if (typeof url !== 'string') throw Error('url must be a string');
		return newRequest({ url: url, method: 'PUT', data: data, contentType: 'json' });
	}

	/*
 */
	function _delete(url, data) {
		if (typeof url !== 'string') throw Error('url must be a string');
		return newRequest({ url: url, method: 'DELETE', data: data });
	}

	/*
 */
	function deleteJson(url, data) {
		if (typeof url !== 'string') throw Error('url must be a string');
		return newRequest({ url: url, method: 'DELETE', data: data, contentType: 'json' });
	}

	/*
 */
	function formToObject(formId) {
		var elms = document.getElementById(formId).querySelectorAll('[kb]');
		var obj = {};
		_.each(elms, function (elm) {
			if (elm.hasAttribute('name')) {
				var key = elm.getAttribute('name').trim();
				if (obj[key]) throw Error('form name dublicated');
				obj[key] = elm.value.trim();
			}
		});
		return obj;
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

