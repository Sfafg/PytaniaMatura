<?php
 
$json = file_get_contents("php://input");
 
if(strlen($json) > 1) file_put_contents("Answers.json",$json);
?>
