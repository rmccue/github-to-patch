<?php

require __DIR__ . '/vendor/autoload.php';

if ( $_SERVER['REQUEST_METHOD'] !== 'POST' || empty( $_SERVER['HTTP_CONTENT_TYPE'] ) ) {
	header('Content-Type: text/html; charset=utf-8');
	require __DIR__ . '/index.html';
	exit;
}

$error = function ( $data, $status = 500 ) {
	header('Content-Type: application/json', true, 500);
	$data['error'] = true;
	echo json_encode($data);
	exit;
};

$data = json_decode( file_get_contents( 'php://input' ) );

foreach ( [ 'ticket', 'pr', 'username', 'password' ] as $key ) {
	if ( empty( $data->$key ) ) {
		$error([
			'message' => 'Missing required parameter.',
		], 400);
	}
}

$ticket = intval( $data->ticket );

$url = 'https://core.trac.wordpress.org/login/xmlrpc';
$headers = array(
	'Content-Type' => 'application/xml',
);

$encoder = new \Comodojo\Xmlrpc\XmlrpcEncoder();
$patch = base64_encode( $data->patch );
$encoder->setValueType( $patch, 'base64' );
$params = [
	// int ticket
	(int) $ticket,
	// string filename
	sprintf( '%s.diff', $ticket ),
	// string description
	sprintf( 'Patch from https://github.com/WordPress/WordPress/pull/%d', (int) $data->pr ),
	// Binary data
	$patch,
	// Boolean replace
	false
];
$body = $encoder->encodeCall('ticket.putAttachment', $params);
$options = array(
	'auth' => array( $data->username, $data->password ),
);

try {
	$response = Requests::post( $url, $headers, $body, $options );
	$response->throw_for_status();
} catch ( Exception $e ) {
	$error([
		'message' => sprintf( 'Received an error from Trac: %s', $e->getMessage() ),
	]);
}

$decoder = new \Comodojo\Xmlrpc\XmlrpcDecoder();
$response = $decoder->decodeResponse( $response->body );

header('Content-Type: application/json', true, 201);
echo json_encode([
	'message' => 'Uploaded succcessfully!',
	'error' => false,
	'filename' => $response,
]);
