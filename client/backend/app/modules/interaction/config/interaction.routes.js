(function(){
  'use strict';
  angular
    .module('com.module.interaction')
    .config(function ($stateProvider) {
      $stateProvider
        .state('app.interaction', {
          abstract: true,
          url: '/interaction',
          templateUrl: 'modules/interaction/views/main.html'
        })
        .state('app.interaction.list', {
          url: '/list',
          templateUrl: 'modules/interaction/views/list.html',
          controllerAs: 'ctrl',
          controller: function (InteractionService, interactions, $state) {
            this.interactions = interactions;

            this.closeInteraction = function (instance) {
              InteractionService.closeInteraction(instance, function () {
                $state.go($state.current, {}, {reload: true});
              })
            }
          },
          resolve: {
            interactions: function (InteractionService) {
              return InteractionService.getInteractions();
            }
          }
        })
        .state('app.interaction.detail', {
          url: '/detail/:id',
          templateUrl: 'modules/interaction/views/detail.html',
          controllerAs: 'ctrl',
          controller: function (interaction) {
            this.interaction = interaction;
          },
          resolve: {
            interaction: function ($stateParams, InteractionService) {
              return InteractionService.getInteractionDetail($stateParams.id);
            }
          }
        })
    })
})();
