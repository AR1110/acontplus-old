(function () {

    let pathFile = "/Home/Index?name=~/Pages/Compras/DocumentoRecibido/Shared/";

    app.component('docImportacion', {
        templateUrl: `${pathFile}_DocImportacion.cshtml`,
        bindings: {
            resolve: '<',
            close: '&',
            data: '<'
        },

        controller: ['$scope', docImportacionFn],

    })



    function docImportacionFn($scope){
        const $ctrl = this;
    
        $scope.mainform = {};
        $scope.mainform.option = false;
        $scope.files = [];
        $scope.compToImport = [];
        $scope.subcategories = subcategories;

        $scope.$watch("files", function () {
            $scope.uploadXml($scope.files);
        });
        $scope.$watch("file", function () {
            if ($scope.file != null) {
                $scope.files = [$scope.file];
            }
        });

        $scope.claveAccesoIsValid = false;


        $ctrl.$onInit = function(){
            console.log($ctrl)

            console.log('init')
        }


       
        $scope.checkExistenceXml = async (item) => {
            if (!item) {
                tS.toastr("warning", "Clave de acceso incorrecta");
                return;
            }
            if (item.length != 49) {
                tS.toastr("warning", "La Clave de acceso debe poseer 49 digitos");
                return;
            }
            $scope.claveAccesoIsValid = false;

            await docRecibidoSvc
                .checkExistenceXml(item)
                .then((response) => {
                    if (response.estado != "AUTORIZADO") {
                        if (response.message) {
                            tS.toastr("warning", response.message);
                        } else {
                            tS.toastr("warning", "Clave de acceso no existe en el SRI");
                        }
                    } else {
                        $scope.claveAccesoIsValid = true;

                        tS.toastr("info", "Validacion exitosa");
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            return $scope.claveAccesoIsValid;
        };

        $scope.addClaveAcceso = async () => {
            if (!$scope.mainform.claveAcceso) {
                tS.toastr("warning", "La clave de acceso no es correcta");
                return;
            }
            if ($scope.mainform.claveAcceso.length != 49) {
                tS.toastr("warning", "La clave de acceso debe poseer 49 digitos");
                return;
            }
            if ( $scope.compToImport.some( (x) => x.claveAcceso == $scope.mainform.claveAcceso) ) {
                tS.toastr("warning", "La clave de acceso ya existe");
                return;
            }
            if (!(await $scope.checkExistenceXml($scope.mainform.claveAcceso))) {
                return;
            }
            $scope.compToImport.push({ claveAcceso: $scope.mainform.claveAcceso });
            $scope.mainform.claveAcceso = "";
            $scope.$apply();
        };
        $scope.removeClaveAcceso = (item) => {
            $scope.compToImport.splice(item, 1);
        };
        $scope.removeFile = (item) => {
            $scope.files.splice(item, 1);
        }

        
        $scope.uploadXml = function (files) {
            if (
                !$scope.mainform.subcategoryId ||
                $scope.mainform.subcategoryId == 0
            ) {
                return tS.toastr(
                    "warning",
                    "Debe seleccionar una subcategoría de compras",
                );
            }
            let uploadPromises = [];
            angular.forEach(files, function (file) {
                let uploadPromise = docRecibidoSvc
                    .uploadXml(
                        {
                            codEstab: $scope.dataEstab.codEstab,
                            subcategoryId: $scope.mainform.subcategoryId,
                        },
                        file,
                    )
                    .then(
                        function (response) {
                            if (response) {
                                if (response.code == "0") {
                                    tS.toastr("warning", response.message);
                                }
                                if (response.code == "1") {
                                    tS.toastr("success", response.message);
                                }
                            }
                        },
                        function (error) {
                            tS.toastr("error", "Error al cargar el archivo: " + error);
                        },
                    );
                uploadPromises.push(uploadPromise);
            });

            $q.all(uploadPromises)
                .then(function (response) {
                    //console.log(response)
                    // Todas las peticiones se han completado con éxito
                    //tS.toastr("info", "Todas las peticiones se han completado")
                    //console.log('Todas las peticiones se han completado');
                })
                .catch(function () {
                    // Al menos una de las peticiones ha fallado
                    tS.toastr("danger", "Al menos una de las peticiones ha fallado");
                    //console.log('Al menos una de las peticiones ha fallado:', error);
                });
        };

        //Guardar Documentos importados
        $scope.post = function () {
            if (
                !$scope.mainform.subcategoryId ||
                $scope.mainform.subcategoryId == 0
            ) {
                return tS.toastr(
                    "warning",
                    "Debe seleccionar una subcategoría de compras",
                );
            }
            let data = {
                codEstab: $scope.dataEstab.codEstab,
                subcategoryId: $scope.mainform.subcategoryId,
                comprobantes: $scope.compToImport,
            };

            docRecibidoSvc
                .post(data)
                .then((response) => {
                    if (response.code == 0) {
                        tS.toastr("warning", response.message);
                    }
                    if (response.code == 1) {
                        tS.toastr("success", response.message);
                        $uibModalInstance.close(response);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        };




        $scope.close = function(){

            $ctrl.close()

        }

        
    }


})()