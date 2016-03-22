# comodojo/xmlrpc

[![Build Status](https://api.travis-ci.org/comodojo/xmlrpc.png)](http://travis-ci.org/comodojo/xmlrpc) [![Latest Stable Version](https://poser.pugx.org/comodojo/xmlrpc/v/stable)](https://packagist.org/packages/comodojo/xmlrpc) [![Total Downloads](https://poser.pugx.org/comodojo/xmlrpc/downloads)](https://packagist.org/packages/comodojo/xmlrpc) [![Latest Unstable Version](https://poser.pugx.org/comodojo/xmlrpc/v/unstable)](https://packagist.org/packages/comodojo/xmlrpc) [![License](https://poser.pugx.org/comodojo/xmlrpc/license)](https://packagist.org/packages/comodojo/xmlrpc) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/comodojo/xmlrpc/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/comodojo/xmlrpc/?branch=master) [![Code Coverage](https://scrutinizer-ci.com/g/comodojo/xmlrpc/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/comodojo/xmlrpc/?branch=master)

Yet another php xmlrpc decoder/encoder.

Main features:

- support for `nil` and `ex:nil`
- implements true, XML compliant, HTML numeric entities conversion
- support for CDATA values

## Installation

- Using Composer

    Install [composer](https://getcomposer.org/), then:

    `` composer require comodojo/xmlrpc 1.0.* ``

-   Manually

    Download zipball from GitHub, extract it, include `src/XmlrpcEncoder.php`, `src/XmlrpcDecoder.php` and `src/Exception/XmlrpcException.php` in your project.

## Encoding

-   Create an encoder instance:

    ```php
    // create an encoder instance
    $encoder = new \Comodojo\Xmlrpc\XmlrpcEncoder();

    // (optional) set character encoding
    $encoder->setEncoding("utf-8");

    // (optional) use ex:nil instead of nil
    $encoder->useExNil();

    // (optional) declare special types in $data
    $encoder->setValueType($data['a_value'], "base64");
    $encoder->setValueType($data['b_value'], "datetime");
    $encoder->setValueType($data['c_value'], "cdata");
    
    // Wrap actions in a try/catch block (see below)
    try {

        /* encoder actions */

    } catch (\Comodojo\Exception\XmlrpcException $xe) {

        /* someting goes wrong during encoding */

    } catch (\Exception $e) {
        
        /* generic error */

    }

    ```

-   single call:

    ```php
    $call = $encoder->encodeCall("my.method", array("user"=>"john", "pass" => "doe")) ;

    ```

-   multicall:

    ```php
    $multicall = $encoder->encodeMulticall( array (
        "my.method" => array( "user"=>"john", "pass" => "doe" ),
        "another.method" => array( "value"=>"foo", "param" => "doe" ),
    );

    ```

    Alternate syntax (duplicated-methods safe):

    ```php
    $multicall = $encoder->encodeMulticall( array (
        array( "my.method", array( "user"=>"john", "pass" => "doe" ) ),
        array( "another.method", array( "value"=>"foo", "param" => "doe" ) )
    );

    ```

-   single call success response

    ```php
    $response = $encoder->encodeResponse( array("success"=>true) );

    ```

-   single call error response

    ```php
    $error = $encoder->encodeError( 300, "Invalid parameters" );

    ```

-   multicall success/error (faultString and faultCode should be explicitly declared in $data)

    ```php
    $values = $encoder->encodeResponse( array(

        array("success"=>true),

        array("faultCode"=>300, "faultString"=>"Invalid parameters")

    );

    ```

## Decoding

-   create a decoder instance:

    ```php
    // create a decoder instance
    $decoder = new \Comodojo\Xmlrpc\XmlrpcDecoder();
    
    // Wrap actions in a try/catch block (see below)
    try {

        /* decoder actions */

    } catch (\Comodojo\Exception\XmlrpcException $xe) {

        /* someting goes wrong during decoding */

    }

    ```

-   decode single or multicall

    ```php
    $incoming_call = $decoder->decodeCall( $xml_data );

    ```

    In case of single request, method will return an array like:

    ```php
    array (
        0 => "my.method",
        1 =>  array(
            "param_1" => "value_1",
            "param_2" => "value_2",
            ...
        )
    )

    ```

    In case of multicall:

    ```php
    array (
        0 => array (
            0 => "my.method",
            1 =>  array(
                "param_1" => "value_1",
                "param_2" => "value_2",
                ...
            )
        ),
        1 => array (
            0 => "my.otherMethod",
            1 =>  array(
                "param_a" => "value_a",
                "param_b" => "value_b",
                ...
            )
        )
    )

    ```

-   decode response
    
    ```php
    $returned_data = $decoder->decodeResponse( $xml_response_data );

    ```

## Documentation

- [API](https://api.comodojo.org/libs/Comodojo/Xmlrpc.html)

## Contributing

Contributions are welcome and will be fully credited. Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## License

`` comodojo/xmlrpc `` is released under the MIT License (MIT). Please see [License File](LICENSE) for more information.