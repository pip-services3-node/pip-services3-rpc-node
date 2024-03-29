# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Remote Procedure Calls for Pip.Services in Node.js Changelog

## <a name="3.9.2"></a> 3.9.2 (2022-05-20)
### Bug Fixes
- HttpResponseSender fixed sendError addind error type and category 

## <a name="3.9.1"></a> 3.9.1 (2021-10-29)

### Bug Fixes
* **services** Fixed bug with formatting ArraySchema in swagger document

## <a name="3.9.0"></a> 3.9.0 (2021-10-21)

### Features
* **services**  Added RegRxp supporting to interceptors 
   Examples:
   - the interceptor route **"/dummies"** corresponds to all of this routes **"/dummies"**, **"/dummies/check"**, **"/dummies/test"**
   - the interceptor route **"/dummies$"** corresponds only for this route **"/dummies"**. The routes **"/dummies/check"**, **"/dummies/test"** aren't processing by interceptor
   Please, don't forgot, route in interceptor always automaticaly concateneted with base route, like this **service_base_route + route_in_interceptor**. 
   For example, "/api/v1/" - service base route, "/dummies$" - interceptor route, in result will be next expression - "/api/v1/dummies$"

## <a name="3.8.0"></a> 3.8.0 (2021-07-29)

### Features
* **services** Added configuration for CORS headers and origins

## <a name="3.7.0"></a> 3.7.0 (2021-04-21)

### Features
* **clients** Added TestRestClient
* **clients** Added TestCommandableHttpClient

## <a name="3.6.1"></a> 3.6.1 (2021-04-07)

### Bug Fixes
* **clients** Added PATCH method into RestClient

## <a name="3.5.2"></a> 3.5.2 (2021-03-5)

### Bug Fixes
* **clients** Updated createRequestRoute method


## <a name="3.5.1"></a> 3.5.1 (2021-03-5)

### Features
* **services** Added working with correlationId in headers
* **clients** Added working with correlationId in headers

### Bug Fixes
* **clients** Fixed bug with empty route in createRequestRoute method

## <a name="3.5.0"></a> 3.5.0 (2021-02-21)

### Features
* **services** Added integration with Swagger UI

## <a name="3.4.0"></a> 3.4.0 (2021-02-18)

### Features
* **services** Added processing correlation-id header

## <a name="3.3.3"></a> 3.3.3 (2021-02-10)

### Features
* Updated to the latest Restify version

### Bug Fixes
* Replaced restify-cors-middleware with restify-cors-middleware2 until restify-cors-middleware is updated to work with the latest restify (asuuming it ever is). See https://github.com/Tabcorp/restify-cors-middleware/issues/73
* Uses node:14 docker image to build/test

## <a name="3.2.2"></a> 3.2.2 (2020-04-08)

### Features
* **connect** HTTPS connection resolution with no credentials implemented for internal networks
* **tests** Added the color switch to the mocha task
* **log** Implemented a configurable date format for the elasticsearch index pattern.

### Bug Fixes
* Fixed the container logging about opening a rest client.
* Fixed the commandable service and client work with correlation id issues.
* Fixed the call counter metrics labels issue.

## <a name="3.2.1"></a> 3.2.1 (2019-11-22)

### Features
* **options** Added option for protocol upgrade

## <a name="3.1.0"></a> 3.1.0 (2019-02-04)

### Features
* **auth** Added authorizers: BasicAuthorizer, OwnerAuthorither and RoleAuthorither
* **connect** HttpConnectionResolver now supports HTTPS certificates
* **services** HttpEndpoint now supports HTTPS protocol and maintenance mode
* **services** Added RestOperations, AboutOperations, HeartbeatOperations and StatusOperations
* **services** Added registerRouteWithAuth and registerInterceptor methods in RestService

## <a name="2.9.0"></a> 2.9.0 (2018-04-05)

### Features
* **status** Made HeartbeatRestService route configurable
* **status** Made StatusRestService route configurable

## <a name="2.8.0"></a> 2.8.0 (2018-03-24)

### Features
* **status** Added HeartbeatRestService
* **status** Added StatusRestService

## <a name="2.7.0"></a> 2.7.0 (2018-03-05)

### Features
* **rest** Added HttpEndpoint

## <a name="2.6.0"></a> 2.6.0 (2017-05-15)

### Features
* **rest** Added HttpConnectionResolver
* **mqtt** Added MqttConnectionResolver
* **mqtt** Added MqttMessageQueue

## <a name="2.5.1"></a> 2.5.1 (2017-04-13)

### Bug Fixes
* Fixed schema validation

## <a name="2.5.0"></a> 2.5.0 (2017-05-01)

### Features
* **messaging** Changed MessageEnvelop.message to binary Buffer

## <a name="2.4.0"></a> 2.4.0 (2017-04-18)

### Features
* **rest** Added HttpRequestDetector class
* **rest** Added sendEmptyResult() to HttpResponseSender

### Breaking changes
* Renamed ResponseSender to HttpResponseSender

## <a name="2.3.0"></a> 2.3.0 (2017-04-02)

### Breaking changes
* Renamed CommandableRestClient to CommandableHttpClient
* Renamed CommandableRestService to CommandableHttpService

## <a name="2.2.3"></a> 2.2.3 (2017-03-29)

### Bug Fixes
* Fixed callback in RestClient.close
* Improved controller reference handling in direct client
* Added handling empty callbacks in commandable clients

## <a name="2.2.0"></a> 2.2.0 (2017-03-26)

### Features
* **direct** Added _dependencyResolver
* **seneca** Added CommandableSenecaService and CommandableSenecaClient
* **rest** Added CommandableRestService and CommandableRestClient

## <a name="2.1.3"></a> 2.1.3 (2017-03-21)

### Bug Fixes
* Made opening of SenecaClient and SenecaService asynchronous to avoid handup during plugin initialization

## <a name="2.1.0"></a> 2.1.0 (2017-03-16)

### Features
* **seneca** Added SenecaPlugin

## <a name="2.0.9"></a> 2.0.9 (2017-03-15)

### Bug Fixes
* Fixed local seneca connections

## <a name="2.0.0"></a> 2.0.0 (2017-02-27)

### Breaking Changes
* Migrated to **pip-services** 2.0
* Renamed IMessageQueue.getMessageCount to IMessageQueue.readMessageCount

## <a name="1.0.0"></a> 1.0.0 (2017-01-28)

Initial public release

### Features
* **messaging** Abstract and in-memory message queues
* **rest** RESTful service and client
* **seneca** Seneca service and client

### Bug Fixes
No fixes in this version

