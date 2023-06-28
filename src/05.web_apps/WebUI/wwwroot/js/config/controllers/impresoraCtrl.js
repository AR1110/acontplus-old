 

app.controller('impresoraCtrl', impresoraCtrl)

impresoraCtrl.$inject = ['$scope', 'commonService', 'mainService', 'toastService']

function impresoraCtrl($scope, _commonSvc, mS, tS) {
    $scope.printersTo = [];
    $scope.printers = [];
    $scope.data = {};

    $scope.disabledInputIpMaquina = false;

    $scope.isDisabledAsigEquipo = true;
    $scope.data.asignar = true;

    let url = 'Impresora/'

    $scope.initialLoad = async () => {
        showLoader();
        await mS.getData('get', url +'Get?json=' + JSON.stringify({ tipo: 1 }), null, true).then(response => {
            $scope.printers = [];
            if(response.code=="0"){
                console.log(response.message);
            }
            if(response.code ==="1") {
                $scope.printers = JSON.parse(response.payload) || [];
                
                $scope.printers = $scope.printers.map(item=>{
                    item.copyPrint = item.copyPrint==2?true:false;
                    return item;
                })  
            }             
        })


        await mS.getData("get", url + "GetDataForm?json=" + JSON.stringify({}), null, true).then(response => {
            let dataForm = JSON.parse(response.payload);
            $scope.sucursales = dataForm[0];
            $scope.tipoImpresoras = dataForm[1];
            $scope.documents = dataForm[2];
            if ($scope.sucursales.length > 0) {
                $scope.data.codEstab = dataForm[0].codEstab;
            } else {
                tS.toastr('info', 'No tienes asignado las Sucursales')
            }
        })
        hideLoader();
    }

    $scope.initialLoad();

    $scope.openModalNew = () => {
        $scope.tipoRegistro = 1;
        $scope.data.predeterminada = true;
        $scope.data.asignar = true
        $('#addUpdatePrinter').modal('show')
    }

    // $scope.onChangeIsServer = ()=>{
     
    //     if($scope.data.isServer){
    //         $scope.data.ipMaquina = '127.0.0.1:9100';
    //         $scope.disabledInputIpMaquina = true;
    //     }else{
    //         $scope.disabledInputIpMaquina = false;
    //         $scope.data.ipMaquina = null;
    //     }
    // }
      
    $scope.openEdit = (id) => {
        showLoader();
        mS.getData("get", url + "GetId/" + id, null, true).then(response => {
            hideLoader();
            let data = JSON.parse(response.payload);
            
            $scope.data = data[0][0];
            $scope.documents = data[1];
            $scope.tipoRegistro = 2;

            $scope.isDisabledAsigEquipo = true;
            $scope.data.asignar = true

	        $('#addUpdatePrinter').modal('show')
        }).catch(error=>{
            console.log(error)
        })
    }

    $scope.clearNameEquipment = ()=>{
        $scope.data.nombreEquipo = null; 
        $scope.data.nroIdentificacion = null;
    }

    $scope.clearCopyPrint = (data)=>{
        if(!data.estado){
            data.copyPrint = false;
        }
    }

    $scope.saveEdit = () => {
        try {   
            
            if (!$scope.data.codEstab) {                
                tS.toastr('warning', 'Seleccione el Establecimiento')
                return
            }
           
            if (!$scope.data.nombreImpresora) {                
                tS.toastr('warning', 'Se necesita ingresar el nombre de la Impresora')
                return
            }

            if (!$scope.data.idTipoImpresora) {                
                tS.toastr('warning', 'Seleccione el Tipo Impresora')
                return
            }

            
            if ($scope.data.asignar){

                if (!$scope.data.nombreEquipo){
                    tS.toastr('warning', 'Escriba el nombre del equipo')
                    return
                }

                // if (!$scope.data.nroIdentificacion){
                //     tS.toastr('warning', 'Escriba el Nro de identificación')
                //     return
                // }

                // if ($scope.data.nroIdentificacion.length != 10){
                //     tS.toastr('warning', 'El Nro de cedula debe ser de 10 caractares')
                //     return
                // }
            }

            if($scope.data.isServer){
                $scope.data.ipMaquina='127.0.0.1:9100'
            }

            if(!$scope.data.ipMaquina){
                tS.toastr('warning', 'Ingrese el Ip de la máquina')
                return
            }

            if($scope.documents.every(item=>!item.estado)){ 
                tS.toastr('warning', 'Seleccione al menos un documento')
                return
            }

            // let urlRequest = $scope.tipoRegistro === 1 ? url +'Post' : url +  'Put';
            let method = $scope.tipoRegistro === 1 ? 'post' : 'put';
            let codDoc = "";
            
            if($scope.documents.some(item=>item.codDoc==="FV" && item.estado)){
                codDoc = "FV"    
            }
                
            if($scope.documents.some(item=>item.codDoc==="NE" && item.estado)){
                codDoc = "NE";
            }

            if($scope.documents.every(item=>item.estado)){
                codDoc = "A";
            }

            $scope.data.codDoc = codDoc;

            let data = {
                printer: $scope.data, 
                documents : $scope.documents.map(item=>({
                    idConfig_Document : item.idConfig_Document,
                    codDoc: item.codDoc,
                    estado: item.estado,
                    copyPrint : item.copyPrint
                })
            )};

            showLoader();
            mS.getData(method, url, {data} , true).then(response => {
                if (response.code == "0") {
                    hideLoader()
                    tS.toastr('warning', response.message)
                }
                if (response.code == "1") {
                    hideLoader();
                    $scope.initialLoad()
                    $scope.disabledInputIpMaquina = false;

                    $('#addUpdatePrinter').modal('hide')
                    tS.toastr('success', response.message)
                }
            }, error => {
                hideLoader()
                console.log(error)
            })
        } catch (error) {
            hideLoader()
            console.log(error)
        }
    }

    $scope.askToDelete = async (item) => {
        let { isConfirmed } = await Swal.fire({
            title: '¿Está seguro de eliminar esta impresora?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar',
            allowOutsideClick: false
        })

        if (isConfirmed) {
            $scope.delete(item);
        }

    }

    $scope.delete = (item) => {
        try {
            showLoader()
            mS.getData('delete',  url + 'Delete?id=' + item.id, null, true).then(response => {
                if (response.code == "0") {
                    hideLoader()
                    tS.toastr('warning', response.message)
                }
                if (response.code == "1") {
                    $scope.initialLoad()
                    hideLoader()
                    tS.toastr('success', response.message)
                }
            }, error => {
                hideLoader()
                console.log(error)
            })
        } catch (error) {
            hideLoader()
            console.log(error)
        }
    }

    $scope.print = () => {
        let format = 'Image';

        let reportParams = {
            codigo: 'RF',
            format: format
        };
        let dataParmas = {
            idFactura: 199
        };
        let parameters = {
            format: format,
            printerName: "Microsoft XPS Document Writer",
            reportParams: JSON.stringify(reportParams),
            dataParams: JSON.stringify(dataParmas),
            sendEmail: false
        };
        mS.getData("get", 'https://localhost:44307/api/Imprimir/Print', parameters).then(
            response => {
                console.log(response)
            }, error => {
                console.log(error)
            })
    }

    /**Validations */
    $scope.existsDefault = false
    $scope.validateDefault = (item) => {
        for (const printer of $scope.printersTo) {
            printer.predeterminada = false
        }
        item.predeterminada = !item.predeterminada;
    }

    $('#addUpdatePrinter').on('hidden.bs.modal', function () {
        $scope.disabledInputIpMaquina = false;
        $scope.isDisabledAsigEquipo = true;
        $scope.data.asignar = true;
       $scope.data = {};
    });
}


