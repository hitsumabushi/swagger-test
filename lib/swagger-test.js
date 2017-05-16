'use strict';

var template = require('url-template');

var examples_tag = 'x-examples';

function getUriScheme(spec) {
    return ((spec.schemes || []).concat(['https']))[0];
}

function parseCase(spec, uri, method, x_exmaple) {
    // var uriTemplate = template.parse(uri);
    // var expandedUri = uriTemplate.expand(x_exmaple.request.params);
    // x_exmaple.request.uri = getUriScheme(spec) + '://' + spec.host + spec.basePath + expandedUri;
    x_exmaple.request.method = method;
    x_exmaple.request.uri = getUriScheme(spec) + '://' + spec.host + spec.basePath;
    return {
        description: x_exmaple.description || method + ' ' + uri,
        request: x_exmaple.request,
        responses: x_exmaple.responses
    };
}

function parse(spec, options) {

    options = options || {};

    var cases = [];

    Object.keys(spec.paths || {}).forEach(function (uri) {
        var path = spec.paths[uri];
        Object.keys(path).forEach(function (method) {
            var operation = path[method];
            if (operation['x-examples']) {
                operation['x-examples'].forEach(function (x_example) {
                    cases.push(parseCase(spec, uri, method, x_exmaple));
                });
            } else {
                console.log("No sample case found: path=%s, method=%s", path, path[method])
            }
        });
    });

    return cases;
}

module.exports.parse = parse;
