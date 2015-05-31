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


## Overview of Knucklebone

###Initiate an AJAX call or series:
```javascript
knucklebone()
```

###To specify the request type, there are 2 methods
- `get()`
- `post()`

```javascript
knucklebone().get('path/to/file')
```
```javascript
knucklebone().post('path/to/file', dataToSend)
```

###There are 3 methods that can handle the response(s):
- `success` - receives any *succesful* responses
- `error` - receives any *errored* responses and timeout responses
- `response` - receives *any/all* responses (general purpose)

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

##Power Features

Knucklebone's power features include:
- **Multi-call Requests**
- **Single-call and Mutli-call Request Streaming**
- **Pausing (delaying) and Playing (resuming) Calls (especially with form collaboration)**
- **Modularity of Methods**

- - -

###Power Feature: Mutli-call Requests
Multi-call packaging allows you to make multiple requests in one call and get an array of all of the responses when they are all completed. It works for both get and post requests.
#####Simple Example
```javascript
knucklebone()
.get(["cats.json", "dogs.json", "rabbits.json"])
.success(function(res){
	console.log(res); // array of responses
})
```
####The `each` Method
The `each()` method allows for easy manipulation of the response data. It takes a function that will be applied to each response. (*only arrays of multiple responses have the `each` method*)
```javascript
knucklebone()
.get(["cats.json", "dogs.json", "rabbits.json"])
.success(function(res){

	res.each(function(res){
		console.log(res); // a single response
	})
  
})
```
####Targeting One of the Responses Individually
How do you loop through the responses and only react to a single specific response? Easy. Thats where the reponses sweetening that knucklebone adds really shines. One of the properties that knucklebone adds to the responses is a string that contains the original query, called `query`. Here is how you traget only the `cats.json` file:
```javascript
knucklebone()
.get(["cats.json", "dogs.json", "rabbits.json"])
.success(function(res){

	res.each(function(res){
		if(res.query == "cats.json"){
			console.log(res); // the cats.json response
		}
	})
  
})
```

- - -

###Power Feature: Single- and Multi-call Request Streaming
This is very powerful feature of knucklebone. It allows you to open up an I/O pipe that can take in any number of request urls and will deliver each response asynchronously as they are completed.   

All that is needed to start a stream is to specify the stream option when initiating the knucklebone instance `knucklebone({stream:true})`.  (*each response is returned individually, therfore the `each()` method is not needed/available*)  
#####Simple Example
```javascript
knucklebone({stream:true})
	.get(["cats.json", "dogs.json", "rabbits.json"])
  
	.success(function(res){
		console.log(res);
	})
```

####Event Reaction
This AJAX pipe allows for an available pipe that you can pass a file path to whenever. This example shows how you could easily fire an AJAX call whenever a certain event occurs (it also shows off the modularity of knucklebone methods):
```javascript
var myKb = knucklebone({stream:true})
	.success(function(res){
		console.log(res);
	});
  
function myEventHandler(newURL) {
	myKb.get(newURL); 
}
```
In the example, each time the `myEventHandler` function fires, knucklebone is ready to send another *get* request for whatever the `newURL` happens to be. When the response is returned, it will be handled by the `success` promise (if it was a successful response, of course). 


####Continuous Call-Response Cycle
With Request Streaming, knucklebone is ready to stream another request on command. This proves very useful in the `success`, `error`, and/or `response` methods.
In this next example, we will create 2 knucklebone instances, one for getting info, and one for posting errors to a document.
```javascript
var kbPostErrors = knucklebone({stream:true})
	.success(function(res){
		console.log("successful write to error log");
	});


var kbGetDocs = knucklebone({stream:true})
	.get(["path/file1.json","path/file2.json","etc.json"])
	.success(function(res){
		console.log("successfully got: ", res.response);
	})
	error(function(res){
		kbPostErrors.post("location/to/errorLog", res); // log to other knucklebone 
	});
```
You can have the response methods react with an immidiate, new AJAX call. Throw somelogic in there and you'll have a very robust system with very little code.

- - -

