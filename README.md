# knucklebone.js
Lightweight minimal ajax library

## Before you can play
*Don't Forget to add knucklebone __before__ your scripts:*
```html
...
	<script type="text/javascript" src="knucklebone.js"></script>
	<script type="text/javascript" src="yourCode.js"></script>
</body>
```

## How to play knucklebones
#### Basic way to GET data:
```javascript
	knucklebones().get(URL, myCallback);

	function myCallback(res){
		console.log(res); // res is the response data
	};  
```

#### You can have a function run while waiting for the response:
```javascript
	knucklebones(pleaseHold).get(URL, myCallback);

	function pleaseHold(){
		// do something while you wait
	};

	function myCallback(res){
		console.log(res); // res is the response data
	};
```

#### Of course, you could always use anonymous functions:
```javascript
	knucklebones(function(){
		// do something while you wait
	}).get(URL, function(res){
		console.log(res);
	});
```

#### More than one AJAX call at a time? Pshh, we're professionals:
Every time you call the `knucklebone()` function you will create a new object that extends the knucklebone prototype.
So you should just be able to this: 
```javascript
knucklebones().get(URL_1, callback1);
knucklebones().get(URL_2, callback2);
```
But if you want to store the new objects into new variable for some reason, you could do: 
```javascript
var handsomeData = knucklebones().get(URL, callback1);
var avgLookingData = knucklebones().get(URL, callback2);
```



