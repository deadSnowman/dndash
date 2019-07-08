(function() {
  'use strict';

  angular.
  module('viewAbout').
  config(angularConfig);

  angularConfig.$inject = ['$locationProvider', '$routeProvider'];
  function angularConfig($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.when('/about', {
      template: '<view-about></view-about>'
    })
    .otherwise({ redirectTo: '/home' });
  }
})();