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
Lightweight AJAX library for the client, intended for JSON API's

[![GitHub version](https://badge.fury.io/gh/samueleaton%2Fknucklebone.svg)](http://badge.fury.io/gh/samueleaton%2Fknucklebone) <img src="https://img.shields.io/badge/license-MIT-blue.svg"> <img src="https://img.shields.io/badge/bower-knucklebone-yellow.svg"> 


<br>


## Overview of Knucklebone

#### Available Methods:
- `get()`
- `getJson()`
- `post()`
- `postJson()`
- `putJson()`
- `deleteJson()`

```javascript
knucklebone.getJson('path/to/file')
```
```javascript
knucklebone.postJson('url/path', jsonData)
```
```javascript
knucklebone.putJson('url/path', jsonData)
```

####There are 2 methods that can handle the response(s):
- `success` - receives any *succesful* responses
- `error` - receives any *errored* responses and timeout responses

These methods are all chained onto the call--promise style. They both take a callback.

```javascript
knucklebone().getJson("path/to/file")
.success(function(parsedJson, resObj){})
.error(function(parsedJson, resObj){});
```  

<br> 
- - -

####Why the name "knucklebone"?
[This](https://en.wikipedia.org/wiki/Knucklebones) is why. Get it? 
