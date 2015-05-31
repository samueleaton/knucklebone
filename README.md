<br>  
<br>  
<br>  
<p align="center">
<img src="logo.png"> 	
</p>
<br>  
<br>  
<br>  
<br>  


# knucklebone.js
Lightweight, Streamable, and Modular, AJAX library for the client

[![GitHub version](https://badge.fury.io/gh/eaton11%2Fknucklebone.svg)](http://badge.fury.io/gh/eaton11%2Fknucklebone) <img src="https://img.shields.io/badge/license-MIT-blue.svg"> <img src="https://img.shields.io/badge/bower-knucklebone-yellow.svg"> 




<br>  
<br>  


## Overview of Knucklebone

####Initiate an AJAX call or series:
```javascript
knucklebone()
```

####To specify the request type, there are 2 methods
- `get()`
- `post()`

```javascript
knucklebone().get('path/to/file')
```

####There are 3 methods that can handle the response(s):
- `success` - receives any *succesful* responses
- `error` - receives any *errored* responses
- `response` - receives *any/all* responses

These methods are all implemented using a promise style. They are not called unless prerequisites are met. They are all optional.
```javascript
knucklebone().get("path/to/file")
.success( function(res){} )
.error( function(res){} )
.response( function(res){} )
```
To encourage consistency, they will always be called in this order: (1)`success`, (2)`error`, (3)`response`.  
The order that they are attached to the `knucklebone()` object doesn't matter, they will still be called in that order after the response(s) is/are returned.  

<br>
<br>

##Power Features

Knucklebone's power features include:
- multi-call packaging
- single-call and mutli-call streaming
- pausing (delaying) and playing (resuming) calls, especially with form collaboration



You can pause/delay a request using the `pause` method before you use the `get` or `post` methods:
```javascript
knucklebone.pause().get('path/to/file')
```

This will pause the request indefinitely. There are at least 2 ways to resume the call.

<br>  


- - -   
##### NOTE: BIG 1.0 were just implemented (May 30, 2015) and this README is currently being updated.  
##### Information below is being updated to current 1.0 version  
- - -


## How to use knucklebones

<br>

###Getting Data With Ajax

##### GET data:
```javascript
knucklebone().get(path/to/file)
.success(function(res){
  console.log(res);
});
```

##### Passing parameter with a Get request
Get parameters are just passed through the URL, like they always are:
```javascript
knucklebone().get(URL+"?fName=Sam&age=24", callback);
```

__HINT:__ If you are expecting a JSON file back, its already parsed:
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

#####Run a function when the form submits (before ajax completes):
```javascript
// 2nd param "true" means call function only if user submits form.
// Otherwise it will run the function immediately when loaded
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
myAJAX.post(URL, superForm, myCallback);

// define function to call when form is submitted
function coolFunc(){
	// Setting your ajax object's form.errors property to true prevents ajax call
	// This prevents ajax if if superField is blank
	if(superField.value.length < 1) myAJAX.form.errors = true; 
	// dont forget to set it back to false if no errors
	else myAJAX.form.errors = false; 
};
```

#####Form Submit Listener
There is no need to add a form submit listener before using knucklebone. In fact, knucklebone will automatically add a form submit listener. Therefore, if you use knucklebone inside a form submit handler, it will not run until you submit the form the second time. See the above examples for how to properly use knucklebone with a form.

###Working with the Response Object

####Tapping into the responpse, whether a success or error:
The response is always passed to the callback
```javascript
knucklebone().get(URL, myCallback);

function myCallback(res){ // Name it anything. We named it "res"
	console.log(res); 
}; 
```
or
```javascript
knucklebone().get(URL, function(res){
	console.log(res); 
});
```

####Determining if call was successfull
```javascript
knucklebone().get(URL, function(res){
	if(res.success){
		// yay!
	} else {
		// boo-hoo!
	}
});
```
####All of the properties of the response object:
- **json**  (if expecting json, this holds the parsed object)
- **responseType**  (can be "json", "document", "text", etc.)
- **response**  (can ba an ArrayBuffer, Blob, Document, JavaScript object, or a string)
- **responseText**  (a string or null if ajax failed)
- **responseURL**  (the origin of the response)
- **status**  (the http [status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes))
- **statusText**  (the text equivalent to the status code)
- **success**  (BOOL true if status code is successful, else false)

- - -

####Feature Roadmap
- Detect if Request has been sent, but Response not yet returned (a.k.a. Response Pending)
- Be able to *abort* and *resend* an Ajax call

- - -

####Why the name "knucklebone"?
[This](https://en.wikipedia.org/wiki/Knucklebones) is why. Get it? 
