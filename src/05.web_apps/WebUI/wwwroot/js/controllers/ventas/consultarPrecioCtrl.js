
class ConsultarPrecioCtrl{
    static $inject = ['$scope', '$timeout', 'mainService', 'modalService', 'nombreModal', 'toastService'];
    constructor($scope, $timeout, _mS, _modalSvc, _nombreModal, _tS){
        // [{"busqueda":"m","cantidadRegistro":"10","numeroPagina":"1","stock":"2"}]
        this.$scope       = $scope;
        this.$timeout     = $timeout;
        this._mS          = _mS;
        this._modalSvc    = _modalSvc;
        this._nombreModal = _nombreModal;
        this._tS          = _tS;

        this.dataSearch = {};
        this.dataSearch.busqueda;
        this.dataSearch.numeroPagina = 0; 
        this.dataSearch.cantidadRegistro = 15;
        this.dataSearch.stock = 0;
        this.dataSearch.byColumn = "DESC";
      
        this.listaArticulos = []; 
        this.selectedArticulos = [];
        
        this.tipoBusquedas = [
            {codigo:'DESC', descripcion: "Descripción"},
            {codigo:'COD', descripcion: "Código"},
            {codigo:'AUX', descripcion: "Código Auxiliar"},
            {codigo:'BAR', descripcion: "Código Barra"}
        ]

        this.dynamicPopover = {
            content: 'Hello, World!',
            templateUrl: 'myPopoverTemplate.html',
            title: 'Title'
        }

        this.options = {
            rowSelection: false,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        }

        // Cargar Articulos por scroll 
        // $(window).on("scroll", () => {
        //     if (this.listaArticulos.length === 0 || this.validarCampoText(this.dataSearch.busqueda)) return;

        //     let scrollHeight = $(document).height();
        //     let scrollPosition = $(window).height() + $(window).scrollTop();            
                                
        //     if (Number(((scrollHeight - scrollPosition) / scrollHeight).toFixed(1)) === 0.2) {      

        //         this.dataSearch.numeroPagina = this.dataSearch.numeroPagina + 1;                               
        //         _mS.getData('get','/Articulo/List?json=' + JSON.stringify(this.dataSearch)).then(response=>{
        //             if(response.id==="0"){
        //                 toast.toastr('warning', response.message, response.titleSms);
        //                 return
        //             }
        //             if(response.id==="1"){   
        //                 let parseArticulos = JSON.parse(response.payload)                                                        
        //                 let listaArticulos = parseArticulos.map(item=>{
        //                     item.tarifa = JSON.parse(item.tarifa);
        //                     return item;
        //                 })  
        //                 this.tarifas = listaArticulos.length>0?listaArticulos[0].tarifa: [];   
                      
        //                 for(let item of listaArticulos){
        //                     this.listaArticulos.push(item);
        //                 }                                                                                                                      
        //             }
        //         });                
        //     }
            
        // })
    }

    $onOnit(){
        let accion = JSON.parse(localStorage.getItem("accion"));
        if(accion===null){
            location.href = "/Home/Index";
        }else{
            this.accion = accion[0];
        }
    }


    validarCampoText(text){
        return [null, undefined, ""].includes(text);
    }

    consultarPrecioSearchText(){
        this.listaArticulos = []; //Vaciar el array (Lista de Articulos);                                          
        if(this.validarCampoText(this.dataSearch.busqueda) && this.dataSearch.busqueda.length<2) return                        
        this.querySearchArticulo();                        
    }

    querySearchArticulo(){            
        this.dataSearch.numeroPagina = 1;            
        
        this.$timeout(()=>{
            console.log(this.dataSearch)
            this._mS.getData('get','/Articulo/List?json=' + JSON.stringify(this.dataSearch)).then(response=>{
                console.log("procesando.................")
                if(response.code==="0"){
                    this.listaArticulos = []; //Vaciar el array (Lista de Articulos);  
                    this._tS.toastr('warning', response.message, response.titleSms);
                    return
                } 

                let parseArticulos = JSON.parse(response.payload)                                                        
                this.listaArticulos = parseArticulos.map(item=>{
                    item.tarifa = JSON.parse(item.tarifa);
                    return item;
                })  
                this.tarifas = this.listaArticulos.length>0?this.listaArticulos[0].tarifa: [];                    
            })
        }, 500)            
    }


    consultarPrecioEnter($event){
        if(!this.validarCampoText(this.searchText) && $event.key==="Enter"){
            this.querySearchArticulo();
            this.dataSearch.busqueda = '';               
        }
    }  
    
    onChangeCheckBoxItem(item){
        console.log(true)
    }
      
    showBodegas(item){
        this._mS.getData('get', '/Articulo/GetId?id=' + item.idArticulo).then(response=>{
            const results = JSON.parse(response.payload) || [];
            this.branchs = results[4].map(val=>{
                val.warehouses = JSON.parse(val.warehouses)
                return val;
            })
        })            
    }


    //Presentacion del imagen 
    async getImagen(item){ 
        const {MODAL_CTRL, MODAL_IMAGEN_DETALLE_CSHTML} = this._nombreModal.articulo;
        const {ModalArticuloImagenDetalleCtrl} = await import('./../../modal/'+MODAL_CTRL);
        this._modalSvc.openModalCustom({
            controller: ModalArticuloImagenDetalleCtrl,
            template: `Articulo/${MODAL_IMAGEN_DETALLE_CSHTML}`,
            size: 'xl',
            params: item
        })            
    }

    async openModalKardex(item){
        const articulo = {
            idArticulo: item.idArticulo,
            codigo: item.codigo,
            descripcion: item.descripcion,
        }

        const {MODAL_CTRL, MODAL_CSHTML} = this._nombreModal.kardex;
        const {ModalKardexCtrl} = await import('./../../modal/'+ MODAL_CTRL);
        this._modalSvc.openModalCustom({
            controller: ModalKardexCtrl,
            template: `Kardex/${MODAL_CSHTML}`,
            size:'xl',
            params: articulo,
            windowClass: 'uibModalFullScreen'
        })        
    }     

}

app.controller('consultarPrecioCtrl', ConsultarPrecioCtrl)



