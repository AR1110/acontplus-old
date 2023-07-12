(function(){

    'use strict';
    //FILTERS GENERAL 
    app.filter('estadoPrimario', function ($sce) {
        return function (text) {
            return text ? $sce.trustAsHtml("<span class='label label-success font-weight-100'>Activo</span>") : $sce.trustAsHtml("<span class='label label-danger font-weight-100'>Inactivo</span>");
        }
    });

    app.filter('estadoSecundario', function ($sce) {
        return function (text) {
            return text ? $sce.trustAsHtml("<i class='fa fa-circle text-success'></i>") : $sce.trustAsHtml("<i class='fa fa-circle text-warning'></i>");
        }
    });

    app.filter('sino', function ($sce) {
        return function (text) {
            return text ? $sce.trustAsHtml("<span class='text-success'>SI</span>") : $sce.trustAsHtml("<span class='text-info'>NO</span>");
        }
    });
    app.filter('tipo', function ($sce) {
        return function (text) {
            return text ? $sce.trustAsHtml("<span class='text-success'>PROVEEDOR</span>") : $sce.trustAsHtml("<span class='text-info'>CLIENTE</span>");
        }
    });
    app.filter('ambienteSri', function ($sce) {
        return function (text) {
            return text ? $sce.trustAsHtml("<span class='text-success'>PRUEBAS</span>") : $sce.trustAsHtml("<span class='text-info'>PRODUCCIÓN</span>");
        }
    })
    app.filter('tipoEmisionSri', function ($sce) {
        return function (text) {
            return text ? $sce.trustAsHtml("<span class='text-success'>NORMAL</span>") : $sce.trustAsHtml("<span class='text-info'></span>");
        }
    })
    //Filter tipo Iva 
    app.filter('mapTipoIva', () => {
        return function (idTipoIva, tipoIvas) {
            let result = tipoIvas.reduce((acc, curr) => ({
                ...acc,
                [curr.idTipoIva]: curr.descripcion
            }), {
                0: 'Tipo Iva'
            });
            return !idTipoIva ? result[0] : result[idTipoIva];
        }
    });

    app.filter('cellFilterTipoIva', () => {
        let result = {};

        return (input, context) => {

            let fieldLevel = (context.editDropdownOptionsArray == undefined) ? context.col.colDef : context;
            let map = fieldLevel.editDropdownOptionsArray;
            let idField = fieldLevel.editDropdownIdLabel;
            let valueField = fieldLevel.editDropdownValueLabel;

            if (typeof map !== "undefined") {
                for (let value of map) {
                    result[value[idField]] = value.descripcion
                    //  result[idField] = value.descripcion
                }
            }

            if (!input) {
                return result[0];
            } else {
                return result[input];
            }
        }
    })

    app.filter('cellFilterBodega', () => {
        let result = {
            '0': 'Seleccione Bodega'
        };
        return (input, context) => {

            let fieldLevel = (context.editDropdownOptionsArray == undefined) ? context.col.colDef : context;
            let map = fieldLevel.editDropdownOptionsArray;
            let idField = fieldLevel.editDropdownIdLabel;
            let valueField = fieldLevel.editDropdownValueLabel;

            if (typeof map !== "undefined") {
                for (let value of map) {
                    result[value.idBodega] = value.descripcion
                }
            }

            if (!input) {
                return result[0];
            } else {
                return result[input];
            }
        }
    })


    // app.directive('autoocus')

    //Filter bodegas 
    app.filter('mapBodega', () => {
        return function (idBodega, bodegas) {
            if (!bodegas || bodegas.length === 0) return {
                0: 'Seleccionar bodega'
            }

            let result = bodegas.reduce((acc, curr) => ({
                ...acc,
                [curr.idBodega]: curr.descripcion
            }), {
                0: 'Seleccionar bodega'
            });
            console.log(result)
            console.log(idBodega, bodegas)
            return !idBodega ? result[0] : result[idBodega];
        };
    });

    app.filter('estadoPago', () => {
        return function (text) {
            let template;
            if (text == 'PE') template = "<span class='label label-danger font-weight-100'>Pendiente</span>";
            if (text == 'PP') template = "<span class='label label-info font-weight-100'>Pendiente-Parcial</span>";
            if (text == 'PA') template = "<span class='label label-success font-weight-100'>Pagada</span>";
            return $sce.trustAsHtml(template);
        }
    });

    app.filter('mapTipoImpuesto', () => {
        return (idTipoImpuesto, tipoImpuestos) => {
            let result = tipoImpuestos.reduce((acc, curr) => ({
                ...acc,
                [curr.idTipoImpuestoRenta]: curr.descripcion.toUpperCase()
            }), {
                0: 'Seleccione el Tipo Impuesto'
            })
            return !idTipoImpuesto ? result[0] : result[idTipoImpuesto];
        }
    });
    app.filter('mapRetencionIva', () => {
        return (idRetencionIva, retencionesIvas) => {
            let result = retencionesIvas.reduce((acc, curr) => ({
                ...acc,
                [curr.idRetencionIva]: curr.descripcion.toUpperCase()
            }), {
                0: 'Seleccione Retención de IVA'
            })
            return !idRetencionIva ? result[0] : result[idRetencionIva];
        }
    });
    app.filter('mapTarifa', mapTarifa);

    function mapTarifa() {
        let result = {
            '0': 'Seleccione Tarifa'
        };
        return function (input, tarifas) {
            if (tarifas !== undefined) {
                for (var value of tarifas) {
                    result[value.idTarifa] = value.tarifa;
                }
                if (!input) {
                    return result[0];
                } else {
                    return result[input];
                }
            }
        }
    }

    app.filter('mapMedida', mapMedida);

    function mapMedida() {
        let result = {
            '0': 'Seleccione Médida'
        };
        return function (input, medidas) {
            if (medidas !== undefined) {
                for (var value of medidas) {
                    result[value.idMedida] = value.descripcion;
                }
                if (!input) {
                    return result[0];
                } else {
                    return result[input];
                }
            }
        }
    }

    app.filter('mapTipoIce', () => {
        let result = {
            0: 'Seleccione el Tipo Ice'
        }
        return (input, tipoIces) => {
            if (tipoIces === null || tipoIces == undefined) return result[0];
            for (let item of tipoIces) {
                result[item.codigo] = item.descripcion
            }
            return result[input]
        }
    })


})