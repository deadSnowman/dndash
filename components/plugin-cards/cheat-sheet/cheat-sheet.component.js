(function () {
  'use strict';

  angular.
    module('cheatSheet').
    controller('CheatSheetCtrl', ['$scope', '$window', CheatSheetCtrl]);

    function CheatSheetCtrl($scope, $window) {
      const base = 'components/plugin-cards/cheat-sheet/';

      $scope.tabs = [
        { title:'Conditions', content: base + 'conditions.html' },
        { title:'Actions', content: base + 'actions.html' }
      ];
    }

})();