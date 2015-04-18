var knucklebonePrototype = {

	req : function(){ 
		return new XMLHttpRequest(); 
	},

	post: function(){

	},

	get: function(URL, CALLBACK){
		var ajaxRequest = new XMLHttpRequest();
		ajaxRequest.addEventListener('readystatechange',function(evt){
			if(ajaxRequest.readyState === 4){
				console.log("readystatechange: ");
				console.log(JSON.parse(ajaxRequest.response));
				CALLBACK(ajaxRequest);
			}
		});
		ajaxRequest.open("POST", URL);
		ajaxRequest.send();
	},

	done: function() {
		console.log("done");
	}
	
};

function knucklebone(STARTFUNCTION) {
	if(STARTFUNCTION){
		if(STARTFUNCTION === "function"){
			STARTFUNCTION();
		} else {
			return (function(){
				"THE ERROR IS NOT HERE!"; // =========
				console.group("knucklebone says, %c\"check yourself before you wreck yourself\"", "color: red;"); 
				console.log("%cinvalid parameter type", "color: red;"); 
				console.log("you passed %c%s", "color: orange; font-style: italic; font-weight: bold;", typeof STARTFUNCTION);
				console.groupEnd();
			})();
		}
	}
	return Object.create(knucklebonePrototype);
}

// var ajaxRequest = new XMLHttpRequest();

// // ajaxRequest.addEventListener('load',function(evt){
// // 	console.log("loaded: ");
// // 	console.log(ajaxRequest.readyState);
// // 	console.log("");
// // });
// // ajaxRequest.addEventListener("error", function(evt){
// // 	console.log("error: ");
// // 	console.log(evt);
// // 	console.log("");
// // });
// // ajaxRequest.addEventListener("abort", function(evt){
// // 	console.log("abort: ");
// // 	console.log(evt);
// // 	console.log("");
// // });
// ajaxRequest.addEventListener('readystatechange',function(evt){
// 	if(ajaxRequest.readyState === 4){
// 		console.log("readystatechange: ");
// 		console.log(JSON.parse(ajaxRequest.response));
// 	}
	
// });

// ajaxRequest.open("POST", "http://localhost:8888/Github/knucklebone.js/data.json");
// ajaxRequest.send();