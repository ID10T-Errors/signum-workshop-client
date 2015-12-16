const GitHubApi = require('github')

var github = new GitHubApi({
    version: '3.0.0',
    headers: {
        'user-agent': 'Signum by ClassCoder'
    },
    host: 'api.github.com',
    pathPrefix: ''
})

export class Repository {
    constructor (user, repo, cb) {
        var self = this
        github.repos.get({
            user: user,
            repo: repo
        }, function (err, res) {
            if (err != null) return cb(err)
            self.repo = res
            self.int_name = res.name
            self.int_description = res.description
            self.int_fullName = res.full_name
            self.int_userName = res.owner.login
            cb(null, self)
        })
    }

    get name () {
        if (this.int_name == null) throw new ReferenceError('The name hasn\'t been defined yet. Has the constructor callback been called yet?')
        return this.int_name
    }

    get description () {
        if (this.int_description == null) throw new ReferenceError('The description hasn\'t been defined yet. Has the constructor callback been called yet?')
        return this.int_description
    }

    get fullName () {
        if (this.int_fullName == null) throw new ReferenceError('The full name hasn\'t been defined yet. Has the constructor callback been called yet?')
        return this.int_fullName
    }

    get userName () {
        if (this.int_userName == null) throw new ReferenceError('The username hasn\'t been defined yet. Has the constructor callback been called yet?')
        return this.int_userName
    }

    cat (path, ref) {
        var self = this
        return new Promise(function (resolve, reject) {
            if (typeof path !== 'string') return reject(new TypeError('path must be a string.'))
            github.repos.getContent({
                user: self.userName,
                repo: self.name,
                path: path,
                ref: ref
            }, function (err, res) {
                if (err) return reject(err)
                if (typeof res === 'array') return reject(new TypeError('path is a path of a directory'))
                resolve(atob(res.content))
            })
        })
    }

    ls (path, ref) {
        var self = this
        return new Promise(function (resolve, reject) {
            if (typeof path !== 'string') return reject(new TypeError('path must be a string.'))
            github.repos.getContent({
                user: self.userName,
                repo: self.name,
                path: path,
                ref: ref
            }, function (err, res) {
                if (err) return reject(err)
                if (res.type !== 'array') return reject(new TypeError('path is a path of a file'))
                res.map(file => file.name
                )
                resolve(res)
            })
        })
    }

    lsBranches () {
        var self = this
        return new Promise(function (resolve, reject) {
            github.repos.getBranches({
                user: self.userName,
                repo: self.name,
                per_page: 9999           // There is no overkill.
            }, function (err, res) {
                if (err) return reject(err)
                var branches = []
                for (branch of res) {
                    branch.name.commit = branch.commit.sha
                    branches.push(branch.name)
                }
                resolve(branches)
            })
        })
    }
}
