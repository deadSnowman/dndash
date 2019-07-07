angular.module('homeSettings', ['ui.bootstrap']);

angular
  .module('homeSettings')
  .controller('SettingsModalController', function ($scope, $uibModalInstance, plugins) {
    $scope.plugins = plugins;

    $scope.ok = function () {
      $uibModalInstance.close("potato: " + $scope.plugins);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

});