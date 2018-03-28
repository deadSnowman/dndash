(function() {
  'use strict';

  angular.
  module('viewHome').
  config(angularConfig);

  angularConfig.$inject = ['$locationProvider', '$routeProvider'];
  // Angular Routing for /home, and redirect of if not specified
  function angularConfig($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    // Route for template render
    $routeProvider.when('/home', {
      template: '<view-home></view-home>'
    })
    .otherwise({ redirectTo: '/home' });
  }
})();