import app from '@src/app'; 
import template from './articuloListaPrecioModalComp.html'; 
app.component('articuloListaPrecioModalComp', {
    template,
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
    controller: function () {
      var $ctrl = this;
      console.log('modal')
  
      $ctrl.$onInit = function () {
        $ctrl.items = $ctrl.resolve.items;
        $ctrl.selected = {
          item: $ctrl.items[0]
        };
      };
  
      $ctrl.ok = function () {
        $ctrl.close({$value: $ctrl.selected.item});
      };
  
      $ctrl.cancel = function () {
        $ctrl.dismiss({$value: 'cancel'});
      };
    }
  });