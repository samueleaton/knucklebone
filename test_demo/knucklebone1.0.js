function knucklebone(_OPTIONS) {
	var KBP = {
		abort: function(){
			self = this;
			self.utils._XMLHttpRequest.abort();
			self.utils.info.permissionToFire = false;
			self.utils.info.aborted = true;
			console.log("%cknucklebone: %cAJAX REQUEST ABORTED", "color:royalblue;text-shadow:0 0 5px royalblue;", "color:orange;text-shadow:0 0 6px orange;");
			return self;

			// abort actually aborst the call after it has started. "pause" simply doesn't let the call start.
		},
		resend: function(){
			// check if kb is aborted. if not, will abort and then re-send
		},
		pause: function(){
			var self = this;
			// ==========================
			//this is used to run a function before the call fires
			// example of use:
				knucklebone().post("test.php", myForm).pause(function(kb){
					// ... some code here
					kb.play();//kb is the current knucklebone object
				});

			// OR
				var myKb = knucklebone().post("test.php", myForm).pause();// with no function.

				//...later

				myKb.play();
			// ==========================

			return self;
		},
		play: function(){
			self = this;
			self.utils.rqst();
			return self;
		},
		pending: function(){
			return this.utils.info.pending;
		},
		complete: function(){
			return this.utils.info.complete;
		},
		success: function(_CALLBACK){
			this.utils.queue.success = _CALLBACK;
			return this;
		},
		error: function(_CALLBACK) {
			this.utils.queue.error = _CALLBACK;
			return this;
		},
		get: function(_URL, _OPTIONS){
			// i may need to put this in a queue, or at least check a queue
			// update the current call
			var self = this;
			self.utils.mapCall();
			if(_OPTIONS !== undefined){
				var optionsKeys = Object.keys(_OPTIONS);
				for(var i = 0, ii = optionsKeys.length; i < ii; i++){
					self.utils.info.options[optionsKeys[i]] = _OPTIONS[optionsKeys[i]];
				}
			}
			self.utils.info.url = _URL; // move this to the mapCall method, move the _OPTIONS too. do it to the POST too.
			self.utils.info.type = "get";
			self.utils.rqst(); // UN-COMMENT
			return this;
		},
		post: function(_URL, _DATA, _OPTIONS){
			// i may need to put this in a queue, or at least check a queue
			// update the current call
			var self = this;
			self.utils.mapCall();
			self.utils.info.options.form = true;
			self.utils.info.type = "post";
			self.utils.info.url = _URL; // move this to the mapCall method, move the _OPTIONS too. do it to the POST too.
			if(_OPTIONS !== undefined){
				var optionsKeys = Object.keys(_OPTIONS);
				for(var i = 0, ii = optionsKeys.length; i < ii; i++){
					self.utils.info.options[optionsKeys[i]] = _OPTIONS[optionsKeys[i]];
				}
			} else {
				console.log("no options set | 'form' is default for post", self);
				self.utils.info.options.form = true;
			}
			self.utils.info.data = _DATA;
			if(self.utils.info.options.form && _DATA.tagName !== undefined && _DATA.tagName.toLowerCase() == "form"){

				
				_DATA.addEventListener('submit',function(evt){
					evt.preventDefault();
					self.utils.info.data = self.utils.formify(_DATA); // sends data to utils.info
					self.utils.queue.onFormSubmit();

					if(self.utils.info.permissionToFire){
						console.log("permission granted. fired it.");
						self.utils.rqst();
					} else {
						console.log("you do not have permission.");
						return;
					}
					
				});
			} else {
				console.log("other method using post: ", self.data);
				// set up the way to 
			}
			return self;
		},
		// put: function () {
		// 	// add this
		// },
		// delete: function() {
		// 	// add this
		// },
		utils: {
			mapCall: function(){
				var self = this; // utils
				var template = {
					options: {
						form: false,
						contentType: "json"
					},
					type: "get",
					complete: false,
					pending: true,
					res: {},
					data: {},
					aborted: false,
					permissionToFire: true
				};
				self.info = Object.create(template);
				console.log(self); //
			},
			rqst: function() {
				var self = this;
				self._XMLHttpRequest = new XMLHttpRequest();
				console.log("request_fired");
				self._XMLHttpRequest.addEventListener('readystatechange',function(){
					if(self._XMLHttpRequest .readyState === 4){ 
						var response = self.res(this);
						self.info.complete = true;
						self.info.pending = false;
						if(response.success){
							self.queue.success(response)
							console.log("success!");
						} else {
							self.queue.error(response)
							console.log("error!");
						}
					}
				});
				console.log("request type: ",self.info.type);
				self._XMLHttpRequest.open(self.info.type, self.info.url);
				// (self.info.type=="post") ? self._XMLHttpRequest .send(self.info.data) : self._XMLHttpRequest .send() ;
				if(self.info.type=="post") {
					console.log("fired post request>", self.info.data);
					self._XMLHttpRequest.send(self.info.data)
				} else { 
					console.log("fired get request");
					self._XMLHttpRequest.send();
				} 
			},
			res: function(_res) {
				var r = {};
				try {
					r.json = JSON.parse(_res.response);
				} catch(e){
					r.json = null;
				}
				r.response = _res.response;
				r.responseType = _res.responseType;
				r.responseURL = _res.responseURL;
				r.status = _res.status;
				r.statusText = _res.statusText;
				r.success = (r.status>=200 && r.status<300)?true:false;
				return r;
			},
			formify: function(_FORM){
				var fD = new FormData(_FORM);
				return fD;
			},
			queue: {
				success: function(){},
				error: function(){},
				onFormSubmit: function(){}
			},
			info:{}
		},
	};
	var kb = Object.create(KBP);
	return kb;
}