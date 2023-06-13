

export class ModalModuloImportacionCrtl{
    static $inject = ['$scope', 'mainService', '$uibModalInstance', 'formulario', 'params'];
    constructor($scope, _mSvc, $uibModalInstance, _form, _params){
        this.$scope = $scope;
        this._mSvc = _mSvc;
        this.$uibModalInstance = $uibModalInstance;        
        this._form             = _form;
        this._params = _params; 

       
        this.codImportacion;
        this.importacionModulos = []
        this.searchTerm = '';
        this.clearSearchTerm = function () {
          this.searchTerm = '';
        }
       
            
        this.selectedFile = [];
        this.data=[{
            "name":"jayanth",
            "data":"scd",
            "abc":"sdef"
        }]
        

    }

    $onInit(){
        this._mSvc.getData('get', '/Importacion/Get?json=' + JSON.stringify({})).then(
            response=>{
                this.importacionModulos = JSON.parse(response.payload) || [];                                       
            }
        )
    }

    getDataImportacion(){
        this.dataImportacion = this.importacionModulos.find(item=>item.codigo===this.codImportacion)        
    }

    onKeyupSearch($event){
        console.log($event)
        $event.stopPropagation();        
    }

  


    convertToExcel(){     
        
        try {
            if(this.selectedFile.length===0){
                toastr.warning('Seleccione el Archivo');
                return
            }
                
            XLSX.utils.json_to_sheet(this.data, 'out.xlsx');                           
            let fileReader = new FileReader();
            fileReader.readAsBinaryString(this.selectedFile);
           
            fileReader.onload = (event)=>{
                let data = event.target.result;             
                let workbook = XLSX.read(data,{type:"binary"});       
                                                 
                workbook.SheetNames.forEach(async sheetName => {
                    this.tempArrayFiles = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    this.columns = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })[0].map(item=>item.trim())
                                       
                    this.tempArrayFiles = await this.getMappedItems();                                        
                   
                   this.validateExcel();                                                                              
                })
                
            }            
        } catch (error) {
            hideLoader();
            console.error(error)            
        }        
    }

    getMappedItems(){         
        return this.tempArrayFiles.map(row=>{
            let obj = {}
            for(let [index, item] of Object.entries(row)){
                item = ["", null, undefined].includes(item)?  "": item
                                
                obj[index.trim()] = typeof item ==='string' ? item.trim() : item  
            }
            for(let col of this.columns){
                if(!obj.hasOwnProperty(col)){
                obj[col] = ""
                }
            }
            
            return obj
        })                              
    }

    

    validateExcel(){                            
        let mappedArrayFiles = this.tempArrayFiles.map(row=>{              
            for(let col of this.columns){                    
                if(typeof row[col] ==="string"){
                    row[col] = this.removeAccents(row[col]);
                }
                              
                //Generar codigo automatico 
                if((col==="codigo" || col==="codigoAuxiliar" || col==="codigoBarra") && ["", null, undefined].includes(row[col])){
                    row[col] = this.generateIdUnique(row['descripcion'])                        
                }                   
            }


                //Validar los valores de la columna 
            if(this.codImportacion==="AR"){                          
                if(["", null, undefined].includes(row.codBarras)){
                    row.codBarras = row.codigo
                }
                if(row.hasOwnProperty("precioCosto") && ["", null, undefined, NaN].includes(row.precioCosto)){
                    row.precioCosto = 0;
                }

                if(row.hasOwnProperty("stock") && ["", null, undefined, NaN].includes(row.stock)){
                    row.stock = 0;
                }                                                                            
            }

            if(["CL","PR"].includes(this.codImportacion)){ 
                                            
                if(row.hasOwnProperty("codIdentificacion")){                                                                     
                    let codigoSriIdentificacion = row.codIdentificacion.substring(0, 2);
                    row.codIdentificacion = codigoSriIdentificacion;                             
                }
                if(row.hasOwnProperty("nombreFiscal") && !row.nombreFiscal){
                    row.nombreFiscal = row.nombreComercial
                }
            }

                                                            
            return row;
        })
    
        let obj = {
            dataModulo: this.importacionModulos.find(item=>item.codigo===this.codImportacion),
            mappedArrayFiles,            
        }
        this.validateImport(obj);
        // this.$uibModalInstance.close({
        //     dataModulo: this.importacionModulos.find(item=>item.codigo===this.codImportacion),
        //     items: mappedArrayFiles,
        //     columns: this.columns
        // })                               
    }


    async  validateImport(obj){
        try {
            
            const data = {
                jsonParams: JSON.stringify(obj.mappedArrayFiles)
            }

            let timerInterval
            Swal.fire({
                title: '<small>Espere por favor...</small>',
                html: 'Validando datos',
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

            await this._mSvc.getData('post', '/Importacion/GetValidation?codImportacion=' + obj.dataModulo.codigo, data).then(response => {
                
                if(response.code==="0"){
                    Swal.fire({
                        icon:'warning',
                        html:`<small>${response.message}</small>`
                    })                
                }
                if(response.code==="1"){
                    Swal.close();
                    let payload = JSON.parse(response.payload);
                    let nameColumns = Object.keys(payload[0])                    
                                        
                    this.$uibModalInstance.close({
                        dataModulo: obj.dataModulo,
                        items: payload,
                        nameColumns,
                    })
                }
            })            
        } catch (error) {
            console.log(error)
        } finally{
            
        }        
    }

    removeAccents(text){              
        text = text || "";
        return text;
    }


    generateIdUnique(text){     
        text = text || "";   
        return text.charAt(0) + Math.random().toString(36).substring(2, 18).toUpperCase();
    } 

    

    closeModal(){
        this.$uibModalInstance.close();
    }
    
}



