// knucklebone().get("http://localhost:8888/Github/knucklebone.js/data.json", finish);
// var superForm = document.getElementById("superForm");
// superForm.addEventListener('submit',  function(evt){
// 	knucklebone().submitForm(evt);
// } );
// knucklebone().post("http://localhost:8888/Github/knucklebone.js/data.json", superForm, finish);

var superForm = document.getElementById("superForm");
var superField = document.getElementById('superField');

var myAJAX = knucklebone(start, true);
myAJAX.post("process.php", superForm, finish);
function start(){
	if(superField.value.length < 1) { 
		myAJAX.form.errors = true; 
	}
	else { 
		myAJAX.form.errors = false; 
	}
	console.log("started");
}

function finish(res){
	console.log(res);
}