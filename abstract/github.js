const GitHubApi = require('github')

var github = new GitHubApi({
  version: '3.0.0',
  headers: {
    'user-agent': 'Signum by ClassCoder'
  }
})

class Repository {
  constructor(user, repo, cb) {
    github.repos.get({
      user: user,
      repo: repo
    }, function (err, res) {
      if (err != null) return cb(err)
      this.repo = res
      this.int_name = res.name
      this.int_description = res.description
      this.int_fullName = res.full_name
      this.int_userName = res.owner.login
      cb(null, this)
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

  getFileContents (path, ref) {
    return new Promise(function (resolve, reject) {
      if (typeof path !== 'string') return reject(new TypeError('path must be a string.'))
      github.repos.getContent({
        user: this.repo.owner.login,
        repo: this.userName,
        path: path,
        ref: ref
      }, function (err, res) {
        if (err) return reject(err)
        resolve(res)
      })
    })
  }
}
