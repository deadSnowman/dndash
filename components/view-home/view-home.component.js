(function () {
  'use strict';

  // Register 'viewHome' component, along with its associated controller and template
  angular.
    module('viewHome').
    component('viewHome', {
      templateUrl: 'components/view-home/view-home.template.html',
      controller: ['homeService', '$scope', '$uibModal', HomeController],
      controllerAs: 'home',
    });

  // Controller - data binds to view-home template
  function HomeController(homeService, $scope, $uibModal) {
    var home = this;
    const base = 'components/plugin-cards/';
    
    // Properties

    home.plugins = [
      { name: "Currency Converter",
        uri: base + 'currency-converter/currency-converter.html',
        enabled: true
      },
      { name: "Loot Splitter",
        uri: base + 'loot-splitter/loot-splitter.html',
        enabled: true
      },
      {
        name: "Die Roller",
        uri: base + 'dice-roller/dice-roller.html',
        enabled: true
      }
    ];

    // Handlers / API

    home.open = function() {
      $uibModal.open({
        animation: true,
        templateUrl: 'components/settings-modal/settings-modal.template.html',
        controller: 'SettingsModalController',
        controllerAs: 'settingsModal',
        resolve: {
          plugins: function() {
            let pluginsCopy = [];
            return angular.copy(home.plugins, pluginsCopy);
          }
        }
      }).result.then(function(result) {
        // TODO: local storage?
        home.plugins = result;
      }, () => angular.noop);
    };
  }
})();
