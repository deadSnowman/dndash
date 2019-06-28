/* 'ngAnimate', 'ngSanitize',  */
angular.module('homeSettings', ['ui.bootstrap']);

angular
  .module('homeSettings')
  .controller('SettingsModalController', function ($scope, $modalInstance) {
  
    $scope.data = "test"

    $scope.ok = function () {
      // $modalInstance.close($scope.selected.item);
      $modalInstance.close("potato: " + $scope.data);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

});