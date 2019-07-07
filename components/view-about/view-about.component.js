(function () {
  'use strict';

  // Register 'viewAbout' component, along with its associated controller and template
  angular.
    module('viewAbout').
    component('viewAbout', {
      templateUrl: 'components/view-about/view-about.template.html',
      controller: [AboutController],
      controllerAs: 'about',
    });

  // Controller - data binds to view-about template
  function AboutController() {
    this.test = "hello";
  }
})();