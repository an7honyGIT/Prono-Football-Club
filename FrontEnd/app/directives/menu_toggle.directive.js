
angular.module('pfcApp')
.run(['$templateCache', function ($templateCache) {
    $templateCache.put('partials/menu-toggle.tmpl.html',
      '<md-button class="md-button-toggle"\n' +
      '  ng-click="toggle()"\n' +
      '  aria-controls="docs-menu-{{section.name | nospace}}"\n' +
      '  flex layout="row"\n' +
      '  aria-expanded="{{isOpen()}}">\n' +
      '  {{section.name}}\n' +
      //'  <span flex></span>\n' +
      '  <span aria-hidden="true" class="md-toggle-icon material-icons"\n' +
      '  ng-class="{\'toggled\' : isOpen()}">expand_more</span>\n' +
      //'  <span class="md-toggle-icon" ng-class="{\'toggled\' : isOpen()}"><i class="material-icons">expand_more</i></span>\n' +
      //'  <i class="material-icons" ng-if="!isOpen()" ng-class="{\'toggled\' : isOpen()}">expand_more</i>\n' +
      '</md-button>\n' +
      '<ul ng-show="isOpen()" id="docs-menu-{{section.name | nospace}}" class="menu-toggle-list">\n' +
      '  <li ng-repeat="page in section.pages">\n' +
      '    <menu-link section="page"></menu-link>\n' +
      '  </li>\n' +
      '</ul>\n' +
      '');


  }])
  .directive('menuToggle',['$timeout', function ($timeout) {
    return {
      scope: {
        section: '='
      },
      templateUrl: 'partials/menu-toggle.tmpl.html',
      link: function (scope, element) {
        var controller = element.parent().controller();

        scope.isOpen = function () {
          return controller.isOpen(scope.section);
        };
        scope.toggle = function () {
          controller.selectedSection = scope.section;
          controller.toggleOpen(scope.section);
        };

        var parentNode = element[0].parentNode.parentNode.parentNode;
        if (parentNode.classList.contains('parent-list-item')) {
          var heading = parentNode.querySelector('h2');
          element[0].firstChild.setAttribute('aria-describedby', heading.id);
        }
      }
    };
  }]);
