# knucklebone.js
Lightweight minimal ajax library

How to play knucklebones
========================
*Basic way to GET data:*
```javascript
	knucklebones().get(URL, myCallback);

	function myCallback(res){
		console.log(res); // res is the response data
	};  
```

*You can have a function run while waiting for the response:*
```javascript
	knucklebones(pleaseHold).get(URL, myCallback);

	function pleaseHold(){
		// do something
	};

	function myCallback(res){
		console.log(res); // res is the response data
	};
```

*Of course, you could always use anonymous functions:*
```javascript
	knucklebones(function(){
		// do something while you wait
	}).get(URL, function(res){
		console.log(res);
	});
```



