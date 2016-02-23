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

      this.deleteInteraction = function (id) {
        CoreService.confirm('确定删除？', '删除后无法恢复', function () {
					Interaction.deleteById(id).$promise.then(function () {
						CoreService.alertSuccess('删除成功！', '', successCb);
					}, function (err) {
						CoreService.alertError('删除失败！', err, cancelCb);
					});
				})
      }
    })
})();
