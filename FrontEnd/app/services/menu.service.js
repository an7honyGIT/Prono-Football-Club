
  angular.module('pfcApp')
    .factory('menu', ['$location',
      function ($location){

        var sections = [{
          name: 'Accueil',
          chapter: '',
          link: '#!/',
          type: 'link'
        }];

        sections.push({
          name: 'Matchs',
          chapter: '',
          link: '#!/matches',
          type: 'link'
        });

        sections.push({
          name: 'Équipes',
          chapter: '',
          link: '#!/teams',
          type: 'link'
        });

        sections.push({
          name: 'Classements',
          chapter: '',
          link: '#!/groups',
          type: 'link'
        });

        sections.push({
          name: 'Informations',
          chapter: '',
          link: '#!/rules',
          type: 'link'
        });


        sections.push({
          name: 'Déconnexion',
          chapter: '',
          link: '#!/login',
          type: 'link'
        });


        /*sections.push({
          name: 'Classement',
          type: 'toggle',
          pages: [{
            name: 'Général',
            chapter: 'Classement',
            type: 'link',
            link: '#!/ranking'
          }, {
            name: 'Mes groupes',
            chapter: 'Classement',
            type: 'link',
            link: '#!/ranking/groups/'
          }]
        });*/

        var self;

        return self = {
          sections: sections,

          toggleSelectSection: function (section) {
            self.openedSection = (self.openedSection === section ? null : section);
          },
          isSectionSelected: function (section) {
            return self.openedSection === section;
          },

          selectPage: function (section, page) {
            page && page.url && $location.path(page.url);
            self.currentSection = section;
            self.currentPage = page;
          }
        };
      }])

