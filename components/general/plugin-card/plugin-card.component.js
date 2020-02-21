(function () {
  'use strict';

  angular.
    module('DnDash').component('pluginCard', {
      templateUrl: 'components/general/plugin-card/plugin-card.html',
      controller: function PluginCardCtrl() {},
      controllerAs: 'pluginCard',
      transclude: true,
      bindings: {
        cardTitle: '@'
      },
    });
})();