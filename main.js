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
            controller: 'SectionController'
        })
        .when('/section/:section/:problem', {
            templateUrl: 'partials/problem.html',
            controller: 'ProblemController'
        })
        .when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'HomePageController'
        })
        .otherwise({
            redirectTo: '/section/1/1'
        })
}])

app.service('SectionService', ['$rootScope', '$sce', function ($scope, $sce) {
    var sections = [
        {
            title: 'Packet 1',
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
        getSection: function (index) {
            return sections[index]
        },
        setSection: function (index, value) {
            sections[index] = value
        },
        getSections: function () {
            return angular.copy(sections)
        },
        update: function (callback) {
            updators.push(callback)
        }
    }
}
])

app.controller('ToolbarController', ['$scope', 'SectionService', function ($scope, SectionService) {
    $scope.sections = SectionService.getSections()
    $scope.section = 0
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

app.controller('ProblemController', ['$scope', '$sce', function ($scope, $sce) {
    var repo = new github.Repository('jdeans289', 'java-practice-problems', function (err) {
        if (err) throw err
        repo.ls('/CS1-packet1', 'gh-pages').then(function (files) {
            var yamlFiles = []
            for (let file of files) {
                if (file.indexOf('.yml') > -1) {
                    yamlFiles.push(file)
                }
            }
            repo.catYaml('/CS1-packet1/' + yamlFiles[Math.round(Math.random() * (yamlFiles.length - 1))], 'gh-pages').then(function (contents) {
                $scope.$apply(function () {
                    try {
                        $scope.problem.description = $sce.trustAsHtml(markdown.toHtml(contents.overview))
                    } catch (e) {
                        $scope.problem.description = $sce.trustAsHtml(contents.overview)
                    }
                    $scope.code = 'class ' + (contents.filename.split('.')[0]) + ' {\n    \n}'
                    $scope.problem.name = contents.title
                    $scope.problem.filename = contents.filename
                })
            })
            console.log(files)
        })
    })
    $scope.problem = {
        name: 'cat',
        description: 'Write a program that prints its stdin to its stdout.',
        filename: 'Cat.java'
    }
}])
