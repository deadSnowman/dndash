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

  /**
   * This is associated with the viewHome component
   * and manages plugins (DM tools) that are shown on the home page.
   */
  function HomeController(homeService, $scope, $uibModal) {
    var home = this;
    const base = 'components/plugin-cards/';
    
    /*******************
     * Properties
     *******************/

    /**
     * @ngdoc property
     * @name home.plugins
     * 
     * @description
     * Contains an object array containing plugin names, associated template,
     * and a boolean "enabled" indicating or not the plugin is showin in the home page 
     * 
     * ie.)
     * [{
     *   name: "String",
     *   uri: "String template"
     *   enabled: true
     * }] 
     */
    home.plugins = [
      { name: "Currency Converter",
        uri: base + 'currency-converter/currency-converter.html',
        enabled: true
      },
      { name: "Loot Splitter",
        uri: base + 'loot-splitter/loot-splitter.html',
        enabled: false
      },
      {
        name: "Die Roller",
        uri: base + 'dice-roller/dice-roller.html',
        enabled: false
      },
      {
        name: "Stat Roller",
        uri: base + 'stat-roller/stat-roller.html',
        enabled: true
      }
    ];

    /*******************
     * Handlers / API
     *******************/

    /**
     * @ngdoc method
     * @name home.open
     * 
     * @description
     * Opens a settings modal with the home.plugins content 
     */
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
