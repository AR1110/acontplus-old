
let mainPath = `/Home/Index?name=~/Pages/ArticuloFraccionado/`;
app.component('articuloFraccionadoLista', {
    templateUrl: `${mainPath}_ArticuloFraccionadoLista.cshtml`,
    bindings: {
        resolve: '<',
        data: '<'
    },

    controller: ['$scope','$rootScope', '$injector', function ($scope,$rootScope, $injector) {

        const $ctrl = this;
        const articuloFraccionadoSvc = $injector.get('articuloFraccionadoService')
        const modalSvc = $injector.get('modalService')
        const nombreModalInventario = $injector.get('nombreModalInventario')
        const tS = $injector.get('toastService')

        let dataArticulo = {} 
        $scope.accion = $rootScope.accion;

        $scope.recordsQuantity = [10, 25, 50, 100];
        $scope.dataSearch = {
            pageSize: 50,
            pageIndex: 1,
            maxSize: 5,
            totalRecords: 0,
        };

        $scope.openModal = openModal;
        $scope.onChangeTextSearch = onChangeTextSearch;
        $scope.pageChanged = pageChanged;
        $scope.changePageSize = changePageSize;
        $scope.askToDelete =  askToDelete
        $scope.refresh = refresh;

        function refresh(){
            getAll()
        }

         async function openModal(item) {
            try {
                const { fileCtrl, controllers, templates } = nombreModalInventario.ARTICULO
                let ctrl = (await import(fileCtrl))[controllers['AF']]
                let template = templates['AF']
                const modalRef = modalSvc.openModalCustom({
                    controller: ctrl,
                    template,
                    size: 'xl',
                    params: item || {
                        hasDataArticle: true,
                        idArticulo: dataArticulo.idArticulo
                    },
                    isRenderRazorPartial: true
                })
                modalRef.result.then(res => {
                    if (typeof res === 'object') {
                        getAll()
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }

        function getAll() {
            try {
                $scope.articuloFraccionados = []; 
                const params = {
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    tipo: 1,
                    textSearch: ["", null, undefined].includes($scope.dataSearch.textSearch) ? null : $scope.dataSearch.textSearch,
                    idArticulo: dataArticulo.idArticulo
                }
                articuloFraccionadoSvc.get(params).then(response => {
                    $scope.articuloFraccionados = response;
                    $scope.dataSearch.totalRecords = $scope.articuloFraccionados.length > 0 ? $scope.articuloFraccionados[0].totalRecords : 0
                })
                    .catch(error => {
                        $scope.dataSearch.totalRecords = 0;
                        console.log(error)
                    }) 
            } catch (error) {
                console.log(error);
            }

        }

        $ctrl.$onInit = function(){
            dataArticulo = structuredClone($ctrl.data) 
            getAll()
        } 
          function onChangeTextSearch() {
            try {
               getAll();

            } catch (error) {
                console.log(error)
            }
        }

         function pageChanged () {
           getAll();
        };

         function changePageSize() {
            $scope.dataSearch.pageIndex = 1;
           getAll();
        };


      async function askToDelete(item) {

            try {
                let {
                    isConfirmed
                } = await Swal.fire({
                    icon: 'warning',
                    html: `<small>Esta seguro/a de eliminar este registro ahora</small>`,
                    confirmButtonText: 'Si, eliminar',
                    showCancelButton: true,
                    cancelButtonText: 'No, cancelar',
                    allowOutsideClick: false
                })

                if (isConfirmed) { 
                    articuloFraccionadoSvc.delete(item.idArticuloFraccionado).then(response => {
                        if (response.code == "0") {
                            tS.toastr('warning', response.message);
                        }
                        if (response.code == "1") {
                            tS.toastr('success', response.message);
                           getAll();
                        }
                    }) 
                }
            } catch (error) {
                console.log(error);
            }
        } 



    }]

})