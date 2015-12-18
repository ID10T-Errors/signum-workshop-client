require('./main.css')

const async = require('async')

const angular = require('angular')
const ngRoute = require('angular-route')
const ngMaterial = require('angular-material')
const ngSanitize = require('angular-sanitize')
require('ace-webapp')
const uiAce = require('angular-ui-ace')

const github = require('./abstract/github')
const markdown = require('./abstract/markdown')

const app = angular.module('signum', [ngRoute, ngMaterial, 'ui.ace', 'ngSanitize'])

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
      .when('/section/:section', {
        templateUrl: 'partials/section.html',
        controller:  'SectionController'
      })
      .when('/section/:section/:problem', {
        templateUrl: 'partials/problem.html',
        controller:  'ProblemController'
      })
      .when('/home', {
        templateUrl: 'partials/home.html',
        controller:  'HomePageController'
      })
      .otherwise({
        redirectTo: '/section/1/1'
      })
}])

app.service('SectionService', ['$rootScope', '$sce', function ($scope, $sce) {
  var sections = [
    {
      title:    'Packet 1',
      problems: []
    }
  ]
  var repo = new github.Repository('jdeans289', 'java-practice-problems', function (err) {
    if (err) throw err
    repo.ls('/CS1-packet1', 'gh-pages').then(function (files) {
      var yamlFiles = []
      for (let file of files) {
        if (file.indexOf('.yml') > -1) {
          yamlFiles.push(file)
        }
      }
      async.map(yamlFiles, function (file, callback) {
        repo.catYaml('/CS1-packet1/' + file, 'gh-pages').then(function (contents) {
          var problem = {};
          try {
            problem.description = $sce.trustAsHtml(markdown.toHtml(contents.overview))
          } catch (e) {
            problem.description = $sce.trustAsHtml(contents.overview)
          }
          problem.template = 'class ' + (contents.filename.split('.')[0]) + ' {\n    \n}'
          problem.name = contents.title
          problem.filename = contents.filename
          problem.contents = contents
          console.log(problem)
          callback(null, problem)
        }).catch(function (err) {
          console.error(err)
          callback()
        })
      }, function (err, problems) {
        console.log('problems: ', problems)
        var actualProblems = []
        for (let problem of problems) {
          if (problem != null) actualProblems.push(problem)
        }
        sections[0].problems = actualProblems
        for (let updator of updators) {
          updator()
        }
        console.log(actualProblems)
      })
    })
  })
  var updators = []
  return {
    getSection:  function (index) {
      return sections[index]
    },
    setSection:  function (index, value) {
      sections[index] = value
    },
    getSections: function () {
      return sections
    },
    update:      function (callback) {
      updators.push(callback)
    }
  }
}
])

app.service('ProblemService', ['SectionService', function (SectionService) {
  var currentProblem = SectionService.getSection(0).problems[0]
  var updators = []
  return {
    getCurrentProblem: () => currentProblem,
    setCurrentProblem: function (newCurrentProblem) {
      currentProblem = newCurrentProblem
      for (let updator of updators) {
        updator(currentProblem)
      }
    },
    update: callback => updators.push(callback)
  }
}])

app.controller('ToolbarController', ['$scope', 'SectionService', 'ProblemService', function ($scope, SectionService, ProblemService) {
  window.$scope = $scope
  $scope.sections = SectionService.getSections()
  $scope.currentSection = $scope.sections[$scope.section]
  $scope.$watch('section', function () {
    $scope.currentSection = $scope.sections[$scope.section]
  })
  $scope.section = 0
  $scope.$watch('problem', function () {
    ProblemService.setCurrentProblem($scope.currentSection.problems[problem])
  })
  $scope.problem = 0
  SectionService.update(function () {
    $scope.$apply()
  })
}])

app.controller('HomePageController', ['$scope', '$timeout', 'SectionService', function ($scope, $timeout, SectionService) {
  $scope.helloWorld = 'hi'
  $timeout(function () {
    $scope.helloWorld = ''
  }, 2000)
  $scope.sections = SectionService.getSections()
}])

app.controller('SectionController', ['$scope', '$routeParams', 'SectionService', function ($scope, $routeParams, SectionService) {
  $scope.section = SectionService.getSection($routeParams.section)
}])

app.controller('ProblemController', ['$scope', 'ProblemService', '$http', function ($scope, ProblemService, $http) {
  ProblemService.update(function (problem) {
    $scope.problem = problem
    $scope.code = problem.template
  })
  $scope.run = function () {
    console.log('$scope.run', $scope.problem.contents.cases)
    var environment = {
      SIGNUM_CLASSNAME: $scope.problem.filename.split('.')[0],
      SIGNUM_CODE: $scope.code
    }
    for (let file in $scope.problem.contents.cases[0].files) {
      if ($scope.problem.contents.cases[0].files.hasOwnProperty(file)) {
        environment['SIGNUM_FILE_' + file] = $scope.problem.contents.cases[0].files[file]
      }
    }
    console.log(environment)
    return $http({
      method: 'POST',
      url: 'http://internal.ctftoolkit.com:8080/run/java',
      data: {
        environment: environment,
        code: $scope.code
      }
    }).then(function (output) {
      alert(output.data)
    }).catch(function (err) {
      alert(JSON.stringify(err))
    })
  }
  window.run = $scope.run
}])
