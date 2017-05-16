var Api = (function () {
    var requestPayload;
    var responsePayload;
    var messageEndpoint = '/api/message';

    // Publicly accessible methods defined
    return {
        sendRequest: sendRequest,

        // The request/response getters/setters are defined here to prevent internal methods
        // from calling the methods without any of the callbacks that are added elsewhere.
        getRequestPayload: function () {
            return requestPayload;
        },
        setRequestPayload: function (newPayloadStr) {
            requestPayload = JSON.parse(newPayloadStr);
        },
        getResponsePayload: function () {
            return responsePayload;
        },
        setResponsePayload: function (newPayloadStr) {
            responsePayload = JSON.parse(newPayloadStr);
        }
    };

    // Send a message request to the server
    function sendRequest(text, context) {
        // Build request payload
        var payloadToWatson = {};
        if (text) {
            payloadToWatson.input = {
                text: text
            };
        }
        if (context) {
            payloadToWatson.context = context;
        }

        // Built http request
        var http = new XMLHttpRequest();
        http.open('POST', messageEndpoint, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange = function () {
            if (http.readyState === 4 && http.status === 200 && http.responseText) {
                if (http.responseText.search('DatabaseLookUp') > 0) {
                    var watsonOutput = http.responseText;
                    var jasonObject = JSON.parse(watsonOutput);
                    jasonObject.output.text.length = 0;
                    jasonObject.output.text.push("No return status found");
                    Api.setResponsePayload(JSON.stringify(jasonObject));
                    //var customhttp = new XMLHttpRequest();

                    //customhttp.open('GET', "http://localhost/ReturnStatusAPI/api/values/" + text, false);
                    //customhttp.onreadystatechange = function () {
                    //    if (customhttp.readyState === 4 && customhttp.status === 200 && customhttp.response) {
                    //        var watsonOutput = http.responseText;
                    //        var jasonObject = JSON.parse(watsonOutput);
                    //        jasonObject.output.text.length = 0;
                    //        jasonObject.output.text.push(customhttp.response);
                    //        Api.setResponsePayload(JSON.stringify(jasonObject));
                    //    }
                    //};
                    //customhttp.send();
                }
                else {
                    Api.setResponsePayload(http.responseText);
                }
            }
        };

        var params = JSON.stringify(payloadToWatson);
        // Stored in variable (publicly visible through Api.getRequestPayload)
        // to be used throughout the application
        if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
            Api.setRequestPayload(params);
        }

        // Send request
        http.send(params);
    }
}());
