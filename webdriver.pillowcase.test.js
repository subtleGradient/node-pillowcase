var pillowcase = require('./pillowcase')

////////////////////////////////////////////////////////////////////////////////

var ChromeDriver = pillowcase.cd('http://localhost:9515/')
ChromeDriver.get('status', log)

ChromeDriver.post('session', {desiredCapabilities:{browserName:'chrome'}}, function(statusCode, session){
    console.log({capabilities: session.value})
    console.log('')
    
    var chrome = ChromeDriver.cd('session', session.sessionId)
    
    chrome.set('url', {url:'http://www.subtlegradient.com/'}, function(){
        log.apply(this,arguments)
        chrome.get('url', function(){
            log.apply(this,arguments)
            setTimeout(function(){
                chrome.delete(log) // close out the session
            }, 5e3)
        })
    })
})

////////////////////////////////////////////////////////////////////////////////

// var WebDriver = pillowcase.cd('http://localhost:4444/wd/hub/')
// WebDriver.get('status', log)

////////////////////////////////////////////////////////////////////////////////

function log(statusCode, data){
    // if (statusCode) console.error(statusCode)
    console.log(data)
    console.log('')
}
