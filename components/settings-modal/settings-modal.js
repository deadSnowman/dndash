angular.module('homeSettings', ['ui.bootstrap']);

angular
  .module('homeSettings')

  /**
   * The settings modal is used to pick which plugins are shown in the home page.
   */
  .controller('SettingsModalController', SettingsModalController);

  SettingsModalController.$inject = ['$scope', '$uibModalInstance', 'plugins'];
  function SettingsModalController($scope, $uibModalInstance, plugins) {

    $scope.plugins = plugins;

    /**
     * @ngdoc method
     * @name $scope.ok
     * 
     * @description
     * Close the modal with the "OK" button, and send back the plugin data
     */
    $scope.ok = function () {
      $uibModalInstance.close($scope.plugins);
    };

    /**
     * @ndoc method
     * @name @scope.cancel
     * 
     * @description
     * Dismiss / Cancel the modal
     */
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

