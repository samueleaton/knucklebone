<?php 
if(isset($_POST)){
	print_r(json_encode($_POST));
}else {
	echo "no post";
}


// phpinfo();
?>