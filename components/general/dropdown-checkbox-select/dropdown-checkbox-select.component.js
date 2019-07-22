(function () {
  'use strict';

  angular.
    module('DnDash').component('dropdownCheckboxSelect', {
      templateUrl: 'components/general/dropdown-checkbox-select/dropdown-checkbox-select.html',
      controller: DropdownCheckboxSelectCtrl,
      controllerAs: 'DCSelect',
      bindings: {
        options: '<',
        selected: '='
      }
    });

  function DropdownCheckboxSelectCtrl() {
    var DCSelect = this;

    DCSelect.selectOption = (e) => {
      DCSelect.selected = e;
    }
  }
})();