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

app.controller('HomePageController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.helloWorld = 'hi'
    $timeout(function () {
        $scope.helloWorld = ''
    }, 2000)
}])