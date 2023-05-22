(function() {

    'use strict';

    angular.module('acontPlusApp')
        .controller('impuestoArticuloCtrl', impuestoArticuloCtrl);

    impuestoArticuloCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function impuestoArticuloCtrl($scope, mS, toast, form) {
        $scope.data = {};
        $scope.articulo = {};
        $scope.tipoImpuesto = {};
        $scope.impuesto = {}
        $scope.idSubContribuyente;
        $scope.impuestos=[];


        $scope.$on('sharedDataArticuloImpuesto', function(event, value) {
            $scope.tipo=1;
            $scope.articulo=value;        
            $scope.getImpuestoArticulo(value.idArticulo);
        });


        $scope.getImpuestoArticulo = function(idArticulo) {          
            mS.getData('get', '/ImpuestoArticulo/Get?idArticulo=' + idArticulo).then(response => {              
                $scope.articuloImpuestos = response.data;                            
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
               
            }, error => console.log(error))
        }

        $scope.load = function() {
            mS.getData('get', '/SubContribuyente/OptionSubContribuyente').then(function(response) {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.subContribuyentes = response.data;
            }, error => console.log(error));

            mS.getData('get', '/TipoImpuesto/OptionTipoImpuesto').then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.tipoImpuestos = response.data;
            }, error => console.log(error));
        }
        $scope.load();

        //Listamos cuando generemos la retencion  
        $scope.getTipoImpuestoByConfigContribuyente = function(idConfigContribuyente){
            mS.getData('get', '/TipoImpuesto/OptionTipoImpuesto?idConfiguracionContribuyente='+idConfigContribuyente).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }                
                $scope.tipoImpuestos = response.data;
            }, error => console.log(error));
        }

        //Listar Impuestos 
        // $scope.$watch('tipoImpuesto', function({ idTipoImpuestoRenta }) {
        //     if (!form.campo(idTipoImpuestoRenta)) {
        //         $scope.getImpuestoByTipoImpuesto(idTipoImpuestoRenta)
        //     }
        // });

        $scope.getImpuestoByTipoImpuesto = function(idTipoImpuestoRenta) {
            $scope.impuesto={};
            mS.getData('get', '/ImpuestoRenta/GetByIdTipoImpuesto?idTipoImpuestoRenta=' + idTipoImpuestoRenta).then(response => {                
                $scope.impuestos = response.data;  
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                             
            }, error => console.log(error));
        };


        $scope.saveUpdate = function(tipo) {
            let titulo =tipo==1?'Guardar':'Actualizar';
            if (form.campo($scope.articulo.idArticulo)) {
                toast.toastr('warning', 'Seleccione el Articulo', titulo);
                return;
            }

            if (form.campo($scope.idSubContribuyente)) {
                toast.toastr('warning', 'Seleccione el Sub Contribuyente', titulo);
                return;
            }
            if (form.campo($scope.tipoImpuesto.idTipoImpuestoRenta)) {
                toast.toastr('warning', 'Seleccione el Tipo Impuesto', titulo);
                return;
            }
            if (form.campo($scope.impuesto.idRetencionRenta)) {
                toast.toastr('warning', 'Seleccione el Impuesto', titulo);
                return;
            }

            $scope.data.idArticulo = $scope.articulo.idArticulo;
            $scope.data.idSubContribuyente = $scope.idSubContribuyente;
            $scope.data.idRetencionRenta = $scope.impuesto.idRetencionRenta;
            let url = tipo == 1 ? '/ImpuestoArticulo/Post' : '/ImpuestoArticulo/Update?idImpuestoArticulo=' + $scope.data.idImpuestoArticulo;
            mS.getData('post', url, $scope.data).then(response => {
                if (response.id === "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id === "1") {                    
                    $scope.getImpuestoArticulo($scope.articulo.idArticulo);
                    toast.toastr('success', response.message, response.titleSms);                    
                    $scope.idSubContribuyente;
                    $scope.tipoImpuesto = {};
                    $scope.impuesto = {};
                    $scope.tipo = 1;
                }
            });
        }

        $scope.updateImpuestoArticulo = function(data) {            
            $scope.tipo = 2;
            $scope.data = data.impuestoArticulo;
            $scope.idSubContribuyente = data.impuestoArticulo.idSubContribuyente;
            $scope.tipoImpuesto = data;
            $scope.getImpuestoByTipoImpuesto(data.idTipoImpuestoRenta);
            $scope.impuesto = data.impuestoArticulo;            
        }

        $scope.reset=function(){
            $scope.getImpuestoArticulo($scope.articulo.idArticulo);
            $scope.idSubContribuyente=''
            $scope.tipoImpuesto={};
            $scope.impuesto={};
            $scope.tipo=1;
            
        }

        $scope.eliminarImpuestoArticulo = function({ idImpuestoArticulo }) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este Impuesto Articulo ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then((result) => {
                if (result.value) {
                    mS.getData('post', '/ImpuestoArticulo/Delete?idImpuestoArticulo=' + idImpuestoArticulo).then(response => {
                        if (response.id === "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id === "1") {
                            $scope.getImpuestoArticulo($scope.articulo.idArticulo);
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.idSubContribuyente=''
                            $scope.tipoImpuesto = {};
                            $scope.impuesto = {};
                            $scope.tipo = 1;                           
                            return
                        }
                    }, error => console.log(error))
                }
            })
        };


        //-----------------------------------Modal para Agregar Impuesto Articulo masivamente 
        $scope.$on("modalAddImpuestoArticulo", function(e, value){            
            $scope.articulos=[];                  
            if(value.codigo==="RC") {
                $scope.getArticuloSinImpuestoPorFacturaCompra(value); //Si la Retencion es Compra 
                $scope.getTipoImpuestoByConfigContribuyente(value.idConfigContribuyente);
                return
            } else if(value.codigo==="RV"){
                $scope.getArticuloSinImpuestoPorFacturaVenta(value); //Si la Retencion es Venta 
                $scope.getTipoImpuestoByConfigContribuyente(value.idConfigContribuyente);
                return
            }
        });
        

        //Cuendo la retencion es Compra 
        $scope.getArticuloSinImpuestoPorFacturaCompra=function(data){    
            Promise.all([
                mS.getData('get', '/FacturaCompra/GetDetailByInvoice?idFactura=' +data.idFactura+'&idSubContribuyente='+ data.idSubContribuyente + '&idConfigContribuyente=' + data.idConfigContribuyente),
                mS.getData('get','/Proveedor/GetDetailByProveedor?idProveedor='+data.idProveedor)
            ]).then(results=>{
                let [{data:articulos}, {data: proveedor}] = results;                           

                for(let item of results){
                    if(item.id==="0"){
                        form.sweetAlert('warning', item.message, item.titleSms);
                        return
                    }
                }
                                
                $scope.proveedor = proveedor;   
                $scope.proveedor.correos = form.getInputTagAsSplit(proveedor.proveedor.correo) 
                $scope.tipoPersona ="PROV"  //             
                
                $scope.articulos= articulos.map(val=>{
                    val.detalle.idSubContribuyente=data.idSubContribuyente;
                    return val;                        
                });        
                $("#modalAddImpuestoArticulo").modal('show');
            }).catch(error=>{
                form.sweetAlert('error', error.config.url, error.status )                
            });                                       
        };


        //Cuando la Retencion es Venta 
        $scope.getArticuloSinImpuestoPorFacturaVenta=function(data){
            mS.getData('get', '/FacturaVenta/GetDetailByInvoiceCustomer?idFactura=' + data.idFactura+'&idSubContribuyente=' + data.idSubContribuyente + '&idConfigContribuyente=' + data.idConfigContribuyente).then(response=>{                
                if(response.id===null){
                    Swal.fire({
                        title:`<small>${response.titleSms}</small>`,
                        icon:'warning',
                        html:`<small>Ups! Algo salio mal <i class=" fas fa-frown"></i> </small>`
                    });
                    return
                }
                if(response.id==="0"){
                    Swal.fire({
                        title:`<small>${response.titleSms}</small>`,
                        icon:'warning',
                        html:`<small>${response.message}</small>`
                    })
                    return
                }
                if(response.id==="1") {
                    mS.getData('get','/Cliente/GetDetalleCliente?idCliente='+data.idCliente).then(response=>{
                        if(response.id=="0"){
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if(response.id=="1"){                    
                            $scope.data = response.data;                                                        
                            $scope.data.correos = form.getTagInputAsList($scope.data.cliente.correo);                            
                            $scope.data.tipoPersona="CL";
                            return
                        }
                    });

                    $scope.articulos= response.data.map(val=>{
                        val.detalle.idSubContribuyente=data.idSubContribuyente;                            
                        return val;                        
                       }) ;        

                    $("#modalAddImpuestoArticulo").modal('show');
                    return      
                };                                            
            })
        };

        $scope.getImpuestoByIdTipoImpuesto = function(data, idTipoImpuestoRenta) {
            data.impuestos=[];
            mS.getData('get', '/ImpuestoRenta/GetByIdTipoImpuesto?idTipoImpuestoRenta=' + idTipoImpuestoRenta).then(response => {                
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }                  
                data.impuestos=response.data;
            }, error => console.log(error));
        };

        $scope.guardarImpuestoArticulo=function(){
            if($scope.articulos.some(val=>[null, undefined, ""].includes(val.detalle.idTipoImpuestoRenta))){
                form.sweetAlert('warning', 'Seleccione el Tipo Impuesto' );
                return        
            }

            if($scope.articulos.some(val=>[null, undefined, ""].includes(val.detalle.idRetencionRenta))){
                form.sweetAlert('warning', 'Seleccione el Impuesto' );                
                return
            }
            
            const lista = $scope.articulos.map(function({detalle}){
                return detalle;
            })

            mS.getData('post', '/ImpuestoArticulo/ListaPost', lista).then(response=>{
                if(response.id==="0"){
                    form.sweetAlert('warning', response.message, response.titleSms);
                    return                  
                }
                if(response.id==="1"){
                    Swal.fire({
                        title:`<small>${response.titleSms}</small>`,
                        icon:'success',
                        html:`<small>${response.message}</small>`,
                        allowOutsideClick:false
                    }).then(result=>{
                        if(result.isConfirmed){
                            $("#modalAddImpuestoArticulo").modal('hide');                 
                            $scope.$emit("generateRetencion"); 
                            // $scope.askToGenerarRetencion();
                            return
                        }
                    });                    
                }
            });            
        };       

        $("#modalAddUpdateProduct, #agregarImpuestoArticulo, #modalImpuestoArticulo").on('hide.bs.modal', e => {
            $scope.data = {}
            $scope.articuloImpuestos = [];
            $scope.idSubContribuyente;
            $scope.tipoImpuesto = {};
            $scope.impuesto = {};
        });
        
    }



})(window.angular)