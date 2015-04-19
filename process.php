<?php
	// http_response_code(403);
	if(isset($_POST["fName"])){
		$jsonObject = json_encode( $_POST );
		echo  $jsonObject;
	} else {
		echo "Form Error";
	}
?>