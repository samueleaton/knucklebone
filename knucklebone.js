function knucklebone(_OPTIONS) {
	var KBP = {
		options:{
			verbose: (_OPTIONS===undefined)?false:( (_OPTIONS["verbose"]===true)?true:false ),
			multi:null,
			form: true,
			requestHeader: (_OPTIONS===undefined)?null:( (_OPTIONS["requestHeader"]!==undefined)?_OPTIONS["requestHeader"]:null ),
			stream: (_OPTIONS===undefined)?false:( (_OPTIONS["stream"]===true)?true:false )
		},


		// aborts pending request(s)
		abort: function(){
			
			self = this;
			for(var i = 0, ii = self.utils.queue.length; i<ii; i++){
				self.utils.queue[i]._XMLHttpRequest.abort();
			}
			
			self.utils.info.permissionToFire = false;
			self.utils.info.aborted = true;

			if(KBP.options.verbose){ // REMOVED FOR PRODUCTION***
			console.log("%ckb:%c request aborted", "color:rgb(255,255,255);padding:0.5px 2px;font-family:'lucida grande'; background-color:rgba(67,90,255,1);", "color:rgb(67,90,255);");
			}

			return self;
		},


		/* will abort and resend pending request(s)
		*/
		resend: function(){
			for(var i = 0, ii = this.utils.queue.length; i < ii; i++){
				if(this.utils.queue[i] !== null){
					// console.log("RESENDING....");
					this.utils.queue[i]._XMLHttpRequest.abort();

					if(KBP.options.verbose){ // REMOVED FOR PRODUCTION***
						console.log("%ckb:%c aborted request: ", "color:rgb(255,255,255);padding:0.5px 2px;font-family:'lucida grande'; background-color:rgba(67,90,255,1);", "color:rgb(67,90,255);", this.utils.queue[i]);
					}

					this.utils.newRequest(this.utils.queue[i],this.utils.queue, i);
				} else {
					console.log("%ckb:%c no pending calls to resend", "color:rgb(255,255,255);padding:0.5px 2px;font-family:'lucida grande'; background-color:rgba(67,90,255,1);", "color:rgb(67,90,255);");
				}
			}

			return this;
		},


		/* if called before get() or post(), it will 
		prevent them from running until play() is called 
		*/
		pause: function(_CALLBACK){
			this.paused = true;
			if(_CALLBACK && typeof _CALLBACK == "function"){
				this.utils.pause = _CALLBACK;
			}
			
			return this;
		},


		/* if a get() or post() request has been 
		paused, this will resume the request
		*/
		play: function(){
			if(this.paused){
				this.paused = false;
				this.utils.rqst();
			} else {
				console.log("%ckb:%c knuckklebone is not paused, nothing to play", "color:rgb(255,255,255);padding:0.5px 2px;font-family:'lucida grande'; background-color:rgba(67,90,255,1);", "color:rgb(67,90,255);");
			}
			return this;
		},


		/* this will return all responses, whether
		they are successful or errored
		*/
		response: function(_CALLBACK){
			this.utils.response = _CALLBACK;
			return this;
		},

		/* this will return all successful responses, which 
		is defined by having a status code of ( 200 <= x < 300 )
		*/
		success: function(_CALLBACK){
			this.utils.success = _CALLBACK;
			return this;
		},


		/* this will return all error responses, which is 
		defined by having a status code of ( x < 200, 300 <= x )
		and request timeouts
		*/
		error: function(_CALLBACK) {
			this.utils.error = _CALLBACK;
			return this;
		},


		/* submit a get request
		*/
		get: function(_URL){
			this.utils.prepareCall(_URL, "get", null, this);
			return this;
		},


		/* submit a post request, with data to submit
		*/
		post: function(_URL, _DATA){
			this.utils.prepareCall(_URL, "post", _DATA, this);
			return this;
		},


		/* put and delete requests will be added to library 
		in the future to comply with REST architecture style
		*/
		/*
		put: function () {

		},
		delete: function() {
		},
		*/


		/*contains properties that make up the data structures 
		and methods that manipulate those structures along with 
		logic for organizing XMLHttpRequest states. This contains
		all the main functionality of knucklebone
		*/
		utils: {


			/* Takes main information from the get() or 
			post() methods and prepares that information 
			for the mapCall() method; 
			determines if a single or multiple request;
			will pause request if pause() method was called;
			*/
			prepareCall: function(_URL, _TYPE, _DATA, _KBP){
				var self = this;
				if(typeof _URL === "string"){
					KBP.options.multi = false;
					self.mapCall(_URL, _TYPE);
				} else if(Array.isArray(_URL)) {
					KBP.options.multi = true;
					for(var i = 0, ii=_URL.length; i<ii; i++){
						if(_DATA){
							self.mapCall(_URL[i], _TYPE, _DATA);
						} else {
							self.mapCall(_URL[i], _TYPE);
						}
					}
				}

				if(KBP.paused){
					// if POST and a FORM, then PAUSE also prevents form submission
					var contentType = ( _OPTIONS !== undefined && _OPTIONS["contentType"] !== undefined) ? _OPTIONS["contentType"] : ((_TYPE==="get")?"json":"form") ;

					if( contentType === "form" ){
						_DATA.addEventListener('submit',function(e){
							e.preventDefault();


							if(KBP.options.verbose){ // REMOVED FOR PRODUCTION***
								console.log("%ckb:%c form submit attempt: ", "color:rgb(255,255,255);padding:0.5px 2px;font-family:'lucida grande'; background-color:rgba(67,90,255,1);", "color:rgb(67,90,255);", _DATA);
							} // 	***


							self.pause(KBP);
						});
					} else {

						self.pause(KBP);
					}
					
				} else {
					self.rqst();
				}
				return KBP;

			},


			/* creates a map (or packet) of information 
			relating to the request and stroes that in a 
			queue of pending requests
			*/
			mapCall: function(_URL, _TYPE, _POST_DATA){
				var self = this; // utils
				var newCall = {
					url: _URL,
					contentType: (_OPTIONS!==undefined)?_OPTIONS["contentType"]:((_TYPE==="get")?"json":"form"),
					timeout: (_OPTIONS!==undefined) ? _OPTIONS["timeout"] : null,
					type: _TYPE,
					pending: true,
					res: {},
					aborted: false,
					permissionToFire: true,
					onSuccess: null,
					onError: null
				};

				if(newCall.type === "post"){
					newCall.postData = _POST_DATA;
					newCall.form = (_OPTIONS!==undefined)?_OPTIONS["form"]:true;
				}
				self.queue.push(newCall);
			},


			/* loops through the queue of pending requests 
			and calls the newRequest() for each one
			*/
			rqst: function() {
				for (var i = 0, ii = this.queue.length; i<ii; i++) {
					if(this.queue[i] !== null){
						this.newRequest(this.queue[i], this.queue, i);
					} 
				}
			},


			/* VIM (Very Important Method)
			creates a new XMLHttpRequest and attaches 
			it as a property of the queued request 
			*/
			newRequest: function(_QUEUE_ITEM, _QUEUE, _INDEX){
				var self = this;
				_QUEUE_ITEM._XMLHttpRequest = new XMLHttpRequest();
				
				
				// self calling anonymous function for adding the event listener
				(function (_CURRENTOBJECT, _CURRENTCALL, _QUEUE, _INDEX) {


          _CURRENTCALL.addEventListener('readystatechange', function(){
            if(_CURRENTCALL.readyState === 4 && _CURRENTCALL.status !== 0) { 

							_CURRENTOBJECT.pending = false;
							_QUEUE[_INDEX] = null;

							// beautify the response
							var _RESPONSE = self.beautifyRes(_CURRENTCALL, _CURRENTOBJECT.url);

							// if successful response
							if((_RESPONSE.status>=200 && _RESPONSE.status<300)?true:false){
								
								// if stream or single call, then:
								if(KBP.options.stream  || !KBP.options.multi){
									self.success(_RESPONSE, KBP);
									self.response(_RESPONSE, KBP);
								}
								else {
									self.resDataSuccess.push(_RESPONSE);
									self.resDataAll.push(_RESPONSE);
								}
							} 

							// if error response
							else { 

								// if stream or single call, then:
								if(KBP.options.stream  || !KBP.options.multi){
									self.error(_RESPONSE, KBP);
									self.response(_RESPONSE, KBP);
								} 
								else {
									self.resDataError.push(_RESPONSE);
									self.resDataAll.push(_RESPONSE);
								}
							}

							// ---- WHEN ALL REQUESTS IN QUEUE HAVE RECIEVED A RESPONSE ----
							// only applies if makes multiple requests 
							if(self.resDataAll.length === self.queue.length){
								

								// REMOVED FOR PRODUCTION *****************************
								for(var i = 0, ii = _QUEUE.length; i < ii; i++){

									if(_QUEUE[i] !== null){ // REMOVED FOR PRODUCTION ***
										console.log("%ckb:%c number of requests and responses are not equal", "color:rgb(255,255,255);padding:0.5px 2px;font-family:'lucida grande'; background-color:rgba(67,90,255,1);", "color:rgb(67,90,255);");
										console.log("%c this call may be the culprit: ", "color:rgb(67,90,255);", _QUEUE[i]);
									}
									
								} 
								 // ****************************************************




								// Reset queue now that all requests 
								// have a corresponding response
								_QUEUE = [];


								// add the each() method to 
 								self.resDataSuccess.each = self.resDataAll.each = self.resDataError.each = function(s){
										for(var t=this,e=0,n=t.length;n>e;e++)s(t[e],e,t)
								};


								// ---- RESULTS SENT TO RESPECTIVE METHODS ----
								self.success(self.resDataSuccess, KBP);
								self.error(self.resDataError, KBP);
								self.response(self.resDataAll, KBP);
							}
						}
          });


					// if timeout
					_CURRENTCALL.addEventListener('timeout', function(){

						if(KBP.options.verbose){ // REMOVED FOR PRODUCTION***
						console.log("%ckb:%c request timeout: ", "color:rgb(255,255,255);padding:0.5px 2px;font-family:'lucida grande'; background-color:rgba(67,90,255,1);", "color:rgb(67,90,255);", _CURRENTOBJECT);
						} // ***

							_CURRENTOBJECT.pending = false;
							_QUEUE[_INDEX] = null;

							// beautify the response
							var _RESPONSE = self.beautifyRes(_CURRENTCALL, _CURRENTOBJECT.url);

							// add the "timeout" to res params
							_RESPONSE.responseType = _RESPONSE.statusText = "timeout"; 
								
							
							if(KBP.options.stream  || !KBP.options.multi){
								self.error(_RESPONSE, KBP);
								self.response(_RESPONSE, KBP);
							} else {
								self.resDataError.push(_RESPONSE);
								self.resDataAll.push(_RESPONSE);
							}
							



							// ---- IF ALL CALL INTHE QUEUE HAVE RECIEVED A RESPONSE ----
							if(self.resDataAll.length === self.queue.length){
								

								// REMOVED FOR PRODUCTION *****************************
								for(var i = 0, ii = _QUEUE.length; i < ii; i++){
									if(_QUEUE[i] !== null){ // REMOVED FOR PRODUCTION ***
										console.log("%ckb:%c number of requests and responses are not equal", "color:rgb(255,255,255);padding:0.5px 2px;font-family:'lucida grande'; background-color:rgba(67,90,255,1);", "color:rgb(67,90,255);");
										console.log("%c this call may be the culprit: ", "color:rgb(67,90,255);", _QUEUE[i]);
									} 
								} // **************************************************


								// Reset queue now that all requests 
								// have a corresponding response
								_QUEUE = [];


								// add the each() method to 							
								self.resDataSuccess.each = self.resDataAll.each = self.resDataError.each = function(s){
										for(var t=this,e=0,n=t.length;n>e;e++)s(t[e],e,t)
								};

								// =RESULTS SENT RESPECTIVE METHODS=
								self.error(self.resDataError, KBP);
								self.response(self.resDataAll, KBP);
							}

					});

        })(_QUEUE_ITEM, _QUEUE_ITEM._XMLHttpRequest, _QUEUE, _INDEX);

       

        // Open Request
				_QUEUE_ITEM._XMLHttpRequest.open(_QUEUE_ITEM.type, _QUEUE_ITEM.url);


				// if header option specified, set header
				if(KBP.options.requestHeader){ 
					_QUEUE_ITEM._XMLHttpRequest.setRequestHeader(Object.keys(KBP.options.requestHeader)[0], KBP.options.requestHeader[Object.keys(KBP.options.requestHeader)[0]]);
				}
				
				// if timeout, set timeout
				if(_QUEUE_ITEM.timeout){
					_QUEUE_ITEM._XMLHttpRequest.timeout = _QUEUE_ITEM.timeout;
				}

				// send Request
				if(_QUEUE_ITEM.type === "post"){
					(_QUEUE_ITEM.form === true) ? _QUEUE_ITEM._XMLHttpRequest.send(self.formify(_QUEUE_ITEM.postData)) : _QUEUE_ITEM._XMLHttpRequest.send(_QUEUE_ITEM.postData) ;
				} else {
					_QUEUE_ITEM._XMLHttpRequest.send();
				}
			},


			/* simplifies the response and adds extra properties
			*/
			beautifyRes: function(_res, _reqQuery) {
				// check if beautifyResponse option is false
				if( (_OPTIONS!==undefined) ? ((_OPTIONS["beautifyResponse"]!==undefined)?_OPTIONS["beautifyResponse"]:true): true ){
					
					var r = {};

					try {
						// parses the response to and object if it is in JSON format
						r.json = JSON.parse(_res.response);
					} catch(e){
						r.json = null;
					}

					r.query = _reqQuery; // adds orginal call string as res param
					r.response = _res.response;
					r.responseType = _res.responseType;
					r.responseURL = _res.responseURL;
					r.status = _res.status;
					r.statusText = _res.statusText;
					
					// beautified response
					return r;

				} 

				// unbeautified response
				return _res; 
			},


			/* converts a form into a form data object 
			for enhanced security and usability
			*/
			formify: function(_FORM){
				var fD = new FormData(_FORM);
				return fD;
			},


			// stores the final success method if set
			success: function(){},

			// stores the final error method if set
			error: function(){},

			// stores the final response method if set
			response: function(){},

			// stores the final pause method if set
			pause: function(){},

			// stores all successful repsonses
			resDataSuccess:[],

			// stores all error repsonses
			resDataError:[],

			// stores all repsonses
			resDataAll:[],

			// stores pending request(s) data
			queue: []

		},
	};
	return KBP;
}