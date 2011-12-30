/*jshint asi:true, nodejs:true, laxbreak:true*/

var url = require('url')
var http = require('http')
var https = require('https')

exports.request = function(options, data, callback){
    if (arguments.length == 2) callback = data, data = callback
    
    function handleResponse(res) {
        console.info("%s ← %s\thttp://%s:%s%s", res.statusCode, options.method, options.host, options.port, options.path)
        // console.info('HEADERS\t', res.headers)

        if (!callback) return

        res.setEncoding('utf8')
        var responseData = ''
        res.on('data', function(chunk) {
            responseData += chunk
        })
        res.on('end', function() {
            try {
                responseData = JSON.parse(responseData)
            } catch (e) {}
            
            if (res.statusCode == 303) {
                var location = url.parse(res.headers.location)
                location.method = 'GET'
                if (!(location.hostname || location.host))
                    location.hostname = location.host = options.host || options.hostname
                if (!location.port) location.port = options.port
                return exports.request(location, data, callback)
            }
            callback(res.statusCode, responseData || res.headers)
        })
    }

    if (!options.headers) options.headers = {}
    options.headers['Accept'] = 'application/json'
    
    if (data != undefined) data = JSON.stringify(data)
    if (data != undefined) {
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        options.headers['Content-Length'] = data.length
    }

    var req = (options.protocol && options.protocol.indexOf('https')+1 ? https : http).request(options, handleResponse)
    if (callback) req.on('error', callback)
    if (data != null) req.write(data)
    req.end()
}
