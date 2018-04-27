(function() {
  'use strict';

  // DnDash
  // modues used are injected here
  angular.module('DnDash', [
    'ui.bootstrap',
    //'ui.sortable',
    'as.sortable',
    'ngRoute',
    'viewHome',
    'viewAbout'
  ]);
})();