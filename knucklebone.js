var KBP = {
	form: {},
	rqst: function(_URL, _CALLBACK, _TYPE, _FORM) {
		var _req = new XMLHttpRequest();
		var self = this;
		_req.addEventListener('readystatechange',function(){
			if(_req.readyState === 4) _CALLBACK(self.res(this));
		});
		_req.open(_TYPE, _URL);
		(_FORM) ? _req.send(_FORM) : _req.send() ;
	},
	res: function(_res) {
		var r = {};
		r.json = JSON.parse(_res.response);
		r.response = _res.response;
		r.responseType = _res.responseType;
		r.responseURL = _res.responseURL;
		r.status = _res.status;
		r.statusText = _res.statusText;
		r.success = (r.status>=200 && r.status<300)?true:false;
		return r;
	},
	get: function(_URL, _CALLBACK){
		this.rqst(_URL, _CALLBACK, "GET");
	},
	post: function(_URL, _FORM, _CALLBACK){
		var self = this;
		self.form.data = _FORM;
		self.form.data.addEventListener('submit',function(evt){
			evt.preventDefault();
			if(self.form.submit != null) self.form.submit();
			if(self.form.errors === true) return;
			self.rqst(_URL, _CALLBACK, "POST", self.formify(_FORM));
		});
	},
	formify: function(_FORM){
		var fD = new FormData(_FORM);
		return fD;
	}
};

function knucklebone(onStart, isForm) {
	var kb = Object.create(KBP);
	if(onStart) (isForm && isForm === true) ? (kb.form.submit = onStart) : onStart() ;
	return kb;
}
