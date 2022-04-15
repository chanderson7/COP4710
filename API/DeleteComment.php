
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
    $stmt = $conn->prepare("SELECT Event_id FROM Event WHERE Event_id=?");
    $stmt->bind_param("s", $inData["Event_id"]);
    $stmt->execute();
    $result = $stmt->get_result();

    if( $row = $result->fetch_assoc() )
    {
        $stmt = $conn->prepare("SELECT ID FROM Users WHERE ID=?");
        $stmt->bind_param("s", $inData["User_id"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if( $row = $result->fetch_assoc() )
        {
            $stmt = $conn->prepare("SELECT User_id FROM Comments WHERE User_id=? && Event_id=?");
            $stmt->bind_param("ss", $inData["User_id"], $inData["Event_id"]);
            $stmt->execute();
            $result = $stmt->get_result();

            if( $row = $result->fetch_assoc() )
            {
                $stmt = $conn->prepare("DELETE FROM Comments WHERE User_id=? && Event_id=?");
                $stmt->bind_param("ss", $inData["User_id"], $inData["Event_id"]);
                $stmt->execute();
                returnWithError("Successfully deleted comment!");
            }
            
            else
            {
                returnWithError("Comment does not exist!");
            }
        }
        else
        {
            returnWithError("User does not exist!");
        }
    }

    else
    { 
        returnWithError("Event does not exists!");
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
