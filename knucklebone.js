// v1.0
var knucklebonePrototype = {
	form: {
		submitFunc: null,
		errors: null
	},
	ajaxReq: function(_URL, _CALLBACK, _TYPE, _FORM) {
		var req = new XMLHttpRequest();
		var self = this;
		req.addEventListener('readystatechange',function(){
			if(req.readyState === 4) _CALLBACK(self.ajaxRes(this));
		});
		req.open(_TYPE, _URL);
		(_FORM) ? req.send(_FORM) : req.send() ;
	},
	ajaxRes: function(res) {
		var r = {};
		r.json = JSON.parse(res.response);
		r.response = res.response;
		r.responseText = res.responseText;
		r.responseType = res.responseType;
		r.responseURL = res.responseURL;
		r.status = res.status;
		r.statusText = res.statusText;
		return r;
	},
	get: function(_URL, _CALLBACK){
		this.ajaxReq(_URL, _CALLBACK, "GET");
	},
	post: function(_URL, _FORM, _CALLBACK){
		var self = this;
		self.form.data = _FORM;
		self.form.data.addEventListener('submit',function(evt){
			evt.preventDefault();
			if(self.form.submitFunc != null) self.form.submitFunc();
			if(self.form.errors === true) return;
			self.ajaxReq(_URL, _CALLBACK, "POST", self.formify(_FORM));
		});
	},
	formify: function(_FORM){
		var fD = new FormData(_FORM);
		return fD;
	}
};

function knucklebone(onStart, isForm) {
	var kb = Object.create(knucklebonePrototype);
	if(onStart) (isForm && isForm === true) ? (kb.form.submitFunc = onStart) : onStart() ;
	return kb;
}