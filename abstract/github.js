const GitHubApi = require('github')

var github = new GitHubApi({
  version: '3.0.0',
  headers: {
    'user-agent': 'Signum by ClassCoder'
  }
})
