var pillowcase = require('./pillowcase')

var GitHub = pillowcase.cd('https://api.github.com/')
var subtleGradient = GitHub.cd('users', 'subtleGradient')

console.assert(
    GitHub.cd('users', 'subtleGradient')
    ===
    GitHub.cd('users/subtleGradient')
    &&
    GitHub.cd('users/subtleGradient')
    ===
    pillowcase.cd('https://api.github.com/users/subtleGradient')
    &&
    pillowcase.cd('https://api.github.com/users/subtleGradient')
    ===
    pillowcase.cd('https://api.github.com','users','subtleGradient')
    ,'must recycle a pillowcase when it has the same url'
)

subtleGradient.get(function(error, subtleGradient){
    console.log(subtleGradient)
})

subtleGradientRepos = subtleGradient.get('repos', function(error, repos){
    console.log(repos.map(function(repo){
        return repo.name
    }).sort())
})
