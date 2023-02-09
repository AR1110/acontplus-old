app.controller('impresoraCtrl', impresoraCtrl)

impresoraCtrl.$inject = ['$scope', 'commonService', 'mainService', 'toastService']

function impresoraCtrl($scope, _commonSvc, mS, tS) {
    $scope.printersTo = [];
    $scope.printers = [];
    $scope.data = {};

    $scope.initialLoad = () => {
        mS.getData('get','/Impresora/Get?json=' + JSON.stringify({ tipo: 1 })).then(response => {
            $scope.printers = JSON.parse(response[1]) || [];
            console.log($scope.printers)
            $scope.printers = $scope.printers.map(item=>{
                item.copyPrint = item.copyPrint==2?true:false;
                return item;
            })                    
        })

        _commonSvc.getEstabAsign().then(response=>{
            $scope.sucursales = response;
            if ($scope.sucursales.length > 0) {
                $scope.data.codEstab = $scope.sucursales[0].codEstab;
            } else {
                tS.toastr('info', 'No tienes asignado las Sucursales')
            }
        })

        mS.getData("get","/TipoImpresora/Get?json=" + JSON.stringify({})).then(response => {
            $scope.tipoImpresoras = JSON.parse(response.data);
        })
    }

    $scope.openModalNew = () => {
        $scope.tipoRegistro = 1;
        $('#addUpdatePrinter').modal('show')
    }
      
    $scope.openEdit = (item) => {
        $scope.data = item;        
        $('#addUpdatePrinter').modal('show')
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

            let url = $scope.tipoRegistro === 1 ? '/Impresora/Post?json=' : '/Impresora/Put?json=';
            let method = $scope.tipoRegistro === 1 ? 'post' : 'put';
            showLoader();
            mS.getData(method, url + JSON.stringify($scope.data)).then(response => {
                if (response.code == "0") {
                    hideLoader()
                    tS.toastr('warning', response.message)
                }
                if (response.code == "1") {
                    $scope.initialLoad()
                    hideLoader()
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
            mS.getData('delete', '/Impresora/Delete?id=' + item.idImpresora).then(response => {
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
       $scope.data = {};
    });
}


