const CHANGE_VERSION = (largo = 50) => {
    let caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        codigo = '',
        i = 0;
    for (i; i < largo; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return '?v=' + codigo;
}

const PATH_API_COMPRA = 'Compras/'

app.constant('mainPaths', {
    cuenta_por_pagar_view: '~/Pages/Contabilidad/CuentaPorPagar/'
})

app.constant('nombreModalCommon', {
    //old version
    MAIL: {
        fileCtrl: '/js/common/modals/modalMailCtrl.js' + CHANGE_VERSION(),
        controllers: {
            ME: 'SendMailCtrl'
        },
        templates: {
            ME: '~/Pages/Common/Shared/_ModalSendMail.cshtml',
        },
    },
    //new version
    SEND_MAIL: {
        fileCtrl: '/js/common/modals/modalSendMailCtrl.min.js' + CHANGE_VERSION(),
        controllers: {
            MSM: 'modalSendMailCtrl'
        },
        templates:{
            MSM: '~/Pages/Common/Shared/_ModalSendMail.cshtml',
        } 
    },
    SEND_WHATSAPP: {
        fileCtrl: '/js/common/modals/modalSendWhatsAppCtrl.min.js' + CHANGE_VERSION(),
        controller: 'modalSendWhatsAppCtrl',
        template: '~/Pages/Common/_ModalWhatsApp.cshtml'
    },
    KEY_REQUEST_MODAL: {
        fileCtrl: '/js/common/modals/keyRequestCtrl.js' + CHANGE_VERSION(),
        controllers: "keyRequestCtrl",
        template: '~/Pages/Common/_KeyRequestModal.cshtml',        
    },
    INFO_ADICIONAL_DOC: {
        fileCtrl: '/js/common/modals/modalInfoAdicionalTipoDocCtrl.min.js',
        template: '~/Pages/Common/Shared/_ModalInfoAdicionalTipoDoc.cshtml',
        controller: 'InfoAdicionalTipoDocCtrl'
    },
    SOLICITUD_AUTORIZACION: {
        fileCtrl: '/js/common/modals/modalRegistrarSolicitudAutorizacionCtrl.min.js',
        template: '~/Pages/Common/Shared/_ModalRegistrarSolicitudAutorizacion.cshtml',
        controller: 'modalResgitrarSolicitudAutorizacionCtrl'
    }
})



//Inventario 
app.constant('nombreModalInventario', {
    ARTICULO: {
        //fileCtrl: '/js/modal/modalArticuloCtrl.min.js' + CHANGE_VERSION(),
        fileCtrl: '/js/inventario/modals/modalArticuloCtrl.min.js' + CHANGE_VERSION(),
        controllers: {
            'LG': 'ModalArticuloGeneralCtrl',
            //'M': 'ModalArticuloCtrl',
            'M': 'modalArticuloCtrl', //depuracion crud articulo
            'AFI': 'ModalArticuloFraccionadoInfoCtrl',
            'MAI': 'modalProductPhotoCtrl',
            'MID': 'ModalArticuloImagenDetalleCtrl',
            'HC': 'modalHistorialCompraCtrl',
            'AF': 'modalArticuloFraccionadoCtrl'
        },
        templates: {
            'LG': '~/Pages/Articulo/_ModalArticuloGeneral.cshtml',
            'M': '~/Pages/Articulo/_ModalAddUpdate.cshtml',
            'AFI': 'Articulo/_ArticuloFraccionadoInfo.cshtml',
            'MAI': '~/Pages/Articulo/Shared/_ModalProductPhoto.cshtml',
            'HC': '~/Pages/Compras/DocumentoRecibido/Shared/_HistoryCompras.cshtml',
            'AF': '~/Pages/ArticuloFraccionado/_ModalArticuloFraccionado.cshtml'
        }
    },
    FAMILIA: {
        fileCtrl: '/js/inventario/modals/modalFamiliaCtrl.min.js' + CHANGE_VERSION(),
        controller: 'ModalFamiliaCtrl',
        template: '~/Pages/Inventario/Familia/_ModalFamilia.cshtml'
    },
    SUBFAMILIA: {
        fileCtrl: '/js/inventario/modals/modalSubFamiliaCtrl.min.js' + CHANGE_VERSION(),
        controller: 'ModalSubFamiliaCtrl',
        template: '~/Pages/Inventario/Subfamilia/_ModalSubFamilia.cshtml'
    },
    MEDIDA: {
        fileCtrl: '/js/inventario/modals/modalMedidaCtrl.js' + CHANGE_VERSION(),
        controller: 'ModalMedidaCtrl',
        template: '~/Pages/Inventario/Medida/Shared/_ModalMedida.cshtml'
    },
    MARCA: {
        fileCtrl: '/js/inventario/modals/modalMarcaCtrl.js' + CHANGE_VERSION(),
        controller: 'ModalMarcaCtrl',
        template: '~/Pages/Inventario/Marca/Shared/_ModalMarca.cshtml'
    },
    MODELO: {
        fileCtrl: '/js/inventario/modals/modalModeloCtrl.js' + CHANGE_VERSION(),
        controller: 'ModalModeloCtrl',
        template: '~/Pages/Inventario/Modelo/Shared/_ModalModelo.cshtml'
    },
    ARTICULO_FRACCIONADO: {
        fileCtrl: '/js/modal/modalArticuloCtrl.min.js' + CHANGE_VERSION(),
        controller: 'ModalArticuloFraccionadoCtrl',
        template: 'ArticuloFraccionado/_ModalArticuloFraccionado.cshtml'
    },
    KARDEX: {
        fileCtrl: '/js/inventario/modals/modalKardexCtrl.js' + CHANGE_VERSION(),
        controllers: {
            M: 'modalKardexCtrl',
            MF: ''
        },
        templates: {
            M: '~/Pages/Kardex/Shared/_ModalKardex.cshtml',
            MF: '~/Pages/Kardex/Shared/_ModalFiltroKardex.cshtml'
        }
    },
    CONSOLIDACION: {
        fileCtrl: '/js/inventario/modals/modalConsolidacionDetalleCtrl.min.js' + CHANGE_VERSION(),
        controllers: {
            D: 'modalConsolidacionDetalleCtrl',
        },
        templates: {
            D: '~/Pages/Consolidacion/Shared/_ModalDetalle.cshtml',
        }
    },
    TRANSFERENCIA_BODEGA: {
        fileCtrl: '/js/inventario/modals/modalTransferenciaBodegaCtrl.js' + CHANGE_VERSION(),
        controllers: {
            D: 'ModalTransferenciaBodegaDetalleCtrl',
        },
        templates: {
            D: '~/Pages/TransferenciaBodega/Shared/_ModalDetalle.cshtml',
        }
    }

})

//Facturacion Electronica 
app.constant('nombreModalFactElect', {
    DATO_ADICIONAL_ARTICULO: {
        fileCtrl: '/js/factElect/modals/modalDatoAdicionalArticuloCtrl.min.js' + CHANGE_VERSION(),
        controller: 'ModalDatoAdicionalArticuloCtrl',
        template: '~/Pages/Common/_ModalDatoAdicionalVenta.cshtml'
    },
    FACTURA: {
        fileCtrl: '/js/modal/ventas/modalFacturaCtrl.min.js' + CHANGE_VERSION(),
        controllers: {
            D: 'ModalFacturaDetalleCtrl'
        },
        templates: {
            D: 'FacturaVenta/_ModalDetalle.cshtml'
        }
    },
    NOTA_CREDITO: {
        fileCtrl: '/js/factElect/modals/modalNotaCreditoDetalleCtrl.min.js' + CHANGE_VERSION(),
        controller: 'modalNotaCreditoDetalleCtrl',
        template: '~/Pages/NotaCredito/_ModalDetalle.cshtml'
    },
    RETENCION_ATS: {
        fileCtrl: '/js/factElect/modals/modalRetencionAtsCtrl.min.js' + CHANGE_VERSION(),
        controller: 'modalRetencionAtsCtrl',
        template: '~/Pages/FactElect/RetencionAts/Shared/_ModalAddUpdate.cshtml'
    }
})

app.constant('nombreModalVenta', {
    CONVERT_TO_DOC: {
        fileCtrl: '/js/ventas/modals/modalConvertToDocCtrl.min.js' + CHANGE_VERSION(),
        controllers: {
            M: 'convertToDocModalCtrl',
            MHCD: 'historialConversionDocCtrl'
        },
        templates: {
            M: '~/Pages/Ventas/Shared/_ModalConvertToDoc.cshtml',
            MHCD: '~/Pages/Ventas/Shared/_ModalHistorialConversionDoc.cshtml', 
        }
    }, 


    DOC_VENTA_DETALLE: {
        fileCtrl: '/js/common/modals/modalDocVentaDetalleCtrl.min.js' + CHANGE_VERSION(),
        controller: 'modalDocVentaDetalleCtrl',
        templates: {
            NE: '~/Pages/NotaEntrega/_ModalDetalle.cshtml',
            FV_SRI: '~/Pages/Factura/_ModalDetalle.cshtml',
            PR: '~/Pages/Proforma/_ModalDetalle.cshtml',
            NC_SRI: '~/Pages/NotaCredito/_ModalDetalle.cshtml'
        }

    },
    CLIENTE: {
        fileCtrl: '/js/ventas/modals/modalClienteCtrl.js' + CHANGE_VERSION(),
        controllers: {
            M: 'ModalClienteCtrl',
            ML: 'ModalClienteListaCtrl'
        },
        templates: {
            M: '~/Pages/Cliente/_ModalAddUpdate.cshtml',
            ML: '~/Pages/Cliente/_ModalClienteLista.cshtml'
        }
    },
    EMPRESA: {
        fileCtrl: '/js/ventas/modals/modalEmpresaCtrl.min.js',
        controller: 'ModalEmpresaCtrl',
        template: '~/Pages/Ventas/Empresa/_ModalAddEdit.cshtml'
    },
    EMPLEADO: {
        fileCtrl: '/js/ventas/modals/modalEmpleadoCtrl.min.js',
        controller: 'ModalEmpleadoCtrl',
        template: '~/Pages/Empleado/Shared/_ModalAddUpdate.cshtml'
    },
    CARGO: {
        fileCtrl: '/js/ventas/modals/modalCargoCtrl.js',
        controller: 'ModalCargoCtrl',
        template: '~/Pages/Cargo/_ModalAddUpdate.cshtml'
    },
    NOTA_ENTREGA: {
        fileCtrl: '/js/modal/ventas/modalNotaEntregaCtrl.js',
        controllers: {
            D: 'ModalNotaEntregaDetalleCtrl',
        },
        templates: {
            D: 'NotaEntrega/_ModalDetalle.cshtml',
        }
    }, 
    PROFORMA: {
        fileCtrl: '/js/modal/ventas/modalProformaCtrl.js' + CHANGE_VERSION(),
        controllers: {
            MN: 'ModalProformaNuevoCtrl',
            ME: 'ModalProformaEditarCtrl',
            MD: 'ModalProformaDetalleCtrl',
            MDUPLICATE: 'ModalProformaDuplicarCtrl',
            MF: 'ModalProformaFiltroCtrl'
        },
        templates: {
            MN: '~/Pages/Proforma/_ModalNuevo.cshtml',
            ME: '~/Pages/Proforma/_ModalEditar.cshtml',
            MD: '~/Pages/Proforma/_ModalDetalle.cshtml',
            MDUPLICATE: '~/Pages/Proforma/_ModalDuplicar.cshtml',
            MF: '~/Pages/Proforma/_ModalFiltro.cshtml'
        }
    },

    SOLICITUD_CREDITO: {
        fileCtrl: '/js/ventas/modals/modalSolicitudCreditoCtrl.min.js' + CHANGE_VERSION(),
        controllers: {
            MSC: 'modalSolictudCreditoCtrl'
        },
        templates: {
            MSC: '~/Pages/Ventas/Components/_SolicitudCreditoComponent.cshtml',
        }
    },
    /**
     * NUEVO FORMA DE AGREGAR LOS DATOS ADICIONALES EN VENTA 
     */
    INFO_ADICIONAL_ARTICULO: {
        fileCtrl: '/js/ventas/modals/modalInfoAdicionalArticuloCtrl.min.js' + CHANGE_VERSION(),
        controller: 'modalInfoAdicionalArticuloCtrl',
        template: '~/Pages/Ventas/Modals/_ModalInfoAdicionalArticulo.cshtml',
        
    },

})

//Compras
app.constant('nombreModalCompra', {
    DOC_COMPRA_DETALLE: {
        fileCtrl: '/js/common/modals/modalDocCompraDetalleCtrl.min.js' + CHANGE_VERSION(),
        controller: 'modalDocCompraDetalleCtrl',
        templates: {
            LC: `~/Pages/${PATH_API_COMPRA}LiquidacionCompra/_ModalDetalle.cshtml`,
            FC: `~/Pages/${PATH_API_COMPRA}FacturaCompra/_ModalDetalle.cshtml`,
            CNH: `~/Pages/${PATH_API_COMPRA}CompraNoHabitual/_ModalDetalle.cshtml`,
            OC: `~/Pages/${PATH_API_COMPRA}OrdenCompra/_ModalDetalle.cshtml`,
        }

    },
    FACTURA_FISICA: {
        fileCtrl: '/js/modal/compras/modalFacturaCtrl.js' + CHANGE_VERSION(),
        controllers: {
            D: 'ModalFacturaDetalleCtrl',
        },
        templates: {
            D: `~/Pages/${PATH_API_COMPRA}FacturaCompra/_ModalDetalle.cshtml`
        }
    },
    PROVEEDOR: {
        fileCtrl: '/js/compras/modals/modalProveedorCtrl.js' + CHANGE_VERSION(),
        // fileCtrl: '/js/ventas/modals/modalClienteCtrl.js',
        controllers: {
            M: 'modalProveedorCtrl',
            L: 'modalProveedorListaCtrl'
        },
        templates: {
            M: `~/Pages/${PATH_API_COMPRA}Proveedor/_ModalAddUpdate.cshtml`,
            L: `~/Pages/${PATH_API_COMPRA}Proveedor/_ModalLista.cshtml`
        }
    },
    CATEGORIA_COMPRA: {
        fileCtrl: '/js/compras/modals/modalCategoriaCompraCtrl.js' + CHANGE_VERSION(),
        controller: 'modalCategoriaCompraCtrl',
        template: `~/Pages/${PATH_API_COMPRA}CategoriaCompra/_ModalAddUpdate.cshtml`,
    },
    DOCUMENTO_RECIBIDO: {
        fileCtrl: '/js/compras/modals/docRecibidoPreviewCtrl.js' + CHANGE_VERSION(),
        controller: 'docRecibidoPreviewCtrl',
        F: {
            template: '~/Pages/Compras/DocumentoRecibido/Shared/_InvoicePreview.cshtml'
        }
    },
})

app.constant('nombreModalLogistica', {
    GUIA_REMISION: {
        fileCtrl: '/js/logistica/modals/guiaRemisionDetalleCtrl.min.js' + CHANGE_VERSION(),
        controller: 'GuiaRemisionDetalleCtrl',
        template: '~/Pages/GuiaRemision/Shared/_ModalDetalle.cshtml'
    },
    TRANSPORTISTA: {
        fileCtrl: '/js/logistica/modals/modalTransportistaCtrl.js' + CHANGE_VERSION(),
        controllers: {
            M: 'ModalTransportistaCtrl'
        },
        templates: {
            M: '~/Pages/FactElect/Transportista/Shared/_ModalAddUpdate.cshtml'
        }
    },
    VEHICULO: {
        fileCtrl: '/js/logistica/modals/modalVehiculoCtrl.js' + CHANGE_VERSION(),
        controllers: {
            M: 'ModalVehiculoCtrl'
        },
        templates: {
            M: '~/Pages/FactElect/Vehiculo/Shared/_ModalAddUpdate.cshtml'
        }
    }
})

app.constant('nombreModalContabilidad', {
    COBRO_RAPIDO: {
        fileCtrl: '/js/contabilidad/modals/cobro/modalCobroRapidoCtrl.min.js' + CHANGE_VERSION(),
        ctrl:'modalCobroRapidoCtrl',
        template: '~/Pages/Contabilidad/CuentaPorCobrar/Shared/_ModalCobroRapido.cshtml'
    },
    COBRO_LOTE: {
        fileCtrl: '/js/contabilidad/modals/cobro/modalCobroLoteCtrl.js' + CHANGE_VERSION(),
        ctrl: 'modalCobroLoteCtrl',
        template: '~/Pages/Contabilidad/CuentaPorCobrar/Shared/_ModalCobroLote.cshtml'
    },
    FORMA_COBRO: {
        fileCtrl: '/js/contabilidad/modals/cobro/modalFormaCobroCtrl.min.js' + CHANGE_VERSION(),
        ctrl: 'modalFormaCobroCtrl',
        template: '~/Pages/Contabilidad/CuentaPorCobrar/Shared/_ModalFormaCobro.cshtml'
    },
    COBRO: {
        fileCtrl: '/js/contabilidad/modals/modalCobroCtrl.min.js' + CHANGE_VERSION(),
        fileCuotaCtrl: '/js/contabilidad/modals/modalCuotaCtrl.min.js' + CHANGE_VERSION(),
        fileHistorialCobro: '/js/contabilidad/modals/modalHistorialCobroCtrl.min.js' + CHANGE_VERSION(),
      
        controllers: {
            CR: 'ModalCobroRapidoCtrl', //Modal - Cobro Rapido 
            CL: 'ModalCobroLoteCtrl', //Cobro Lote
            MFC: 'ModalFormaCobroCtrl',
            CD: 'ModalCobroDetalleCtrl',
            MC: 'ModalCuotaCtrl',
            MM: 'ModalMoraCtrl',
            MGFP: 'modalGestionFinancieraPersonalCtrl'
        },
        templates: {
            CR: '~/Pages/Contabilidad/CuentaPorCobrar/Shared/_ModalCobroRapido.cshtml',
            CL: '~/Pages/Contabilidad/CuentaPorCobrar/Shared/_ModalCobroLote.cshtml',
            MFC: '~/Pages/Contabilidad/CuentaPorCobrar/Shared/_ModalFormaCobro.cshtml',
            CD: '~/Pages/Contabilidad/CuentaPorCobrar/Shared/_ModalCobroDetalle.cshtml',
            MC: '~/Pages/Contabilidad/CuentaPorCobrar/Shared/_ModalCuota.cshtml',
            MM: '~/Pages/Contabilidad/CuentaPorCobrar/Shared/_ModalMora.cshtml',
            MGFP: '~/Pages/Contabilidad/Components/_GestionFinancieraPersonal.cshtml',
        }
    },
    PAGO: {
        fileCtrl: '/js/contabilidad/modals/modalPagoCtrl.js' + CHANGE_VERSION(),
        controllers: {
            MPL: 'modalPagoLoteCtrl',
            MFP: 'modalFormaPagoCtrl'
        },
        templates: {
            MPL: '~/Pages/Contabilidad/CuentaPorPagar/Shared/_ModalPagoLote.cshtml',
            MFP: '~/Pages/Contabilidad/CuentaPorPagar/Shared/_ModalFormaPago.cshtml'
        }
    }, 
    POSFECHADO_COBROS_MODAL: {
        fileCtrl: '/js/contabilidad/modals/cobro/posfechadoCobrosModalCtrl.js' + CHANGE_VERSION(),
        ctrl: 'posfechadoCobrosModalCtrl',
        template: '~/Pages/Contabilidad/ComprobanteIngreso/_PosfechadoCobrosModal.cshtml'
    },
    POSFECHADO_PAGO_MODAL: {
        fileCtrl: '/js/contabilidad/modals/pago/posfechadoPagosModalCtrl.js' + CHANGE_VERSION(),
        ctrl: 'posfechadoPagosModalCtrl',
        template: '~/Pages/Contabilidad/ComprobanteEgreso/_PosfechadoPagosModal.cshtml'
    }
})

app.constant('nombreModal', { 
    common: {
        MODAL_INFO_ADICIONAL_TIPO_DOC_CTRL: 'common/modalInfoAdicionalTipoDocCtrl.min.js' + CHANGE_VERSION(),
        MODAL_INFO_ADICIONAL_TIPO_DOC_CSHTML: '_ModalInfoAdicionalTipoDoc.cshtml',

        MODAL_MODULO_IMPORTACION_CTRL: 'common/modalModuloImportacionCtrl.js' + CHANGE_VERSION(),
        MODAL_MODULO_IMPORTACION_CSHTML: '~/Pages/Common/Shared/_ModalModuloImportacion.cshtml',

        MODAL_COMPROBANTE_ERROR_CTRL: 'common/modalComprobanteErrorCtrl.js' + CHANGE_VERSION(),
        MODAL_COMPROBANTE_ERROR_CSHTML: '~/Pages/Common/Shared/_ModalComprobanteError.cshtml',

        MODAL_SEND_MAIL_CTRL: '/js/common/modals/modalMailCtrl.js' + CHANGE_VERSION(),
        MODAL_STATUS_MAIL_CSHTML: '~/Pages/FactElect/DocumentoElectronico/Shared/_ModalStatusEmail.cshtml',

        MODAL_SEND_WHATSAPP_CTRL: '/js/modal/common/modalWhatsAppCtrl.min.js' + CHANGE_VERSION(),
        MODAL_SEND_WHATSAPP_CSHTML: '~/Pages/Common/WhatsApp/Shared/_ModalWhatsApp.cshtml',

        MODAL_INFO_ADICIONAL_DOC: {
            controller: 'InfoAdicionalTipoDocCtrl',
            template: '~/Pages/Common/Shared/_ModalInfoAdicionalTipoDoc.cshtml'
        }
    },  
    compra: {
        MODAL_CUOTA_CTRL: 'modalCompraCuotaCtrl.js' + CHANGE_VERSION(),
        MODAL_CUOTA_CSHTML: '_ModalCompraCuota.cshtml',
        MODAL_DATO_ADICIONAL_ARTICULO: {
            fileCtrl: '/js/compras/modals/modalDatoAdicionalArticulo.js' + CHANGE_VERSION(),
            controller: 'ModalDatoAdicionalArticuloCtrl',
            template: '~/Pages/Compras/Shared/_ModalDatoAdicionalArticulo.cshtml'
        }
    },  
    
    
})



app.constant('TAX_RATE_CODE', {
    ZERO_PERCENT: "0",
    TWELVE_PERCENT: "2",
    FOURTEEN_PERCENT: "3",
    NOT_SUBJECT_TO_TAX: "6",
    TAX_EXEMPT: "7",
    DIFFERENTIATED_TAX: "8",
})

app.constant('DOC_TYPE', {
    FE : 'FE',  //Factura Electrónica
    FV_SRI: '01',
    FV: 'FV',
    NE: 'NE',
    PR: 'PR',
    NC: 'NC',
    NC_SRI: '04',
    APROB_DOC: 'APR',
    LC: 'LC',
    FC: 'FC',
    CNH: 'CNH',
    OC: 'OC',
    GR_SRI: '06',
    R_SRI: '07',
    LC_SRI:'03'
})
app.constant('SRI_IDENTIFITION_CODE', {
    RUC: "04",
    LICENSE: "05",
    PASSPORT: "06",
    CONSUMIR_FINAL: '07'
})

app.constant('CODE_REPORT', {
    RF: 'RF', //Reporte Factura
    FG: "FG", //Ventas -> Factura General
    CCR: 'CCR', //Cuenta por cobrar
    FEG: 'FEG', //Facturacion Electronica -> Factura General
    RNE: 'RNE',
    RNC: 'RNCC', //Reporte Nota Credito
    NCRG: 'NCRG', //Reporte Nota Credito General
    PR: 'PR', //Reporte Proforma,
    PRE_F: 'RAC', //Aprobacion-Factura
    P_NE: 'P-NE', //Aprobacion - Nota Entrega
    RLC: 'RLC', //Reporte Liquidacion Compra
    RCD: 'RCD', //Reporte Compra detalle
    RFC: 'RFC', //Reporte Factura Compra
    RCNH: 'RCNH', //PDF compra no habitual
    ROC: 'ROC', //Orden Compra 
    RGR: 'RGR', //Reporte Guia Remision 
    FCRRG: 'FCRRG', //Facturación Retención Reporte General
    RRC:'RRC',
    RCINGR: 'RCINGR',
    VSC : 'VSC' // Venta Solicitud Garante
})