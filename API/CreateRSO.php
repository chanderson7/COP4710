
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
    $stmt = $conn->prepare("SELECT RSO_id FROM RSO WHERE RSO_id=?");
    $stmt->bind_param("s", $inData["RSO_id"]);
    $stmt->execute();
    $result = $stmt->get_result();

    if( $row = $result->fetch_assoc() )
    {
        returnWithError("RSO id already exists!");
    }

    else
    {
        $stmt = $conn->prepare("INSERT INTO RSO (RSO_id, Name, Description, Logo) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $inData["RSO_id"], $inData["Name"], $inData["Description"], $inData["Logo"]);
        $stmt->execute();
    
        returnWithError("RSO Added!");
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
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $firstName, $lastName, $id, $phoneNumber, $emailAddress, $dateCreated, $userID )
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","phoneNumber":"' . $phoneNumber . '","emailAddress":"' . $emailAddress . '","dateCreated":"' . $dateCreated . '","userID":"' . $userID . '","error":""}';
    sendResultInfoAsJson( $retValue );
}

?>
