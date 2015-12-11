const angular = require('angular')
const ngRoute = require('angular-route')

const app = angular.module('signum', [ngRoute])

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/section/:section', {
            templateUrl: 'partials/section.html',
            controller: 'SectionController'
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