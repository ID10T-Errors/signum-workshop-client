require('./main.css')

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
            redirectTo: '/home'
        })
}])

app.service('SectionService', [function () {
    var sections = {
        1: {
            name: 'hello world'
        }
    }
    return {
        getSection: function (index) {
            return sections[index]
        },
        setSection: function (index, value) {
            sections[index] = value
        },
        getSections: function () {
            return angular.copy(sections)
        }
    }
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
                    } catch(e) {
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
