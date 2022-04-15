
<?php

$inData = getRequestInfo();

$id = 0;
$firstName = "";
$lastName = "";
$reqTime = date('Y-m-d H:i:s');
$phoneRegex = "/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/";

$conn = new mysqli("localhost", "MAINUSER", "WeLoveCOP4331", "COP4331"); 	
if( $conn->connect_error )
{
    returnWithError( $conn->connect_error );
}
else
{
    $stmt = $conn->prepare("SELECT User_id FROM Owns WHERE User_id=? && RSO_id=?");
    $stmt->bind_param("is", $inData["User_id"], $inData["RSO_id"]);
    $stmt->execute();
    $result = $stmt->get_result();
    if( $row = $result->fetch_assoc() )
    {
        returnWithError("User already in RSO!");
    }

    else
    {
        $stmt = $conn->prepare("INSERT INTO Owns VALUES (?, ?)");
        $stmt->bind_param("ss", $inData["User_id"], $inData["RSO_id"]);
        $stmt->execute();
    
        returnWithError("Added to RSO!");
    }
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err )
{
    $retValue = '{"id":0,"firstName":"","lastName":"","phoneNumber":"","emailAddress":"","dateCreated":"","userID":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $firstName, $lastName, $id, $phoneNumber, $emailAddress, $dateCreated, $userID )
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","phoneNumber":"' . $phoneNumber . '","emailAddress":"' . $emailAddress . '","dateCreated":"' . $dateCreated . '","userID":"' . $userID . '","error":""}';
    sendResultInfoAsJson( $retValue );
}

?>
