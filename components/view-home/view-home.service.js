(function() {
  'use strict';
  // A service for "Split Loot"
  angular.
  module('viewHome').
  factory('homeService', homeService);

  //Took out http object injection
  //homeService.$inject = ['$http'];

  // Home service (move this over to loot service)
  function homeService() { //$http
    var service = {
    }
    return service;

  }
})();