
app.controller('compraNoHabitualCtrl', compraNoHabitualCtrl);


compraNoHabitualCtrl.$inject = ['$scope', 'commonService', 'mainService', 'toastService', 'modalService', 'nombreModal']


function compraNoHabitualCtrl($scope, commonSvc, mS, tS, modalSvc, nombreModal){
    
    //Variables Generales
    const {MODAL_FILE_PATH} = nombreModal.compra_no_habitual; 
    const {MODAL_NUEVO, MODAL_EDITAR, MODAL_DETALLED} =nombreModal.compra_no_habitual;
    //Filtro 
    $scope.dataSearch = {};
    /**
     * 
     * @param {object} {controller, template, params}
     */
    $scope.openModal = ({controller, template, params, isRenderRazorPartial})=>{
        let modalRef = modalSvc.openModalCustom({controller, template, params, size:'xl', windowClass:'uibModalFullScreen', isRenderRazorPartial})

        modalRef.result.then(result=>{
            if(typeof result === 'object'){
                $scope.getComprasNoHabitual();
            }
        })
    }


    //Formulario Nuevo
    $scope.openModalNew = async ()=>{
        console.log(MODAL_FILE_PATH)
        let modalParms = {
            controller: (await import('./../../' + MODAL_FILE_PATH))[MODAL_NUEVO['controller']],
            template:  MODAL_NUEVO['template'],
            params: {
                data: {}
            },
            isRenderRazorPartial: true
        }      
       
        $scope.openModal(modalParms)                
    }


    //Obtenemos Datos 
    $scope.getComprasNoHabitual = ()=>{
        try {
            showLoader();
            $scope.comprasNoHabitual = [];
            mS.getData('get', 'CompraNoHabitual/' + JSON.stringify({ typeList : 1 }), null, true).then(response=>{
                if(response.code==="0"){
                    console.log(response)
                    hideLoader();
                }

                if(response.code==="1"){
                    $scope.documentoIngreso = JSON.parse(response.payload)[0] || []; //
                    hideLoader();
                }
            })

        } catch (error) {
            $scope.documentoIngreso = [];
            console.log(error)
        }
    }


    $scope.initiload = ()=>{
        try {
            commonSvc.getEstabAsign().then(response=>{  
                $scope.establecimientos = response;
                let codEstab = $scope.establecimientos.length>0 ? $scope.establecimientos[0].codEstab: 0;            
                $scope.dataSearch.codEstab = codEstab;
                $scope.getComprasNoHabitual();
            })
        } catch (error) {
            console.log(error);
        }
    }
    $scope.initiload();

   

}