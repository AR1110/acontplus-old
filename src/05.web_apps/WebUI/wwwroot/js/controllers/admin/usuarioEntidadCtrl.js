(()=>{

    angular.module('acontPlusApp')
           .controller('usuarioEntidadCtrl', usuarioEntidadCtrl);

    usuarioEntidadCtrl.$inject=['$scope', '$http', '$filter','mainService', 'toastService', 'formulario', 'apiUrl', 'decodeToken'];

    function usuarioEntidadCtrl($scope, $http,  $filter, mS, toast, form, apiUrl, decodeToken){
        let itemUsuario = JSON.parse(localStorage.getItem("itemUsuario")); 
        if(itemUsuario!==null){
            $scope.usuario = itemUsuario;                 
        }else{
            location.href= "/Usuario/Index"; 
            return           
        }

        let idUsuarioRol = parseInt(decodeToken.idUsuarioRol)

        $scope.getSucursalByEntidad = function(idEntidad, idUsuario){
            let url = '/Rol/GetSucursalByIdEntidad?idEntidad=' + idEntidad + '&idUsuario=' + idUsuario;
            return mS.getData('get', url).then(response => {
                if (response.id === "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                };
                return response.data.map(val=>{                    
                    let obj = {
                        idEntidad,
                        idRol: val.idRol,
                        sucurDefecto: val.defecto,
                        idSucursal: val.sucursal.idSucursal,
                        sucursal: val.sucursal.nombreComercial,
                        estado: val.sucursal.estado
                    };
                    return obj;                    
                })
            })
        }

        $scope.load = function(idUsuario){
            $http.get(`${apiUrl.cliente}apiCliente/Usa`)
            $http.get(`${apiUrl.cliente}apiCliente/UsuarioRol/GetId/${$scope.usuario.idUsuario}`)
            .then(({data:response})=>{
                hideLoader();
                $scope.usuarioRoles = JSON.parse(response.data) || [];
                console.log($scope.usuarioRoles)  
            }).catch(error=>{
                hideLoader();
                const msg = error.config?error.config.url: error
                toastr.error(msg)
            }) 

           // Obtenemos todas las entidades asignadas a un Usuario 
            mS.getData('get', '/Rol/GetEntidadByIdUsuario?idUsuario=' + idUsuario).then(response => {
                if (response.id == "0") {                    
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                };

                $scope.entidadesSucursales = [];
                for(let item of response.data){
                    let obj ={
                        idEntidad: item.entidad.idEntidad,
                        ruc: item.entidad.ruc,
                        entidad: item.entidad.razonSocial,  
                        estado: item.entidad.estado,
                        showSucursal: true,
                        idPolitica: item.idPolitica,
                        idUsuario: item.idUsuario                      
                    };

                    $scope.getSucursalByEntidad(obj.idEntidad, obj.idUsuario).then(response=>{                        
                        obj.sucursales = response;
                    });
                    $scope.entidadesSucursales.push(obj);
                }                                               
            })

            mS.getData('get', '/Politica/GetAll').then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.politicas = response.data;
                return
            }, error => console.log(error));
        }
        $scope.load();

      

        $scope.regresarModuloUsuario = function(){
            localStorage.removeItem("itemUsuario");
            location.href="/Usuario/Index";
            return
        }
        
        //Abrir Modal para Asignar Entidades a un Usuario 
        $scope.modalAsigEntidad = function(){
            $("#modalAsigEntidad").modal('show');
            return
        };

        $scope.showSucursal = function(item){
            item.showSucursal = !item.showSucursal
        };

        $scope.onChangeEntidad = function(item){
            if(!item.estado){
                item.idPolitica = 0;
                item.sucursales.forEach(val=>{
                    val.estado = false;
                    val.sucurDefecto = false;
                })
            };            
        };

        $scope.onChangeSucursal = function(item){
            item.sucurDefecto=!item.sucurDefecto
        }


        $scope.guardarAsigEntidad = function(){
            if($scope.entidadesSucursales.every(val=>val.estado===false)){
                form.sweetAlert('warning', `Seleccione al menos una Entidad`);
                return
            };
            
            for(let val of $scope.entidadesSucursales){   
                if(val.estado && val.idPolitica===0){
                    form.sweetAlert('warning', `Seleccione la Politica de la Entidad <b>${val.entidad}</b>`);
                    return
                }
                if(val.estado && val.sucursales.every(val=>val.estado===false)){
                    form.sweetAlert('warning', `Seleccione al menos una Sucursal de la Entidad <b>${val.entidad}</b>`);
                    return
                }
                
                if(val.estado && val.sucursales.every(val=>val.sucurDefecto===false)){
                    form.sweetAlert('warning', `Asigne al menos una Sucursal predeterminada de la Entidad <b>${val.entidad}</b>`);
                    return 
                }
            };            

            let roles = [];
            for(let item of $scope.entidadesSucursales){
                if(item.estado){
                    for(sucursal of item.sucursales){
                        sucursal.idPolitica = item.idPolitica;
                        sucursal.idUsuario = item.idUsuario;
                        roles.push(sucursal);
                    }
                }
            };
            
            
            
            form.showLoaderPost(1);
            mS.getData('post',  '/Rol/Post?idUsuario=' + $scope.usuario.idUsuario, roles).then(response => {
                if (response.id === "0") {
                    form.sweetAlert('warning', response.message, response.titleSms);
                    return                                        
                }
                if (response.id === "1") {
                    form.sweetAlert('success', response.message, response.titleSms, 1000);
                    $scope.load($scope.usuario.idUsuario);
                    $("#modalAsigEntidad").modal('hide');
                    return
                }
            });
        }


        $("#modalAsigEntidad").on('hide.bs.modal', e=>{
            $scope.txtFilter = "";
            $scope.load($scope.usuario.idUsuario);
            return
        });


        /*--------------------------------------ASIGNACION DE PUNTO DE EMISION Y BODEGA A LOS SUCURSALES -----------------
        ------------------------------------------------------------------------------------------------------------------*/
        $scope.openModalAsigPtoEmisionBodega = async function(item){ 
            $scope.nombreEntidad = item.entidad;       
            $scope.sucursalesAsignadas = await $scope.getSucursalByEntidad(item.rol.idEntidad, item.rol.idUsuario);
                        
            for(let val of $scope.sucursalesAsignadas){
                $scope.getPuntoEmisionBySucursal(val, val.idSucursal, val.idRol);                                 
                $scope.getBodegaBySucursal(val, val.idSucursal, val.idRol);                
            }            
            
            $("#modalAsigPtoEmisionBodega").modal('show');
            return
        };

        $scope.getPuntoEmisionBySucursal = function(item, idSucursal, idRol){
            mS.getData('get', `/AsigPtoEmision/GetByIdSucursal?idSucursal=${idSucursal}&idRol=${idRol}`).then(response => {                
                if(response.id==="0"){
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                } 
                item.puntosEmisiones= response.data.map(ptoE=>{
                    ptoE.asigPtoEmision.idRol = idRol;
                    return ptoE;
                })
            });
        };

        $scope.getBodegaBySucursal = function(item, idSucursal, idRol){
            mS.getData('get', `/AsigBodega/GetByIdSucursal?idSucursal=${idSucursal}&idRol=${idRol}`).then(response => {
                if(response.id==="0"){
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                } 
                
                item.bodegas = response.data.map(b=>{
                    b.asigBodega.idRol = idRol;
                    return b;
                })
            });
        };  
        
        $scope.onChangePtoEmision = function(sucursales, item){            
            angular.forEach(sucursales.puntosEmisiones, val=>{
                val.asigPtoEmision.defecto = false;
            })
            item.asigPtoEmision.defecto = item.asigPtoEmision.estado? true:false
        }

        $scope.onChangePtoEmisionPredeterminada = function(sucursales, item){
            angular.forEach(sucursales.puntosEmisiones, val=>{
                val.asigPtoEmision.defecto = false;
            })
            item.asigPtoEmision.defecto = true
        }



        $scope.onChangeBodega = function(sucursales, item){
            angular.forEach(sucursales.bodegas, val=>{
                val.asigBodega.defecto = false;
            })
            item.asigBodega.defecto = item.asigBodega.estado? true:false
            
        };

        $scope.onChangeBodegaPredeterminada = function(sucursales, bodega){
            angular.forEach(sucursales.bodegas, val=>{                
                val.asigBodega.defecto = false;                              
            });
            bodega.asigBodega.defecto = true;            
       
        }


        $scope.guardarAsigPtoEmisionBodega = function(){                    
            let puntosEmisiones = $scope.sucursalesAsignadas.map(val=>val.puntosEmisiones).reduce((acc, curVal) => acc.concat(curVal), []).map(({asigPtoEmision})=>asigPtoEmision);
            let bodegas = $scope.sucursalesAsignadas.map(val=>val.bodegas).reduce((acc, curVal) => acc.concat(curVal), []).map(({asigBodega})=>asigBodega);                      

            if (puntosEmisiones.length>0 && puntosEmisiones.every(ptoE => ptoE.defecto === false)) {
                form.sweetAlert('warning', `Seleccione al menos un Punto de Emisión predeterminada de Sucursal`)
                return
            };
            
            if (bodegas.length>0 && bodegas.every(b => b.defecto === false) ) {
                form.sweetAlert('warning', `Seleccione al menos una Bodega predeterminada`)                   
                return
            };

            let data ={
                ptoEmision: puntosEmisiones,
                bodegas
            };
           
            form.showLoaderPost(1);
            mS.getData('post', '/Asignacion/Post', data).then(response => {
                if (response.id == "0") {
                    form.sweetAlert('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    form.sweetAlert('success', response.message, response.titleSms, 1000);
                    $("#modalAsigPtoEmisionBodega").modal('hide');
                    return
                }

            });
        };

        $("#modalAsigPtoEmisionBodega").on('hide.bs.modal', e=>{
            $scope.nombreEntidad = '';
        })


























    }


















})(window.angular)