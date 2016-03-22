<?php

class XmlrpcEncoderTest extends \PHPUnit_Framework_TestCase {

    public function testEncodeMethodCallListMethods() {
        
        $encoder = new \Comodojo\Xmlrpc\XmlrpcEncoder();

        $call = $encoder->encodeCall("system.listMethods");

        $this->assertXmlStringEqualsXmlFile(__DIR__."/../resources/methodCall_listMethods.xml", $call);

    }

    public function testEncodeMethodResponseListMethods() {
        
        $methods = array(
            "system.listMethods",
            "system.methodSignature",
            "system.methodHelp",
            "system.multicall",
            "system.shutdown",
            "sample.add"
        );

        $encoder = new \Comodojo\Xmlrpc\XmlrpcEncoder();

        $response = $encoder->encodeResponse( $methods );

        $this->assertXmlStringEqualsXmlFile(__DIR__."/../resources/methodResponse_listMethods.xml", $response);

    }

    public function testEncodeErrorResponse() {

        $encoder = new \Comodojo\Xmlrpc\XmlrpcEncoder();

        $response = $encoder->encodeError( 300, "Invalid parameters" );

        $this->assertXmlStringEqualsXmlFile(__DIR__."/../resources/methodResponse_error.xml", $response);

    }

    public function testEncodeMultiCall() {

        $encoder = new \Comodojo\Xmlrpc\XmlrpcEncoder();

        $response = $encoder->encodeMulticall( 
            array(
                "my.method" => array( "john"),
                "another.method" => array( "doe" )
            )
        );

        $this->assertXmlStringEqualsXmlFile(__DIR__."/../resources/methodCall_systemMulticall.xml", $response);

    }

    public function testEncodeMultiCallRespomse() {

        $encoder = new \Comodojo\Xmlrpc\XmlrpcEncoder();

        $values = $encoder->encodeResponse( array(

            array("success"=>true),

            array("faultCode"=>300, "faultString"=>"Invalid parameters")

        ) );

        $this->assertXmlStringEqualsXmlFile(__DIR__."/../resources/methodResponse_systemMulticall.xml", $values);

    }

    public function testEncodeRequestWithCdata() {

        $encoder = new \Comodojo\Xmlrpc\XmlrpcEncoder();

        $data = array(
            "tag"  => "jhon",
            "data" => "<![CDATA[function(x) { return x; }]]>"
        );

        $encoder->setValueType($data['data'], "cdata");

        $call = $encoder->encodeCall("test.cdata", $data);

        // phpunit will file loading xml with cdata
        $this->assertStringEqualsFile(__DIR__."/../resources/methodCall_testCdata.xml", $call);

    }

    public function testEncodeRequestExNil() {

        $encoder = new \Comodojo\Xmlrpc\XmlrpcEncoder();

        $encoder->useExNil();

        $data = array(
            "tag" => "jhon",
            "nil" => null
        );

        $call = $encoder->encodeCall("test.nil", $data);

        // phpunit will file loading xml with ex:nil
        $this->assertStringEqualsFile(__DIR__."/../resources/methodCall_testNil.xml", $call);

    }

    public function testEncodeRequestBase64() {

        $encoder = new \Comodojo\Xmlrpc\XmlrpcEncoder();

        $data = array(
            "tag"  => "jhon",
            "base" => base64_encode("ciao")
        );

        $encoder->setValueType($data['base'], "base64");

        $call = $encoder->encodeCall("test.base", $data);

        $this->assertXmlStringEqualsXmlFile(__DIR__."/../resources/methodCall_testBase.xml", $call);

    }

    public function testEncodeMultiCallSameMethodBug() {

        $encoder = new \Comodojo\Xmlrpc\XmlrpcEncoder();

        $response = $encoder->encodeMulticall( 
            array(
                array("my.method", array( "john")),
                array("my.method", array( "doe" ))
            )
        );

        $this->assertXmlStringEqualsXmlFile(__DIR__."/../resources/methodCall_systemMulticall_same_method_bug.xml", $response);

    }

}
