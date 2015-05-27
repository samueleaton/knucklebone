<?php 
		usleep(mt_rand(50000,1000000));
		// sleep(mt_rand() / mt_getrandmax());
		$catJson = file_get_contents("cats.json");
		// $catJson = json_encode(file_get_contents("cats.json"));
		echo $catJson;
?>