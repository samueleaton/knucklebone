<?php 
	if(isset($_GET["cats"])){
		$catJson = file_get_contents("cats.json");
		// $catJson = json_encode(file_get_contents("cats.json"));
		echo $catJson;
	}
?>