(function(){
  'use strict';
  angular
    .module('com.module.interaction')
    .service('InteractionService', function (CoreService, Interaction) {
      this.getInteractions = function () {
        return Interaction.find({
          filter: {
            include: { relation: 'shop' }
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
        return {
          users: Interaction.serviceUsers()
        }
      }
      // this.deleteInteraction = function (id) {
      //   CoreService.confirm('确定删除？', '删除后无法恢复', function () {
			// 		Interaction.deleteById(id).$promise.then(function () {
			// 			CoreService.alertSuccess('删除成功！', '', successCb);
			// 		}, function (err) {
			// 			CoreService.alertError('删除失败！', err, cancelCb);
			// 		});
			// 	})
      // }
    })
})();