###Power Feature: Delay and Resume Calls
By calling the `pause()` method before you call the `get()` or `post()` methods, you can get your call all set up and ready to fire. This allows you to prepare a request and then wait for the right circumstance to finally launch the call. Use the `play()` method to resume the call.

You can pass a function to the `pause` method, which will be run before the request methods, allowing for a convenient spot for logic.  
**Simple Example**
```javascript
var getFile = knucklebone()
.pause()
.get("myFile.json")

function playKnucklebone(){
	getFile.play()
}
```
In this example, the `getFile` AJAX call will be paused indefinitely until we call the `playKnucklebone` function. 

####Prevent ajax call if form is not proper  
If you are doing a post request with a form, `pause` will only fire when the form is submitted, and will automatically stop the form from being submitted for you so that you can do some logic. Now that's service! 

Again, you just need to call the `play` method to go on with the request. 

Make sure you pass the form to the `post` method as the second paramter. Knucklebone will automatically parse the form and all of its fields for you and submit it as a post request.

The `pause` method passes you a reference to the current AJAX call so that you can easy manipulate it. In the exmaple we named it `kb`
```html
<form id="superForm">
	<input id="fName" name="fName">
	<input id="age" name="age">
	<input type="submit">
</form>
```
```javascript
var superform = document.getElementById("superForm");
var fName = document.getElementById("fName");
...
knucklebone()
.pause(function(kb){
	// only submit form if fName field is not empty
	if(fName.value.length > 0) kb.play();
})
.post("path/to/send/form", superForm);
```

<br>

- - -  

###Power Feature: Modularity of Methods

*Documentation Soon*
<br>
<br>

- - -  

<br>
<br>  
##Setting Knucklebone Options
The folowing is a list of options you can set when ititializing a knucklebone:    
  
#####`stream`
Default Value  | Functionality                                                   | Parameters
-------------- | --------------------------------------------------------------- | -----------------------
false          | allows for a continuous ajax stream                             | true, false             
#
#####`requestHeader`
Default Value  | Functionality                                                   | Parameters
-------------- | --------------------------------------------------------------- | -----------------------
*none*         | set the request header                                          | {"key": "value"}
#
#####`timeout`
Default Value  | Functionality                                                   | Parameters
-------------- | --------------------------------------------------------------- | -----------------------
*none*         | set the amount of miliseconds until the request(s) timeout(s)   | int
#
#####`verbose` - *feature being developed*
Default Value  | Functionality                                                   | Parameters
-------------- | --------------------------------------------------------------- | -----------------------
false          | detailed logs in the console with non-minified knucklebone.js   | true, false


#####Example
```javascript
knucklebone({
	stream: true, 
	requestHeader:{"Content-type", "application/x-www-form-urlencoded"},
	timeout: 2500,  // 2.5 seconds
	verbose: true
	})
	.post("path/to/file", formData)
...
```
<br>

- - -  

<br>
####Properties of the response object, refered to in our examples as `res` :
- **json**  (if getting json data, this holds the parsed object, otherwise it is `null`)
- **query** (the original query that was used for the request; it is good for consitent logic checks)
- **responseType**  (can be "json", "document", "text", etc.)
- **response**  (can ba an ArrayBuffer, Blob, Document, JavaScript object, or a string)
- **responseText**  (a string or null if ajax failed)
- **responseURL**  (the origin of the response)
- **status**  (the http [status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes))
- **statusText**  (the text equivalent to the status code)
- each (a method that will perform the same function to all responses in an array; must pass an array of requests and not use the `stream` option to access this response method) 
  
<br>

- - -
<br> 
####Feature Roadmap
- Detect if Request has been sent, but Response not yet returned (a.k.a. Response Pending). *almost complete*
- ~~Be able to *abort* and *resend* an Ajax call~~ **added**
- Be able to send `put` and `delete` as per the REST api style
- Finish this new 1.0 README

<br> 
- - -

####Why the name "knucklebone"?
[This](https://en.wikipedia.org/wiki/Knucklebones) is why. Get it? 





<br><br><br>


- - -   
##### NOTE: BIG 1.0 were just implemented (May 30, 2015) and this README has been recently updated.  
