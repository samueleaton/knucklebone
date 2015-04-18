# knucklebone.js
Lightweight minimal ajax library

Before you can play
===================
*Don't Forget to add knucklebone before __your__ scripts:*
```html
...
	<script type="text/javascript" src="knucklebone.js"></script>
	<script type="text/javascript" src="yourCode.js"></script>
</body>
```

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
		// do something while you wait
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



