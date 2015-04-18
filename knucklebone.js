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
		_form = _FORM;
		_form.addEventListener('submit',function(evt){
			evt.preventDefault();
			knucklebonePrototype.postForm(_URL, _form, _CALLBACK);
		});
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
	var newKnucklebone = Object.create(knucklebonePrototype);
	newKnucklebone.preCall = function(_FUNCTION) {
		_FUNCTION();
	}
	return newKnucklebone;
}