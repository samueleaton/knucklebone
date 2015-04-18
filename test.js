knucklebone().get("http://localhost:8888/Github/knucklebone.js/data.json", finish);

function start(){
	console.log("cool");
};
function finish(res){
	console.log(res);
}