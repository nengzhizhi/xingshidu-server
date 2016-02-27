(function(){
  'use strict';
  angular
    .module('com.module.interaction')
    .service('InteractionService', function (CoreService, Interaction) {
      this.getInteractions = function () {
        return Interaction.find({
          filter: {
            include: ['shop', 'creater']
          }
        }).$promise;
      }

      this.closeInteraction = function (instance, successCb, cancelCb) {
        instance.status = 'closed';
        Interaction.upsert(instance).$promise.then(function () {
          CoreService.alertSuccess('停止成功！', '', successCb);
        }, function (err) {
          CoreService.alertError('停止失败！', err, cancelCb);
        })
      }

      this.getInteractionDetail = function (id) {
        return Interaction.serviceUsers({id: id}).$promise;


        // Interaction.serviceUsers({id: id}, function (err, result) {
        //   console.log(err, result);
        // })

        // console.log(Interaction.serviceUsers({ id :id }));
        // return {
        //   users: Interaction.serviceUsers({ id :id }).$promise.result
        // }
      }
    })
})();
