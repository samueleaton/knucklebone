function knucklebone(_OPTIONS) {
	// console.log(stream);
	var KBP = {
		options:{
			stream: (_OPTIONS===undefined)?false:( (_OPTIONS["stream"]===true)?true:false )
		},
		abort: function(){
			// self = this;
			// self.utils._XMLHttpRequest.abort();
			// self.utils.info.permissionToFire = false;
			// self.utils.info.aborted = true;
			// console.log("%cknucklebone: %cAJAX REQUEST ABORTED", "color:royalblue;text-shadow:0 0 5px royalblue;", "color:orange;text-shadow:0 0 6px orange;");
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

		success: function(_CALLBACK){
			this.utils.success = _CALLBACK;
			// console.log(this.utils.success);
			return this;
		},

		error: function(_CALLBACK) {
			this.utils.queue.error = _CALLBACK;
			return this;
		},

		get: function(_URL, _OPTIONS){
			var self = this;
			if(typeof _URL === "string"){
				self.utils.mapCall(_URL, _OPTIONS, "get");
			} else if(Array.isArray(_URL)) {
				for(var i = 0, ii=_URL.length; i<ii; i++){
					self.utils.mapCall(_URL[i], _OPTIONS, "get");
				}
			}
			self.utils.rqst();
			// if(!KBP.stream){ KBP.get = undefined; KBP.post = undefined;}
			return this;
		},

		post: function(_URL, _DATA, _OPTIONS){
			// i may need to put this in a queue, or at least check a queue
			// update the current call
			// var self = this;
			// self.utils.mapCall();
			// self.utils.info.options.form = true;
			// self.utils.info.type = "post";
			// self.utils.info.url = _URL; // move this to the mapCall method, move the _OPTIONS too. do it to the POST too.
			// if(_OPTIONS !== undefined){
			// 	var optionsKeys = Object.keys(_OPTIONS);
			// 	for(var i = 0, ii = optionsKeys.length; i < ii; i++){
			// 		self.utils.info.options[optionsKeys[i]] = _OPTIONS[optionsKeys[i]];
			// 	}
			// } else {
			// 	console.log("no options set | 'form' is default for post", self);
			// 	self.utils.info.options.form = true;
			// }
			// self.utils.info.data = _DATA;
			// if(self.utils.info.options.form && _DATA.tagName !== undefined && _DATA.tagName.toLowerCase() == "form"){

				
			// 	_DATA.addEventListener('submit',function(evt){
			// 		evt.preventDefault();
			// 		self.utils.info.data = self.utils.formify(_DATA); // sends data to utils.info
			// 		self.utils.queue.onFormSubmit();

			// 		if(self.utils.info.permissionToFire){
			// 			console.log("permission granted. fired it.");
			// 			self.utils.rqst();
			// 		} else {
			// 			console.log("you do not have permission.");
			// 			return;
			// 		}
					
			// 	});
			// } else {
			// 	console.log("other method using post: ", self.data);
			// 	// set up the way to 
			// }
			// return self;
		},
		// put: function () {
		// 	// add this
		// },
		// delete: function() {
		// 	// add this
		// },
		utils: {
			mapCall: function(_URL,_OPTIONS,_TYPE){
				var self = this; // utils
				var newCall = {
					url: _URL,
					contentType: (_OPTIONS!==undefined)?_OPTIONS["contentType"]:((_TYPE==="get")?"json":"form"),
					type: _TYPE,
					pending: true,
					res: {},
					aborted: false,
					permissionToFire: true,
					onSuccess: null,
					onError: null
				};
				if(newCall.type === "post"){
					newCall.form = (_OPTIONS!==undefined)?_OPTIONS["form"]:true;
				}
				self.queue.push(newCall);
			},
			rqst: function() {
				var self = this; // utils
				for (var i = 0, ii = self.queue.length; i<ii; i++) {
					var _XMLHttpRequest = new XMLHttpRequest();
					(function (_CURRENTOBJECT, _CURRENTCALL) {
	          _CURRENTCALL.addEventListener('readystatechange', function(){
              if(_CURRENTCALL.readyState === 4){ 
								_CURRENTOBJECT.pending = false;
								var _RESPONSE = self.beautifyRes(_CURRENTCALL);
								if((_RESPONSE.status>=200 && _RESPONSE.status<300)?true:false){
									// if stream, then call:
									if(KBP.options.stream){
										self.success(_RESPONSE);
									}
										// _CURRENTOBJECT.onSuccess(_RESPONSE);

									// else
									else
									{
										self.resData.push(_RESPONSE);
										if(self.resData.length === self.queue.length){
											(self.resData.length === 1) ? self.success(self.resData[0]) : self.success(self.resData);
											KBP.utils = undefined;
										}
									}
								} else {
									// if stream, then call:
										// _CURRENTOBJECT.onError(_RESPONSE);
									// else
										_CURRENTOBJECT.res = _RESPONSE; // and call batch later
									console.log("error!");
								}
								// console.log("");
							}
            });
	        })(self.queue[i], _XMLHttpRequest);
					_XMLHttpRequest.open(self.queue[i].type, self.queue[i].url);
					_XMLHttpRequest.send();
				}
			},
			beautifyRes: function(_res) {
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
				return r;
			},
			resData:[],
			formify: function(_FORM){
				// var fD = new FormData(_FORM);
				// return fD;
			},
			queue: [],
			success: null,
			error: null,
			pause: function(){

			}
		},
	};

	// var kb = Object.create(KBP);
	return KBP;
	// return kb;
}