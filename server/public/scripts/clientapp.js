var app = angular.module('app', ['ngRoute', 'ngAudio']);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/title', {
      templateUrl: '/views/title.html',
      controller: "TitleController"
    })
    .when('/case', {
      templateUrl: '/views/case.html',
      controller: "GameController"
    })
    .otherwise({
      redirectTo: 'title'
    });
}]);
