'use strict';

var knucklebone = (function () {

	/* Create new request
 */
	function newRequest(reqPath, type, resFormat, sendData) {
		var REQ = addHandlers(new XMLHttpRequest());
		REQ.addEventListener('readystatechange', function (evt) {
			if (REQ.readyState === 4) handleResponse(REQ, resFormat, type);
		});
		REQ.open(type, reqPath);

		if (type === 'GET') {
			REQ.send();
		} else if (type === 'POST') {
			if (resFormat === 'json') {
				REQ.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
				if (sendData instanceof Object) REQ.send(JSON.stringify(sendData));else REQ.send(sendData);
			} else REQ.send(sendData);
		}

		return REQ;
	}

	/*
 */
	function handleResponse(REQ, resFormat, type) {
		if (REQ.status >= 200 && REQ.status < 400) {
			// SUCCESSFULL POST RES
			if (type === 'POST') return callSuccess(REQ, REQ.response);
			// SUCCESSFULL GET RES
			if (resFormat !== 'json') return callSuccess(REQ, REQ.response);

			// JSON GET RES
			var jsonData = parseJson(REQ.response);
			if (jsonData === null) {
				return callError(REQ, 'Error parsing response. Expected JSON.');
			}
			return callSuccess(REQ, jsonData);
		}
		// BAD RES
		return callError(REQ, REQ.response);
	}

	function callSuccess(REQ, data) {
		if (typeof REQ._onSuccess === 'function') REQ._onSuccess(data);
	}

	function callError(REQ, data) {
		if (typeof REQ._onError === 'function') REQ._onError(data);
	}

	function parseJson(data) {
		try {
			var jsonData = JSON.parse(data);
		} catch (e) {
			return null;
		}
		return jsonData;
	}

	/*
 */
	function addHandlers(reqObj) {
		reqObj.success = function (cb) {
			if (typeof cb === 'function') reqObj._onSuccess = cb;else throw Error('callback not passed to "success" method');
			return this;
		};

		reqObj.error = function (cb) {
			if (typeof cb === 'function') reqObj._onError = cb;else throw Error('callback not passed to "error" method');
			return this;
		};

		return reqObj;
	}

	function get(reqPath) {
		return newRequest(reqPath, 'GET');
	}

	function getJson(reqPath) {
		return newRequest(reqPath, 'GET', 'json');
	}

	function post(reqPath, data) {
		return newRequest(reqPath, 'POST', undefined, data);
	}

	function postJson(reqPath, data) {
		return newRequest(reqPath, 'POST', 'json', data);
	}

	return {
		get: get,
		getJson: getJson,
		post: post,
		postJson: postJson
	};
})();

