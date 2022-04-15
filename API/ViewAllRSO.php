<?php

	$inData = getRequestInfo();

	$searchResults = "";
	$finalResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "MAINUSER", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT * FROM RSO");
		$stmt->execute();

		$result = $stmt->get_result();

		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$finalResults .= ",";
			}
			$finalResults .= "{";

			$searchCount++;
			$searchResults = "";
			$searchResults .= '"RSO_id": ' . $row["RSO_id"] . ',';
			$searchResults .= '"Name": "' . $row["Name"] . '",';
			$searchResults .= '"Description": "' . $row["Description"] . '",';
			$searchResults .= '"Logo": "' . $row["Logo"] . '"';

			$finalResults .= $searchResults . "}";
		}

		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $finalResults );
		}

		$stmt->close();
		$conn->close();
	}



	// Functions

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
		$retValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $finalResults )
	{
		$retValue = '{"results":[' . $finalResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
