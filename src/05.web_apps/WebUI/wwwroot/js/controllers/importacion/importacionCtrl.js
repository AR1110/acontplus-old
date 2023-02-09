


class AlmacenImportacionCtrl{
    static $inject = ['$q','$mdEditDialog','$scope','mainService', 'modalService', 'nombreModal', 'formulario']
    constructor($q, $mdEditDialog, $scope, _mS, _modalSvc, _nombreModalConst, _form){
        this.$q            = $q;
        this.$mdEditDialog = $mdEditDialog;
        this.$scope        = $scope;
        this._mS           = _mS;
        this._modalSvc     = _modalSvc;
        this._nombreModalConst = _nombreModalConst;
        this._form      = _form;
        
        this.dataModulo ={}

        this.selected   = [];
        this.nameColums = [];
        this.items = [];

        this.options = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: true,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

    }

    $onInit(){
        
    }

    async openModalImport(){
        try {
            const {MODAL_MODULO_IMPORTACION_CTRL, MODAL_MODULO_IMPORTACION_CSHTML} = this._nombreModalConst.common;
            const {ModalModuloImportacionCrtl} = await import('./../../modal/' + MODAL_MODULO_IMPORTACION_CTRL);
            const _modalRef = this._modalSvc.openModalCustom({
                controller: ModalModuloImportacionCrtl,
                template: 'Shared/' + MODAL_MODULO_IMPORTACION_CSHTML,
                size:'md',

            })
        
            _modalRef.result.then(response=>{
                if(typeof response==='object'){              
                    this.selected = [];           
                    
                    this.dataModulo = response.dataModulo;    
                    
                    this.nameColums = response.nameColumns;
                   
                    this.itemsImportacion = response.items;;                                           
                    this.items = this.itemsImportacion
                }
            })            
        } catch (error) {
            console.trace(error);
        }                
    }

    classColumnTable(item){
        if(item.estado=="REGISTRADO")
            return "item-import-register"
        else if(item.estado=="IMPORTAR")
            return "";
        else
            return "item-import-error";
    }

     /**
     * 
     * @param {string} col 
     * @returns true/false
     */
     hiddenColumn(col){
        return ["idArticulo", "idMedida", "idSubFamilia", "idTipoIva", "codigo"].includes(col);        
    }

    editColumn(event, item, column) {        
        event.stopPropagation(); 
        
        let editDialog = {
            modelValue: item[column],
            placeholder: `Añadir ${column}`,
            save:  (input)=> {                
                // if(this.items.some(item=>item[column] ===input.$modelValue)){
                //     input.$invalid = true;
                //     return this.$q.reject();
                // }
                item[column] = input.$modelValue;
            },
            targetEvent: event,
            title: `Añadir ${column}`,
            validators: {
                'md-maxlength': 100
            }
        }
        
        let promise;
        
        if(this.options.largeEditDialog) {
            promise = this.$mdEditDialog.large(editDialog);
        } else {
            promise = this.$mdEditDialog.small(editDialog);
        }
        
        promise.then(ctrl=> {
            let input = ctrl.getInput();
            input.$viewChangeListeners.push(()=> {
                input.$setValidity('test', input.$modelValue !== 'test');
            })
        })
    }


    validarCampo(){
        let isComplete = false;
        for(let item of this.items){          
            if(item.hasOwnProperty("codigo") && this._form.campo(item.codigo)){
                this.showSwalFire('codigo')
                return
            }

            //Cliente/Proveedor
            if(item.hasOwnProperty("codContribuyente") && this._form.campo(item.codContribuyente)){
                this.showSwalFire('codContribuyente')
                return
            }

            if(item.hasOwnProperty("codIdentificacion") && this._form.campo(item.codIdentificacion)){
                this.showSwalFire('codIdentificacion')
                return
            }

            if(item.hasOwnProperty("nombreComercial") && this._form.campo(item.nombreComercial)){
                this.showSwalFire('nombreComercial')
                return
            }

            if(item.hasOwnProperty("nombreFiscal") && this._form.campo(item.nombreFiscal)){
                this.showSwalFire('nombreFiscal')
                return
            }

            isComplete = true;
        }

        if(isComplete){
            this.saveImport();
        }
        
    }

    showSwalFire(campo){
        Swal.fire({
            icon:'warning',
            html:`Ingrese campo ${campo}`
        })
    }



    saveImport(){    
        if(this.selected.length===0){
            Swal.fire({
                icon:'warning',
                html:`<small>Seleccione los Items</small>`
            })
            return
        }

        Swal.fire({
            icon:'warning',
            html:`Está seguro de Guardar Importación de <b><h3>${this.selected.length}</h3></b> <b>${this.dataModulo.descripcion}</b> ahora?`,
            showDenyButton:true,
            confirmButtonText:'<i class="ti-save"></i> Sí, guardar',
            denyButtonText:'<i class="ti-close"></i> No, cancelar',
            allowOutsideClick:false,
            timerProgressBar:true
        }).then(result=>{
            if(result.isConfirmed){
                let data = {
                    jsonParams: JSON.stringify(this.selected)
                }
                
                let timerInterval
                Swal.fire({
                    title: 'Espere por favor...',
                    html: 'Guardando Importación',
                    timer: 15000,
                    timerProgressBar: true,
                    allowOutsideClick:false,
                    didOpen: () => {
                        Swal.showLoading()
                        timerInterval = setInterval(() => {
                            const content = Swal.getHtmlContainer()
                            if (content) {
                                const b = content.querySelector('b')
                                if (b) {
                                    b.textContent = Swal.getTimerLeft()
                                }
                            }
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                })
    
                this._mS.getData('post', '/Importacion/Post?codImportacion=' + this.dataModulo.codigo, data).then(
                    response=>{
                        if(response.code==="0"){                        
                            Swal.fire({
                                icon:'warning',
                                html:`<small>${response.message}</small>`
                            })
                        }
                        if(response.code==="1"){                            
                            Swal.fire({
                                icon:'success',
                                html:`<small>${response.message}</small>`,
                                timer:1000
                            })                       
                            this.dataModulo ={}
                            this.selected   = [];
                            this.nameColums = [];
                            this.items = [];
                        }
                    }
                )
            }
        })
    }

    
   
}

// let selectedFile;

// document.getElementById('input').addEventListener("change", (event) => {
//     selectedFile = event.target.files[0];
// })




// document.getElementById('button').addEventListener("click", () => {
//    
// });


app.controller("almacenImportacionCtrl", AlmacenImportacionCtrl).name