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

[![GitHub version](https://badge.fury.io/gh/samueleaton%2Fknucklebone.svg)](http://badge.fury.io/gh/samueleaton%2Fknucklebone) <img src="https://img.shields.io/badge/license-MIT-blue.svg">


<br>


## Overview of Knucklebone

#### Available Methods:

- `get()`
- `getJson()`
- `post()`
- `postJson()`
- `postUrlencoded()`

``` javascript
knucklebone.getJson('path/to/file')
.success(json => console.log(json))
.error((err, res) => console.error(err));
```

```javascript
knucklebone.postJson('url/path', jsonData)
.success(res => console.log(res))
.error((err, res) => console.error(err));
```

#### There are 2 methods that can handle the response(s):
- `success` - receives any *succesful* responses
- `error` - receives any *errored* responses and timeout responses

These methods are all chained onto the call--promise style. They both take a callback.

``` javascript
knucklebone.getJson("path/to/file")
.success(json => console.log(json))
.error((err, res) => console.error(err));
```  

#### Get Parameters

Passing an object as a second parameter...

``` javascript
knucklebone.getJson("http://example.com", {
    name: "sam", token: "dn398fdh9eud0"
})
```  

...would result in a query string of:

```
http://example.com?name=sam&token=dn398fdh9eud0
```

#### Headers

The third parameter passed to any knucklebone method can be an object of header info.

Example:

``` javascript
knucklebone.getJson("http://example.com", null, {
  withCredentials: true,
  'Content-Type': 'application/json;charset=UTF-8'
})
```  

<br> 

- - -

#### Why the name "knucklebone"?
[This](https://en.wikipedia.org/wiki/Knucklebones) is why. 
