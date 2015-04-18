var knucklebonePrototype = {
	get: function(_URL, _CALLBACK){
		var req = new XMLHttpRequest();
		req.addEventListener('readystatechange',function(){
			if(req.readyState === 4) _CALLBACK(req);
		});
		req.addEventListener('error', knucklebonePrototype.error);
		req.open("GET", _URL);
		req.send();
	},
	post: function(_URL, _FORM, _CALLBACK){
		// var req = new XMLHttpRequest();
	
		// req.addEventListener('readystatechange',function(){
		// 	if(req.readyState === 4) _CALLBACK(req);
		// });
		// req.addEventListener('error', knucklebonePrototype.error);
		// req.open("POST", _URL);
		// httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		// req.send(_FORM_DATA);
	},
	postForm: function(_URL, _FORM, _CALLBACK){
		var req = new XMLHttpRequest();
		var processedForm = knucklebonePrototype.processForm(_FORM);
		req.addEventListener('readystatechange',function(){
			if(req.readyState === 4) _CALLBACK(req);
		});
		req.addEventListener('error', knucklebonePrototype.error);
		req.open("POST", _URL);
		req.send(processedForm);
	},
	formListener: function(_URL, _FORM, _CALLBACK){
		var _form = knucklebonePrototype.formToObject(_FORM);
		_form.addEventListener('submit',function(evt){
			evt.preventDefault();
			knucklebonePrototype.postForm(_URL, _form, _CALLBACK);
		});
	},
	formToObject: function(_FORM) {
		var form;
		if(typeof _FORM === "string"){ // form by id
			console.log("form data is a string. Get form by id: "+_FORM);
			form = document.getElementById(_FORM);
		} else if (typeof _FORM === "object") { // form by object
			console.log("form data is an object:"); console.log(_FORM);
			form = _FORM;
		}
		return form;
	},
	processForm: function(_FORM){
		var fD = new FormData(_FORM);
		return fD;
	}
};

function knucklebone(STARTFUNCTION) {
	if(STARTFUNCTION){
			STARTFUNCTION();
	}
	return Object.create(knucklebonePrototype);
}