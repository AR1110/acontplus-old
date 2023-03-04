(function() {
    'use strict';
    angular.module('acontPlusApp')
        .controller('reporteCtrl', reporteCtrl);

    reporteCtrl.$inject = ['$scope', 'mainService', 'toastService', 'FileSaver', 'Blob'];

    function reporteCtrl($scope, mS, tS, FileSaver, Blob) {
        let accion = JSON.parse(localStorage.getItem("accion"));
        if (accion === null) {
            location.href = "/Home/Index";
        } else {
            $scope.accion = accion[0];
        }

        let url = '/Reporte/';

        $scope.reports = [];

        $scope.initialLoad = function() {
            
            try {
                $scope.reports = [];
                mS.getData('get', url + 'Get?json=' + JSON.stringify({typeList: 1})).then(response=>{
                    console.log(response)
                    if(response.code==="0"){
                        $scope.reports = [];
                        console.log(response)
                    }
                    if(response.code=="1"){
                        console.log(JSON.parse(response.payload))
                        $scope.reports = JSON.parse(response.payload) || [];                        
                    }
                })
            } catch (error) {
                console.log(error)            
            }

        }
        $scope.initialLoad();


        $scope.expandDetalle = function(item) {
            try {
                item.expanded = !item.expanded;
                showLoader()
                mS.getData('get', url + 'Get?json=' + JSON.stringify({typeList: 2, id: item.idReporteParametro})).then(response => {
                    console.log(response);
                    if(response.code==="0"){
                        item.dataSources = []
                        hideLoader()
                        console.log(response)
                    }
                    if(response.code==="1"){                    
                        item.dataSources = JSON.parse(response.payload) || []
                        hideLoader();
                    }
                })
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }



        $scope.operation = 0;
        $scope.reporte = {};
        $scope.openModal = function(data = null, type) {

            if (type == 1 || type == 2) {
                $scope.operation = type;
                if (type == 1) {
                    $scope.modalIcon = 'ti-plus';
                    $scope.modalTitle = 'Nuevo Reporte'
                } else {
                    $scope.modalIcon = 'ti-pencil';
                    $scope.modalTitle = 'Editar Reporte'
                };
                $scope.reporte = data;
                $('#reporteModal').modal('show');
                return;
            };

        };

        $scope.save = function() {
            var method = '';
            var urlMethod = '';
            if ($scope.operation == 1) {
                method = 'Post';
                urlMethod = 'Post';
            } else {
                method = 'Put';
                urlMethod = 'Put?idReporte=' + $scope.reporte.idReporte;
            };

            mS.getData(method, url + urlMethod, $scope.reporte).then(function(response) {
                if (response.id == 0) {
                    tS.toastr('warning', response.message);
                    return;
                };
                if (response.id == 1) {
                    tS.toastr('success', response.message);
                    $scope.initialLoad();
                    $('#reporteModal').modal('hide');
                };
            }, function(error) {
                console.log(error);
            });
        };

        $scope.askToDelete = function(item) {
            Swal.fire({
                title: 'Eliminar',
                text: "¿Está seguro de eliminar los parametros del reporte: " + item.reportPath + "?",
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Sí!',
                showDenyButton: true,
                denyButtonText: 'No'
            }).then((result) => {
                if (result.value) {
                    $scope.delete(item);
                }
            })
        };


        $scope.delete = function(item) {
            mS.getData('Delete', url + 'Delete?idReporte=' + item.idReporte).then(function(response) {
                if (response.id == 0) {
                    tS.toastr('warning', response.message);
                    return;
                };
                if (response.id == 1) {
                    tS.toastr('success', response.message);
                    $scope.initialLoad();
                };
            }, function(error) {
                console.log(error);
            });
        };

        $scope.getBarcode = function(item) {
            JsBarcode("#barcode", item, {
                format: "CODE128",
                lineColor: "#000",
                width: 1,
                height: 75,
                displayValue: false
            });
            var barcodeData = $('#barcode').attr('src').replace(/^data:image\/[a-z]+;base64,/, "");
            //console.log(strImage);
            return barcodeData;
        };

        $scope.getReport = function(item) {
            var format = '', barcode = '';
            if (item == 1) {
                format = 'pdf'
            } else {
                format = 'excel'
            };
            barcode = $scope.getBarcode('0123345');

            var parameters = {
                reportParams: JSON.stringify({
                    codigo: 'TR', format: format,
                    aditionalParams: [
                        { position: 2, paramName: 'testParam', paramValue: 'Hola Emilio' },
                        { position: 3, paramName: 'thirdParameter', paramValue: 'Hola Ivan' },
                        { position: 4, paramName: 'mimeTypeBarcode', paramValue: 'image/png' },
                        { position: 5, paramName: 'barcode', paramValue: barcode }
                    ]
                }),
                dataParams: JSON.stringify({ testProp: 'param for get Data' })
            };
            mS.getFile('Post', '/Reporte/Download', parameters).then(function(response) {
                if (item == 1) {
                    var fileBlob = new Blob([response.data], {
                        type: response.data.type
                    });
                    var objectUrl = window.URL || window.webkitURL;
                    var urlFile = objectUrl.createObjectURL(fileBlob);
                    window.open(urlFile, '_blank');
                    return;
                } else {
                    let serverData = new Blob([response.data], { type: response.headers()['content-type'] });
                    let fileName = response.headers()['content-disposition'].split(';')[1].split('=')[1];
                    FileSaver.saveAs(serverData, fileName);
                    //var blob = new Blob([response.data], {
                    //    type: response.data.type
                    //}),
                    //    fileName = 'Usuario.xls';
                    //if (window.navigator.msSaveOrOpenBlob) {
                    //    window.navigator.msSaveOrOpenBlob(blob, fileName);
                    //} else {
                    //    var anchor = angular.element('<a/>');
                    //    anchor.css({
                    //        display: 'none'
                    //    });
                    //    angular.element(document.body).append(anchor);
                    //    anchor.attr({
                    //        href: (window.URL || window.webkitURL).createObjectURL(blob),
                    //        target: '_blank',
                    //        download: fileName
                    //    })[0].click();
                    //    anchor.remove();
                    //};
                    return;
                };
            }, function(error) {
                console.log(error);
                return;
            });
        };






        $scope.openModalDs = (item)=>{
            $scope.tempDataSource = item;
            $scope.operationDs = 1;
            $scope.dataSource = {}
            $("#dataSourceModal").modal('show');
        }

        $scope.openModalEditDs = (item, dataDs)=>{

            $scope.tempDataSource = item;            
            $scope.operationDs = 2;
            $scope.dataSource = Object.assign({}, dataDs)
            $("#dataSourceModal").modal('show');
        }


        $scope.saveDs = ()=>{
            if(!$scope.dataSource.dataSource){
                tS.toastr('warning', 'Ingrese el DataSource')
                return
            }

            if([null, undefined, ""].includes($scope.dataSource.position)){
                tS.toastr('warning', 'Ingrese el índice')
                return
            }

            if($scope.operationDs===1){
                $scope.dataSource.idReporteParametro = $scope.tempDataSource.idReporteParametro
            }
            
            $scope.dataSource.typeRegister =  $scope.operationDs;
            console.log($scope.dataSource)
            mS.getData('post',  url + 'SaveDs?json=' + JSON.stringify($scope.dataSource)).then(response=>{
                console.log(response)
                if(response.code=="0"){
                    tS.toastr('warning', response.message)
                }
                if(response.code=="1"){
                    $("#dataSourceModal").modal('hide');
                    $scope.dataSource = {}
                    mS.getData('get', url + 'Get?json=' + JSON.stringify({typeList: 2, id: $scope.tempDataSource.idReporteParametro})).then(response => {
                    
                        if(response.code==="0"){
                            $scope.tempDataSource.dataSources = []
                            hideLoader()
                            console.log(response)
                        }
                        if(response.code==="1"){                    
                            $scope.tempDataSource.dataSources = JSON.parse(response.payload) || []
                            hideLoader();
                        }
                    })
                    
                    tS.toastr('success', response.message)
                }
            })

        }


        $scope.askToDeleteDs = async(item, dataDs)=>{
            try {    
                Swal.fire({                    
                    text: "Esta seguro de eliminar?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminar!',
                    cancelButtonText:'No, cancelar!',
                }).then((result) => {
                    if (result.isConfirmed) {
                        mS.getData('delete',  url + 'DeleteDs?json=' + JSON.stringify(dataDs)).then(response=>{
                            console.log(response)
                            if(response.code=="0"){
                                tS.toastr('warning', response.message)
                            }
                            if(response.code=="1"){
                                let index = item.dataSources.indexOf(dataDs, 1);
                                item.dataSources.splice(index, 1);
                                tS.toastr('success', response.message)
                            }
                        })                       
                    }
                })                                                      
            } catch (error) {
                console.log(error)            
           }            
        }


    };
})(window.angular)