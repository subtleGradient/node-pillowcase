/*jshint asi:true, nodejs:true, laxbreak:true*/

if (module.id == '.') process.nextTick(function(){ require('./pillowcase.test') })

var _request = require('./request').request
var url = require('url')

////////////////////////////////////////////////////////////////////////////////

var pillowcase = exports

pillowcase.constructor = function(){}

pillowcase.constructor.prototype = pillowcase

pillowcase._cache = {}

pillowcase.location = null

pillowcase.cd = function(path){
    path = Array.prototype.join.call(arguments, '/')
    var href = ''
    if (this.location && this.location.href) href = this.location.href
    if (href) href = href.replace(/\/?$/,'/')
    href += path.replace(/^\//,'')
    
    var newPillowcase = this._cache[href]
    if (newPillowcase) return newPillowcase
    
    newPillowcase = this._cache[href] = Object.create(this)
    newPillowcase.constructor.call(newPillowcase)
    newPillowcase.location = url.parse(href)
    return newPillowcase
}

'GET DELETE HEAD'.split(' ').forEach(function(METHOD){
    var method = METHOD.toLowerCase()
    pillowcase[method] = function(key, callback){
        if (arguments.length == 1) key = null, callback = arguments[0]
        
        var pillowcase = this
        if (key) pillowcase = this.cd(key)
        pillowcase.location.method = METHOD
        _request(pillowcase.location, callback)
        return pillowcase
    }
})

'POST'.split(' ').forEach(function(METHOD){
    var method = METHOD.toLowerCase()
    pillowcase[method] = function(key, data, callback){
        if (arguments.length == 2) key = null, data = arguments[0], callback = arguments[1]
        if (arguments.length == 1) key = null, data = null, callback = arguments[0]
        
        var pillowcase = this
        if (key) pillowcase = this.cd(key)
        pillowcase.location.method = METHOD
        _request(pillowcase.location, data, callback)
        return pillowcase
    }
})

pillowcase.set = pillowcase.post
