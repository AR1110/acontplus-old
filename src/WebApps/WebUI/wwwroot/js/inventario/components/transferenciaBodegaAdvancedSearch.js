(function () {

    'use strict';

    let mainPath = `/Home/Index?name=~/Pages/TransferenciaBodega/Shared/`;

    app.component('transferenciaBodegaAdvancedSearch', {
        templateUrl: `${mainPath}_ModalAdvancedSearch.cshtml`,
        bindings: {
            resolve: '<',
            close: '&',

        },
        controller: ['$scope','toastService','transferenciaBodegaService','formulario','$document', function ($scope, tS, transBodegaSvc, fS, $document) {
            const $ctrl = this; 

            $scope.articlesSelected = [];
            $scope.articlesFounded = [];
 
            $scope.subFamilias = [];

            $scope.dataSearch = {
                bodegaOrigenId: 0
            }

            $scope.dropdownOpen = false;
            $scope.selectAll = false;
            $scope.bodegaText = null;



            $document.on('click', function(event) {
               $scope.$apply(()=>{
                $scope.dropdownOpen = false;
               })
            });

            $ctrl.$onInit = function () {
                const { bodegasOrigen, bodegaOrigenId, subFamilias } = $ctrl.resolve.params;

                let dataBodega = bodegasOrigen.find(i=>i.idBodega===bodegaOrigenId)  ;
                if(dataBodega){
                    $scope.bodegaText = dataBodega.descripcion;
                }
                $scope.dataSearch.bodegaOrigenId = bodegaOrigenId;
                $scope.subFamilias = subFamilias; 

            }


           

            // Alternar la visibilidad del dropdown
            $scope.toggleDropdown = function ($event) {
                $event.stopPropagation(); // Evitar que se cierre al hacer clic en el select
                $scope.dropdownOpen = !$scope.dropdownOpen;
            };

            // Cerrar el dropdown si se hace clic fuera
            $scope.closeDropdown = function ($event) {
                var dropdown = document.getElementById('selectDropdown');
                if (dropdown && !dropdown.contains($event.target)) {
                    $scope.$apply(function () {
                        $scope.dropdownOpen = false;
                    });
                }
            };

            // Marcar/desmarcar todas las opciones
            $scope.toggleAll = function () {
                $scope.subFamilias.forEach(family => {
                    family.selected = $scope.selectAll;
                    family.subFamilias.forEach(sub => sub.selected = $scope.selectAll);
                });
            };

            // Marcar/desmarcar una familia
            $scope.toggleFamily = function (family) {
                family.subFamilias.forEach(sub => sub.selected = family.selected);
                $scope.updateSelection();
            };

            // Actualizar la selección de familias en función de los hijos
            $scope.updateSelection = function (family) {
                if(family){
                    family.selected = family.subFamilias.every(sub => sub.selected);
                }
                $scope.selectAll = $scope.subFamilias.every(fam => fam.selected);
            };

            // Obtener el texto de las subfamilias seleccionadas
            $scope.selectedToppingsText = function () {
                let selected = [];
                $scope.subFamilias.forEach(family => {
                    family.subFamilias.forEach(sub => {
                        if (sub.selected) selected.push(sub.nomSubFamilia);
                    });
                });
                return selected.join(', ');
            };

            // Obtener solo las subfamilias seleccionadas
            $scope.selectedSubfamilias = function () {
                return $scope.subFamilias.flatMap(family => family.subFamilias.filter(sub => sub.selected));
            }; 


            $scope.searchProducts = function(){
                if(!($scope.dataSearch.bodegaOrigenId>0)){
                    tS.toastr({
                        type: 'warning',
                        message: 'Seleccione Bodega Origen'
                    })
                    return
                }

                let selectedSubfamilias = $scope.selectedSubfamilias().map(sub => sub.idSubFamilia).join(","); 


                let params = {
                    bodegaId: $scope.dataSearch.bodegaOrigenId,
                    subFamilias: fS.isValidField(selectedSubfamilias)
                }
                transBodegaSvc.getProductsTransferenciaMasiva(params).then(response=>{ 
                    $scope.articlesFounded = response.articulos;
                })

            }


            $scope.setArticlesSelected = function(){
                if(!($scope.articlesSelected.length>0)){
                    tS.toastr({
                        type: 'warning',
                        message: 'Seleccione al menos un artículo'
                    })
                    return 
                }
                $ctrl.close({
                    $value: {
                        articlesSelected: $scope.articlesSelected
                    },
                })

            }


            $scope.close = function () {
                $ctrl.close()
            }


        }]
    })



})()


