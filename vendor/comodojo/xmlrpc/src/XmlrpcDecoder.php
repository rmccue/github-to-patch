<?php namespace Comodojo\Xmlrpc;

use \Comodojo\Exception\XmlrpcException;
use \Exception;

/** 
 * XML-RPC decoder
 *
 * @package     Comodojo Spare Parts
 * @author      Marco Giovinazzi <marco.giovinazzi@comodojo.org>
 * @license     MIT
 *
 * LICENSE:
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

class XmlrpcDecoder {

    private $is_fault = false;

    public function __construct() {

        libxml_use_internal_errors(true);

    }

    /**
     * Decode an xmlrpc response
     *
     * @param   string  $response
     *
     * @return  array
     *
     * @throws  \Comodojo\Exception\XmlrpcException
     */
    public function decodeResponse($response) {

        $xml_data = simplexml_load_string($response);

        if ( $xml_data === false ) throw new XmlrpcException("Not a valid XMLRPC response");

        $data = array();

        try {

            if ( isset($xml_data->fault) ) {

                $this->is_fault = true;

                array_push($data, $this->decodeValue($xml_data->fault->value));

            } else if ( isset($xml_data->params) ) {

                foreach ( $xml_data->params->param as $param ) array_push($data, $this->decodeValue($param->value));

            } else throw new XmlrpcException("Uncomprensible response");

        } catch (XmlrpcException $xe) {
            
            throw $xe;
            
        }

        return isset($data[0]) ? $data[0] : $data;

    }

    public function isFault() {

        return $this->is_fault;

    }

    /**
     * Decode an xmlrpc request.
     *
     * Can handle single or multicall requests and return an array of: [method], [data]
     *
     * WARNING: in case of multicall, it will not throw any exception for an invalid
     * boxcarred request; a null value will be placed instead of array(method,params).
     *
     * @param   string  $request
     *
     * @return  array
     *
     * @throws  \Comodojo\Exception\XmlrpcException
     */
    public function decodeCall($request) {

        $xml_data = simplexml_load_string($request);

        if ( $xml_data === false ) throw new XmlrpcException("Not a valid XMLRPC call");

        if ( !isset($xml_data->methodName) ) throw new XmlrpcException("Uncomprensible request");
            
        $method_name = $this->decodeString($xml_data->methodName[0]);

        if ( $method_name == "system.multicall" ) {

            try {
        
                $data = $this->multicallDecode($xml_data);

            } catch (XmlrpcException $xe) {
                
                throw $xe;

            }

        } else {

            $parsed = array();

            try {
            
                foreach ( $xml_data->params->param as $param ) $parsed[] = $this->decodeValue($param->value);

            } catch (XmlrpcException $xe) {
                
                throw $xe;

            }

            $data = array($method_name, $parsed);

        }

        return $data;

    }

    /**
     * Decode an xmlrpc multicall
     *
     * @param   string  $request
     *
     * @return  array
     *
     * @throws  \Comodojo\Exception\XmlrpcException
     */
    public function decodeMulticall($request) {

        $xml_data = simplexml_load_string($request);

        if ( $xml_data === false ) throw new XmlrpcException("Not a valid XMLRPC multicall");

        if ( !isset($xml_data->methodName) ) throw new XmlrpcException("Uncomprensible multicall request");

        if ( $this->decodeString($xml_data->methodName[0]) != "system.multicall" ) throw new XmlrpcException("Invalid multicall request");

        try {
        
            $data = $this->multicallDecode($xml_data);

        } catch (XmlrpcException $xe) {
            
            throw $xe;

        }

        return $data;

    }

    /**
     * Decode a value from xmlrpc data
     *
     * @param   mixed   $value
     *
     * @return  mixed
     *
     * @throws  \Comodojo\Exception\XmlrpcException
     */
    private function decodeValue($value) {

        $children = $value->children();

        if ( count($children) != 1 ) throw new XmlrpcException("Cannot decode value: invalid value element");

        $child = $children[0];

        $child_type = $child->getName();

        switch ( $child_type ) {

            case "i4":
            case "int":
                $return_value = $this->decodeInt($child);
            break;

            case "double":
                $return_value = $this->decodeDouble($child);
            break;

            case "boolean":
                $return_value = $this->decodeBool($child);
            break;

            case "base64":
                $return_value = $this->decodeBase($child);
            break;
            
            case "dateTime.iso8601":
                $return_value = $this->decodeIso8601Datetime($child);
            break;

            case "string":
                $return_value = $this->decodeString($child);
            break;

            case "array":
                $return_value = $this->decodeArray($child);
            break;
            
            case "struct":
                $return_value = $this->decodeStruct($child);
            break;
            
            case "nil":
            case "ex:nil":
                $return_value = $this->decodeNil();
            break;
            
            default:
                throw new XmlrpcException("Cannot decode value: invalid value type");
            break;

        }

        return $return_value;

    }

    /**
     * Decode an XML-RPC <base64> element
     */
    private function decodeBase($base64) {

        return base64_decode($this->decodeString($base64));

    }

    /**
     * Decode an XML-RPC <boolean> element
     */
    private function decodeBool($boolean) {

        return filter_var($boolean, FILTER_VALIDATE_BOOLEAN);

    }

    /**
     * Decode an XML-RPC <dateTime.iso8601> element
     */
    private function decodeIso8601Datetime($date_time) {
        
        return strtotime($date_time);

    }

    /**
     * Decode an XML-RPC <double> element
     */
    private function decodeDouble($double) {

        return (double) ($this->decodeString($double));

    }

    /**
     * Decode an XML-RPC <int> or <i4> element
     */
    private function decodeInt($int) {

        return filter_var($int, FILTER_VALIDATE_INT);

    }

    /**
     * Decode an XML-RPC <string>
     */
    private function decodeString($string) {

        return (string) $string;

    }

    /**
     * Decode an XML-RPC <nil/>
     */
    private function decodeNil() {

        return null;

    }

    /**
     * Decode an XML-RPC <struct>
     */
    private function decodeStruct($struct) {

        $return_value = array();

        foreach ( $struct->member as $member ) {

            $name = $member->name."";
            $value = $this->decodeValue($member->value);
            $return_value[$name] = $value;

        }

        return $return_value;

    }

    /** 
     * Decode an XML-RPC <array> element
     */
    private function decodeArray($array) {

        $return_value = array();

        foreach ( $array->data->value as $value ) {

            $return_value[] = $this->decodeValue($value);

        }

        return $return_value;

    }

    /** 
     * Decode an XML-RPC multicall request (internal)
     * @param \SimpleXMLElement $xml_data
     */
    private function multicallDecode($xml_data) {

        $data = array();

        try {

            $calls = $xml_data->params->param->value->children();

            $calls_array = $this->decodeArray($calls[0]);

            foreach ( $calls_array as $call ) {
                
                $data[] = (!isset($call['methodName']) || !isset($call['params'])) ? null : array($call['methodName'], $call['params']);

            }
            
        } catch (XmlrpcException $xe) {
            
            throw $xe;

        }
        
        return $data;

    }

}
