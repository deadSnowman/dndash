(function() {
  'use strict';

  angular.
  module('viewHome').
  config(angularConfig);

  angularConfig.$inject = ['$locationProvider', '$routeProvider'];
  function angularConfig($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.when('/home', {
      template: '<view-home></view-home>'
    })
    .otherwise({ redirectTo: '/home' });
  }
})();