# knucklebone.js
Lightweight minimal ajax library

## Before you can play
##### Don't Forget to add knucklebone __before__ your scripts:
```html
...
	<script type="text/javascript" src="knucklebone.js"></script>
	<script type="text/javascript" src="yourCode.js"></script>
</body>
```

## How to play knucklebones
##### Basic way to GET data:
```javascript
knucklebones().get(URL, myCallback);

function myCallback(res){
	console.log(res); // res is the response data
};  
```

##### You can have a function run while waiting for the response:
```javascript
knucklebones(pleaseHold).get(URL, myCallback);

function pleaseHold(){
	// do something while you wait
};
```

##### Of course, you could always use anonymous functions:
```javascript
knucklebones(function(){
	// do something while you wait
}).get(URL, function(res){
	console.log(res);
});
```

##### More than one AJAX call at a time? Pshh, we're professionals:
Every time you call the `knucklebone()` function you will create a new object that extends the knucklebone prototype.
So you should just be able to this (asynchronously): 
```javascript
knucklebones().get(URL1, callback1); // one set of data
knucklebones().get(URL2, callback2); // second set of data
```
But if you want to store the new objects into new variable for some reason, you could do: 
```javascript
var handsomeData = knucklebones().get(URL, callback1);
var avgLookingData = knucklebones().get(URL, callback2);
```
or: 
```javascript
var handsomeData = knucklebones();
handsomeData.get(URL, callback1);

var avgLookingData = knucklebones();
avgLookingData.get(URL, callback2);
```

##### Easy Form Submit:
You can pass the id for the form element:
```javascript
knucklebone().formListener(URL, "formId", finish);
```
Or pass the form object itself:
```javascript
knucklebone().formListener(URL, myform, finish);
```

