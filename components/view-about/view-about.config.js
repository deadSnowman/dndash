(function() {
  'use strict';

  angular.
  module('viewAbout').
  config(angularConfig);

  angularConfig.$inject = ['$locationProvider', '$routeProvider'];
  // Angular Routing for /about, and redirect of if not specified
  function angularConfig($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    // Route for template render
    $routeProvider.when('/about', {
      template: '<view-about></view-about>'
    })
    .otherwise({ redirectTo: '/home' });
  }
})();