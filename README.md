# knucklebone.js
Lightweight, minimal ajax library

##### _Knucklebone tries to fill a very specific niche so as to be more useful/minimalistic. If you want to asynchronously get data through GET (as GET was intended), or if you want to asynchronously send form data through POST, then knucklebone will be perfect._

## Before you can play
##### Don't Forget to add knucklebone __*before*__ your scripts:
```html
...
	<script type="text/javascript" src="knucklebone.js"></script>
	<script type="text/javascript" src="yourCode.js"></script>
</body>
```


## How to play knucklebones (examples)

###Getting Data With Ajax

##### Basic way to GET data:
```javascript
knucklebone().get(URL, myCallback);

function myCallback(res){
	console.log(res); // res is the response data
};  
```

__HINT:__ If you are expecting a JSON file back:
```javascript
knucklebone().get(URL, myCallback);

function myCallback(res){
// res.json is the parsed json file
	console.log(res.json); 
};  
```

##### You can have a function run while waiting for the response:
```javascript
knucklebone(pleaseHold).get(URL, myCallback);

function pleaseHold(){
	// do something while you wait
};
```

##### Of course, you could always use anonymous functions:
```javascript
knucklebone(function(){
	// do something while you wait
}).get(URL, function(res){
	console.log(res);
});
```

##### More than one AJAX call at a time? Pshh, we're professionals:
Every time you call the `knucklebone()` function you will create a new object that extends the knucklebone prototype.
So you should just be able to this (asynchronously): 
```javascript
knucklebone().get(URL1, callback1); // one set of data
knucklebone().get(URL2, callback2); // second set of data
// each knucklebone() produces an independent, non-conflicting ajax call
```

###Posting Form Data With Ajax

##### Simple Form Submit:
Pass the whole form to knucklebone, it'll do the rest:
```javascript
// e.g. var formObject = document.getElemenyById("myform");
knucklebone().post(URL, formObject, myCallback);
```

#####Run a function when the form submits:
```javascript
// 2nd param "true" means call function only if form is submitted.
// Otherwise it will run the function immediately
knucklebone(coolFunc, true).post(URL, formObject, myCallback);

function coolFunc(){
	// do something cool when form submitted
};
```

#####Prevent ajax call if form is not proper:
HTML
```html
<form id="superForm">
	<input id="superField" name="superField">
	<input type="submit">
</form>
```
JavaScript
```javascript
// store initialized knucklebone into variable
var myAJAX = knucklebone(coolFunc, true);
// add post method
myAJAX.post("process.php", superForm, myCallback);

// define function to call when form is submitted
function coolFunc(){
	// setting your ajax object's form.error property to true
	// prevents ajax call if field is blank
	if(superField.value.length < 1) myAJAX.form.errors = true; 
	// dont forget to set it back to false if no errors
	else myAJAX.form.errors = false; 
};
```
- - -
#####Why "knucklebone"?
[This](https://en.wikipedia.org/wiki/Knucklebones) is why. Get it? 
