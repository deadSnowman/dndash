(function() {
  'use strict';

  // Define controller for the DnDash module
  angular.module('DnDash')
    .controller('DnDashController', DnDashController);

  function DnDashController() {
    var self = this;
    self.titleName = "DnDash";
  }

})();