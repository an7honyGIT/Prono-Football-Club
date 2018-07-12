
 angular.module('pfcApp')
    .run(['$templateCache', function ($templateCache) {
      $templateCache.put('partials/menu-link.tmpl.html',
        '<md-button href="{{section.link}}" ng-click="focusSection(section)">\n' +
        '  {{section | humanizeDoc}}\n' +
        '  <span  class="md-visually-hidden "\n' +
        '    ng-if="isSelected()">\n' +
        '    current page\n' +
        '  </span>\n' +
        '</md-button>\n' +
        '');
    }])
    .directive('menuLink', function () {
      return {
        scope: {
          section: '='
        },
        templateUrl: 'partials/menu-link.tmpl.html',
        link: function ($scope, $element) {
          var controller = $element.parent().controller();

          $scope.focusSection = function (page) {
            // set flag to be used later when
            // $locationChangeSuccess calls openPage()
            //controller.toolBarName = (page.chapter !== '')? page.chapter + ' - ' + page.name : page.name;
            controller.autoFocusContent = true;
            if(controller.isOpen(controller.selectedSection) && page.chapter === ''){controller.toggleOpen(controller.selectedSection);}
            controller.toggleSideNav();
          };
        }
      };
    });
