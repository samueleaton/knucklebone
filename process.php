<?php
	// http_response_code(403);
	if(isset($_POST["fName"])){
		echo "Form Submited to Database";
	} else {
		echo "Form Error";
	}
?>