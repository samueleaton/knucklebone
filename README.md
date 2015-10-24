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

[![GitHub version](https://badge.fury.io/gh/samueleaton%2Fknucklebone.svg)](http://badge.fury.io/gh/samueleaton%2Fknucklebone) <img src="https://img.shields.io/badge/license-MIT-blue.svg"> <img src="https://img.shields.io/badge/bower-knucklebone-yellow.svg"> 


<br>


## Overview of Knucklebone

####Initiate an AJAX call or series:
```javascript
knucklebone
```

####To specify the request type, there are 4 methods
- `get()`
- `getJson()`
- `post()`
- `postJson()`

```javascript
knucklebone().get('path/to/file')
```
```javascript
knucklebone().post('path/to/file', "kbFormName")
```

####There are 2 methods that can handle the response(s):
- `success` - receives any *succesful* responses
- `error` - receives any *errored* responses and timeout responses

These methods are all implemented using a promise style. They are not called unless prerequisites are met. They are all optional.
```javascript
knucklebone().get("path/to/file")
.success(function(res){})
.error(function(res){});
```  
<br> 
- - -

####Why the name "knucklebone"?
[This](https://en.wikipedia.org/wiki/Knucklebones) is why. Get it? 
