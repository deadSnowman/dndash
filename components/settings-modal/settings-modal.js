/* 'ngAnimate', 'ngSanitize',  */
angular.module('homeSettings', ['ui.bootstrap']);

angular
  .module('homeSettings')
  .controller('SettingsModalController', function ($scope, $uibModalInstance) {
  
    $scope.data = "test";

    $scope.ok = function () {
      $uibModalInstance.close("potato: " + $scope.data);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

});