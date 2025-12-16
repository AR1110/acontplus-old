//@ts-check

(function () {

  'use strict';

  //Variables Constantes
  const URL_TEMPLATE = '~/Pages/FactElect/GuiaRemision/Shared/'

  let guiaRemisionSvc = {};
  let commonSvc = {};
  let fS = {};
  let tS = {};

  app.controller('guiaRemisionCtrl', guiaRemisionCtrl);

  guiaRemisionCtrl.$inject = ['$scope', '$injector', '$filter', 'modalService'];

  function guiaRemisionCtrl($scope, $injector, $filter, modalSvc) {
    const docElectSvc = $injector.get('docElectService');


    guiaRemisionSvc = $injector.get('guiaRemisionService');
    commonSvc = $injector.get('commonService');
    fS = $injector.get('formulario');
    tS = $injector.get('toastService');
    const CODE_REPORT = $injector.get('CODE_REPORT');
    const policyService = $injector.get('PolicyService');

    $scope.cliente = {};

    $scope.estadosDocumento = [
      { codigo: 'AUTH', descripcion: 'AUTORIZADO' },
      { codigo: 'NAUTH', descripcion: 'NO AUTORIZADO' },
    ]

    $scope.recordsQuantity = [25, 50, 100];

    $scope.dataSearch = {
      pageIndex: 1,
      pageSize: 25,
      checkBoxDate: true,
      totalRecords: 0,
      maxSize: 5
    };

    $scope.openModalNew = async function () {
      try {

        await policyService.sendMaxDocuments();

        let modalRef = modalSvc.openModalCustom({
          controller: 'ModalGuiaRemisionCtrl',
          template: URL_TEMPLATE + '_ModalAddUpdate.cshtml',
          params: {
            tipoRegistro: 1
          },
          windowClass: 'uibModalFullScreen',
          isRenderRazorPartial: true
        })

        modalRef.result.then(result => {
          if (typeof result === 'object') {
            $scope.getGuiasRemision();
          }
        })
      } catch (error) {
        console.log(error);
      }
    }

    //========================Start Filters=================

    $scope.resultRangeFilter = function (item) {
      $scope.dataSearch.fechaInicio = item.startDate,
        $scope.dataSearch.fechaFin = item.endDate
      $scope.getGuiasRemision();
    }

    $scope.onKeyupCliente = function () {
      if (!$scope.cliente.nombreCliente) {
        $scope.dataSearch.byCliente = 0;
        $scope.dataSearch.checkBoxDate = true;
      }
    }

    $scope.onSelectCliente = function (item) {
      $scope.dataSearch.byCliente = item.idCliente;
      $scope.dataSearch.checkBoxDate = true;
      $scope.getGuiasRemision();
    }


    $scope.usuario = {}
    $scope.onKeyupUsuarioSearch = function () {
      if (!$scope.usuario.nombreUsuario) {
        $scope.dataSearch.byUsuario = 0;
      }
    }

    $scope.selectedUsuarioSearch = function (item) {
      $scope.dataSearch.byUsuario = item.idUsuario;
      $scope.getGuiasRemision();
    }

    $scope.onClickBtnMore = function () {
      $scope.moreSearchOptions = !$scope.moreSearchOptions;
    }

    $scope.searchFilterLocal = function () {
      let guiasRemision = JSON.parse(JSON.stringify($scope.cloneGuiasRemision));
      $scope.guiasRemision = $filter("filter")(guiasRemision, $scope.dataSearch.bySearch);

    }

    //=====================Eend Filters=======================

    $scope.getGuiasRemision = function () {
      if ($scope.dataSearch.nroSecuencial) {
        if (!fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)) {
          $scope.dataSearch.checkBoxDate = true;
          tS.toastr('error', 'Define correctamente el número de secuencial o el rango de número secuencial!')
          return
        }
        if (!($scope.dataSearch.byCliente > 0)) {
          $scope.dataSearch.checkBoxDate = false;
        }
      }

      $scope.guiasRemision = [];
      $scope.cloneGuiasRemision = [];

      let query = {
        codEstab: $scope.dataSearch.codEstab,
        idPuntoEmision: $scope.dataSearch.idPuntoEmision,
        checkBoxDate: $scope.dataSearch.checkBoxDate,
        idCliente: fS.isValidField($scope.dataSearch.byCliente),
        codEstado: fS.isValidField($scope.dataSearch.codEstado),
        byUsuario: fS.isValidField($scope.dataSearch.byUsuario),
        fechaInicio: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
        fechaFin: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
        secuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial),
        pageIndex: $scope.dataSearch.pageIndex,
        pageSize: $scope.dataSearch.pageSize
      }

      guiaRemisionSvc.getAll(query).then(response => {
        $scope.guiasRemision = response;
        $scope.cloneGuiasRemision = structuredClone($scope.guiasRemision);
        $scope.dataSearch.totalRecords = $scope.guiasRemision.length > 0 ? $scope.guiasRemision[0].totalRecords : 0;
      })


    }

    $scope.initiload = function () {
      guiaRemisionSvc.getDataFilter().then(response => {
        $scope.establecimientos = response.estabs;

        if ($scope.establecimientos.length > 0) {
          let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
          $scope.puntosEmision = dataEstab.puntosEmision;
          $scope.dataSearch.codEstab = dataEstab.codEstab;
          $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
          $scope.getGuiasRemision();
        }
      })
    }
    $scope.initiload();

    $scope.refresh = function () {
      $scope.getGuiasRemision();
    }

    $scope.pagechanged = function () {
      $scope.refresh()
    };

    $scope.changePageSize = function () {
      $scope.dataSearch.pageIndex = 1;
      $scope.refresh()
    };


    $scope.estabFilter = function () {
      let dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);
      $scope.puntosEmision = dataEstab.puntosEmision;
      if ($scope.puntosEmision.length > 0) {
        $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
        $scope.getGuiasRemision();
      } else {
        fS.sweetAlert('warning', "No posee puntos de emisión asignadas!");
      }
    }



    $scope.openModalEdit = function (item) {

        let modalRef = modalSvc.openModalCustom({
          controller: 'ModalGuiaRemisionCtrl',
          template: URL_TEMPLATE + '_ModalAddUpdate.cshtml',
          params: {
            tipoRegistro: 2,
            id: item.idGuiaRemision,
            serieComprobanteDocReferenciado: item.serieFactura
          },
          windowClass: 'uibModalFullScreen',
          isRenderRazorPartial: true
        })

        modalRef.result.then(result => {
          if (result !== null && typeof result === 'object') {
            $scope.getGuiasRemision();
          }
        })
    }

    $scope.openModalDetalle = async function (item) {
       modalSvc.openModalCustom({
          controller: 'ModalGuiaRemisionCtrl',
          template: URL_TEMPLATE + '_ModalDetalle.cshtml',
          params: {
            tipoRegistro: 2,
            id: item.idGuiaRemision,
            serieComprobanteDocReferenciado: item.serieFactura
          },
          windowClass: 'uibModalFullScreen',
          isRenderRazorPartial: true
        })
    }

    $scope.askToDelete = async (item) => {
        const responseValidateNormativeSri = await docElectSvc.validateNormativeSri({
          accion: 'anular',
          identificacion: item.identificacionDestinatario,
          fechaEmision: item.fechaEmision,
          codDoc: item.codDoc

        })

        Swal.fire({
          title: '¿Esta seguro que desea anular este comprobante?',
          html: `Recuerde que tiene que acceder a la página del SRI -> <b>Facturación Electrónica</b> -> <b>Producción</b> -> <b>Anulación</b> -> <b>Solicitud de Anulación</b> para poder anular el comprobante y no tenga validez tributaria.`,
          icon: "warning",
          focusCancel: true,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: 'Si, anular!',
          cancelButtonText: 'Cancelar!',
        }).then((result) => {
          if (result.isConfirmed) {
            guiaRemisionSvc.anular(item.idGuiaRemision).then(response => {
              if (response.code === "0") {
                fS.sweetAlert('warning', response.message, response.titleSms);
              }
              if (response.code === "1") {
                fS.sweetAlert('success', response.message, response.titleSms, 1000);
                $scope.getGuiasRemision();
              }
            })
          }
        });
    }



    //Reporte
    $scope.getReport = (item) => {
        let format = 'pdf';
        let parameters = {
          dataParams: JSON.stringify({
            id: item.idGuiaRemision,
            normalMethod: true,
          }),
          reportParams: JSON.stringify({
            codEstab: item.codEstab,
            codigo: CODE_REPORT.RGR,
            format,
          }),
          hasService: true,
        }

        commonSvc.getReport({
          parameters,
          format
        })
    }


  }


  /**
   * =====================================MODAL GUIA-REMISION=================================
   *
   */
  app.controller('ModalGuiaRemisionCtrl', ModalGuiaRemisionCtrl);
  ModalGuiaRemisionCtrl.$inject = [
    '$scope',
    '$uibModalInstance',
    '$timeout',
    '$injector',
    'params'
  ];

  function ModalGuiaRemisionCtrl($scope, $uibModalInstance, $timeout, $injector, params) {

    const commonSvc = $injector.get('commonService');
    const guiaRemisionSvc = $injector.get('guiaRemisionService');
    const transportistaSvc = $injector.get('transportistaService');
    const vehiculoSvc = $injector.get('vehiculoService');
    const modalSvc = $injector.get('modalService');
    const tS = $injector.get('toastService');
    const fS = $injector.get('formulario');
    const DOC_TYPE = $injector.get('DOC_TYPE');
    let infoAdicionalConfig = [];
    let isSetInfoAdicionalConfig = true;

    $scope.tipoDoc = {
      codigo: 'GR'
    }

    $scope.searchClienteOptions = {}
    $scope.searchClienteOptions.showBtnNew = true;
    $scope.searchClienteOptions.showBtnList = true;

    $scope.data = {}
    $scope.data.fechaEmision = new Date()
    $scope.data.fechaInicio = new Date();
    $scope.data.fechaFin = new Date();

    $scope.dataClone = {}

    $scope.establecimientos = [];

    $scope.isLoading = false;

    $scope.gridOptionsDetalle = {
      enableColumnMenus: false,
      enableSorting: false,
      enableFiltering: false,
      enableRowHashing: false,
      enableCellEdit: true,
    }

    $scope.gridOptionsDetalle.onRegisterApi = function (gridApi) {
      $scope.gridApi = gridApi;
      if ($scope.gridApi) {
        $timeout(() => {
          $scope.gridApi.core.handleWindowResize();
          $scope.gridApi.grid.refresh();
        }, 5);
      }


      gridApi.grid.element.on('keyup', function (ev) {
        if (ev.which == 13 || ev.keyCode == '13') {
          setFocusArticulo();
          $scope.gridApi.grid.cellNav.clearFocus();
          // ev.stopPropagation();
        }
      })

      gridApi.edit && gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newValue, oldValue) => {

        if ([undefined, null, ""].includes(rowEntity[colDef.field])) {
          rowEntity[colDef.field] = oldValue;
        }
        if (colDef.field == "cantidad" && rowEntity.cantidad === 0) {
          rowEntity.cantidad = oldValue;
        }
        if (colDef.field === "cantidad") {
          rowEntity.cantidad = fS.roundNumber(newValue, 5);
        }

      })
    }

    $scope.gridOptionsDetalle.columnDefs = [{
      name: 'N°',
      field: 'n',
      type: 'number',
      width: '5%',
      minWidth: '50',
      enableCellEdit: false,
      allowCellFocus: false
    },
    {
      name: "Código",
      field: "codigo",
      type: 'string',
      width: '8%',
      minWidth: '50',
      enableCellEdit: false,
      allowCellFocus: false
    },
    {
      name: 'Descripcion',
      field: 'descripcion',
      type: 'string',
      width: '65%',
      minWidth: '150',
      enableCellEdit: true,
      enableCellEditOnFocus: true,
      cellEditableCondition: function (scope) {
        return scope.row.entity.llevaInventario !== true;
      },
      cellTooltip: function (row) {
        return row.entity.descripcion;
      },
    },
    {
      name: "Cantidad",
      field: 'cantidad',
      type: "number",
      width: '10%',
      minWidth: '100',
      allowCellFocus: true,
      enableCellEditOnFocus: true
    },
    {
      name: 'Op',
      enableCellEdit: false,
      enableColumnMenu: false,
      allowCellFocus: false,
      width: '11%',
      minWidth: '100',
      cellTemplate: `<div class="text-center"><button type="button" class="btn btn-success btn-sm text-white" style="cursor:pointer;" title="Editar Item" ng-click="grid.appScope.openModalArticuloEditar(row.entity)"><i class="ti-pencil"></i></button>
                                <button type="button" class="btn btn-danger btn-sm text-white" style="cursor:pointer;" title="Eliminar Item" ng-click="grid.appScope.deleteRow(row.entity)"><i class="ti-trash"></i></button></div>`,
    },
    {
      name: '',
      field: 'goBackArticulo',
      enableCellEdit: false,
      width: '1%'
    },
    ]

    $scope.cliente = {};
    $scope.transportista = {};
    $scope.vehiculo = {};
    $scope.empleado = {};
    $scope.infoAdicionalDocumento = [];

    let deletedItems = [];
    let tiposDoc = [];

    initiload();
    async function initiload() {
        guiaRemisionSvc.getDataForm().then(response => {
          const { estabs, infoAdicional } = response;
          $scope.establecimientos = estabs;
          infoAdicionalConfig = infoAdicional
          tiposDoc = response.tiposDoc
          tiposDoc.push({
            codigo: DOC_TYPE.APROB_DOC,
            descripcion: 'Aprobación Ventas'
          })
          //Nuevo
          if (params !== null && typeof params === "object" && params.tipoRegistro === 1) {
            $scope.tipoRegistro = 1;
            $scope.titleModal = 'Guardar';
            $scope.iconBtnSave = 'ti-save';

            const dataEstab = $scope.establecimientos.find(estab => estab.defaultEstab);
            if (dataEstab) {
              $scope.data.codEstab = dataEstab.codEstab;
              $scope.dataClone.codEstab = dataEstab.codEstab;

              $scope.puntosEmision = dataEstab.puntosEmision;
              let dataPuntoEmision = $scope.puntosEmision.find(ptoEmi => ptoEmi.defaultPtoEmi);
              if (dataPuntoEmision) {
                $scope.data.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
              }
            }

            setInfoAdicional();

          }

          if (params !== null && typeof params === 'object' && params.id > 0) {
            $scope.tipoRegistro = 2;
            $scope.titleModal = 'Actualizar';
            $scope.iconBtnSave = 'ti-save';
            guiaRemisionSvc.getId(params.id).then(response => {
              const {
                comprobante,
                detalles,
                cliente,
                empleado,
                infoAdicionalDocumento,
                transportista,
                vehiculo,
              } = response;

              $scope.data = comprobante;
              $scope.cliente = cliente;
              $scope.transportista = transportista;

              $scope.vehiculo = vehiculo;
              $scope.empleado = empleado;

              $scope.infoAdicionalDocumento = infoAdicionalDocumento;

              let dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab)
              $scope.puntosEmision = dataEstab.puntosEmision;

              $scope.gridOptionsDetalle.data = detalles;

              $scope.dataDocumentoReferenciado = {
                serieComprobante: params.serieComprobanteDocReferenciado,
                idDocumento: comprobante.idDocumento,
                labelName: comprobante.idDocumento > 0 ? `Factura: ${params.serieComprobanteDocReferenciado}` : ``
              }

            })
          }
        })
    }


    //===========================Establecimiento====================
    $scope.onChangeEstablecimiento = async function () {
      try {

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger ml-2'
          },
          buttonsStyling: false
        })

        let { isConfirmed } = await swalWithBootstrapButtons.fire({
          title: '<small>Cambiar Establecimiento?</small>',
          html: "<small>Esta seguro de cambiar el <b>Establecimiento</b> y el <b>Punto de Emisión</b>?</small>",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, cambiar!',
          cancelButtonText: 'No, cancelar!',
          reverseButtons: false,
          allowOutsideClick: false,
          allowEscapeKey: false
        })

        if (isConfirmed) {
          $scope.dataClone.codEstab = $scope.data.codEstab;

          const dataEstab = $scope.establecimientos.find(item => item.codEstab === $scope.data.codEstab);
          $scope.puntosEmision = dataEstab.puntosEmision;
          $scope.data.idPuntoEmision = $scope.puntosEmision.length > 0 ? $scope.puntosEmision.find(ptoEmi => (ptoEmi.defaultPtoEmi)).idPuntoEmision : 0;
          $scope.dataDocumentoReferenciado = {};
          setInfoAdicional();
          $scope.$apply();
        } else {
          $scope.data.codEstab = $scope.dataClone.codEstab;
          $scope.$apply();
        }

      } catch (error) {
        console.trace(error)
      }
    }

    $scope.onChangePuntoEmision = function () {
      if ($scope.data.id > 0) {
        tS.toastr('warning', 'Punto de Emisión no puede ser editada');
        $scope.data.idPuntoEmision = $scope.dataClone.idPuntoEmision;
        return
      }
      setInfoAdicional();
    }

    function setInfoAdicional() {
      if (isSetInfoAdicionalConfig) {
        $scope.infoAdicionalDocumento = $scope.infoAdicionalDocumento.filter(
          (d) => !(d.idPuntoEmision > 0)
        );

        let dataInfoAdicional = infoAdicionalConfig.find(
          (i) => i.idPuntoEmision === $scope.data.idPuntoEmision
        );
        if (!dataInfoAdicional) return;
        let infoAdicionPtoEmi = dataInfoAdicional.infoAdicional.map((i) => {
          return {
            ...i,
            idPuntoEmision: $scope.data.idPuntoEmision,
          };
        });
        $scope.infoAdicionalDocumento = [
          ...infoAdicionPtoEmi,
          ...$scope.infoAdicionalDocumento,
        ];
      }
      isSetInfoAdicionalConfig = true;
    }

    //----------------------------TRANSPORTISTA----------------------

    $scope.onKeyupTransportistaSearch = function () {
      if (!$scope.transportista.nombre) {
        $scope.transportista = {};
      }
    }

    $scope.transporteSearch = function (bySearch) {
      const json = {
        typeList: 2,
        bySearch
      }
      if (bySearch.length > 2) {
        return transportistaSvc.getAll(json);
      }
    }

    $scope.selectedTransportstaChange = function (data) {
      $scope.transportista = data;
    }

    $scope.vehiculoSearch = function (textSearch) {
      const json = {
        textSearch
      }

      if (textSearch.length > 2) {
        return vehiculoSvc.search(json);
      }
    }


    $scope.onKeyupVehiculoSearch = function () {
      if (!$scope.vehiculo.placa) {
        $scope.vehiculo = {}
      }
    }

    $scope.selectedVehiculoChange = function (item) {
      $scope.vehiculo = item;
    }

    $scope.resultModalVehiculo = function (result) {
      try {
        if (typeof result == 'object') {
          $scope.vehiculo = result;
        }
      } catch (error) {
        console.log(error)
      }

    }

    $scope.empleadoSearch = function (textSearch) {
      return commonSvc.querySearchEmpleado(textSearch);
    }

    $scope.onKeyupSearchEmpleado = function () {
      if (!$scope.empleado.nombreCompleto) {
        $scope.empleado = {};
      }
    }

    $scope.selectedEmpleadoChange = function (item) {
      $scope.empleado = item;
    }

    //======================Cliente==========================================
    $scope.onKeyupCustomer = function () {
      if (!$scope.cliente.nombreFiscal) {
        $scope.cliente = {};
        $scope.dataDocumentoReferenciado = {};
        $scope.gridOptionsDetalle.data = [];
      }
    }
    $scope.onSelectedClienteChange = function (result) {
      if (result.idCliente !== $scope.cliente.idCliente) {
        $scope.gridOptionsDetalle.data = [];
        $scope.dataDocumentoReferenciado = {};
      }
      $scope.cliente.idCliente = result.idCliente;
      $scope.cliente.nombreFiscal = result.nombreFiscal;
      $scope.cliente.numeroIdentificacion = result.numeroIdentificacion;
    }
    //=====================End cliente========================================

    $scope.isShowDataGuia = true;
    $scope.mostrarDatosGuia = function () {
      $scope.isShowDataGuia = !$scope.isShowDataGuia;
    }

    //=====================================START SEARCH DOCS ============================
    $scope.dataDocumentoReferenciado = {};
    $scope.openModalDoc = function () {
      try {
        if (!($scope.cliente.idCliente > 0)) {
          tS.toastr('warning', 'Seleccione el Cliente');
          return
        }
        const modalRef = modalSvc.openModalCustom({
          controller: [
            '$scope',
            '$uibModalInstance',
            'formulario',
            'DOC_TYPE',
            'modalService',
            'nombreModalVenta',
            'params', function ($scope, $uibModalInstance, fS, DOC_TYPE, modalSvc, nombreModalVenta, params) {
              const { cliente, codEstab, tiposDoc } = params;

              $scope.cliente = cliente;
              $scope.tiposDoc = tiposDoc;
              $scope.recordsQuantity = [5, 10, 25];

              $scope.dataSearch = {
                pageIndex: 1,
                pageSize: 5,
                maxSize: 5,
                totalRecords: 0,
                codDoc: $scope.tiposDoc.find(item => item.codigo === DOC_TYPE.FE).codigo,
                checkBoxDate: true,
                fechaInicio: new Date(),
                fechaFin: new Date()
              };
              $scope.documentos = [];

              $scope.resultRangeFilter = function (item) {
                $scope.dataSearch.fechaInicio = item.startDate;
                $scope.dataSearch.fechaFin = item.endDate
                $scope.getDocs();
              }

              function getTipo() {
                if ($scope.dataSearch.codDoc === DOC_TYPE.FE) return 5;
                if ($scope.dataSearch.codDoc === DOC_TYPE.NE) return 6;
                if ($scope.dataSearch.codDoc === DOC_TYPE.APROB_DOC) return 7;
              }



              $scope.getDocs = function () {
                try {

                  if ($scope.dataSearch.nroSecuencial) {
                    if (!fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)) {
                      tS.toastr('error', 'Define correctamente el número de secuencial o el rango de número secuencial!')
                      return
                    }
                  }

                  const params = {
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    idCliente: cliente.idCliente,
                    codEstab,
                    secuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial),
                    codDoc: $scope.dataSearch.codDoc,
                    tipo: getTipo(),
                    checkBoxDate: $scope.dataSearch.checkBoxDate,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio) || null,
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin) || null,
                  }
                  $scope.documentos = [];
                  guiaRemisionSvc.getDocs(params).then(response => {
                    $scope.documentos = response;
                    $scope.dataSearch.totalRecords = $scope.documentos.length > 0 ? $scope.documentos[0].totalRecords : 0

                    if ($scope.documentos.length === 0) {
                      tS.toastr('info', 'No se encontró los resultados!');
                    }
                  })
                } catch (error) {
                  console.log(error)
                }
              }

              $scope.getDocs();


              $scope.pagechanged = function () {
                $scope.getDocs();
              };

              $scope.changePageSize = function () {
                $scope.dataSearch.pageIndex = 1;
                $scope.getDocs();
              };

              $scope.onChangeTipoDoc = function () {
                console.log($scope.dataSearch.codDoc)
              }
              $scope.selectedDoc = function (item) {
                $uibModalInstance.close({ data: item, codDoc: $scope.dataSearch.codDoc });
              }

              $scope.openModalPreview = async function (item) {
                try {
                  let codDoc = null, keyTemplate;
                  if ($scope.dataSearch.codDoc === "FE") {
                    codDoc = DOC_TYPE.FV_SRI;
                    keyTemplate = 'FV_SRI'
                  }
                  if ($scope.dataSearch.codDoc === "NE") {
                    codDoc = DOC_TYPE.NE;
                    keyTemplate = 'NE'
                  }
                  if ($scope.dataSearch.codDoc === DOC_TYPE.APROB_DOC) {
                    tS.toastr('warning', 'No disponible')
                    return
                  }
                  let { fileCtrl, controller, templates } = nombreModalVenta.DOC_VENTA_DETALLE;
                  let ctrl = (await import(fileCtrl))[controller];
                  let template = templates[keyTemplate];
                  modalSvc.openModalCustom({
                    controller: ctrl,
                    template: template,
                    size: 'xl',
                    params: {
                      codDoc,
                      id: item.idDocumento
                    },
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                  })
                } catch (error) {
                  console.log(error)
                }
              }

              $scope.closeModal = function () {
                $uibModalInstance.close();
              }
            }],
          template: `${URL_TEMPLATE}_ModalDocs.cshtml`,
          size: 'lg',
          params: {
            cliente: $scope.cliente,
            codEstab: $scope.data.codEstab,
            tiposDoc
          },
          isRenderRazorPartial: true
        })

        modalRef.result.then(result => {
          if (result !== null && typeof result === 'object') {
            setDataDocReferenciado(result)
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
    function setDataDocReferenciado(result) {
      let { data, codDoc } = result;
      if (codDoc === DOC_TYPE.FE) {
        $scope.data.idFactura = data.idDocumento;
      }

      if (codDoc === DOC_TYPE.NE) {
        $scope.data.idNotaEntrega = data.idDocumento;
      }
      if (codDoc === DOC_TYPE.APROB_DOC) {
        $scope.data.idAprob_Document = data.idDocumento;
      }


      if (codDoc === DOC_TYPE.FE) {
        $scope.dataDocumentoReferenciado = {
          idDocumento: data.idDocumento,
          serieComprobante: data.serieComprobante,
          labelName: `Factura: ${data.serieComprobante}`

        };
      } else {
        $scope.infoAdicionalDocumento = $scope.infoAdicionalDocumento.filter(item => item.valor !== data.serieComprobante);

        $scope.infoAdicionalDocumento.push({
          nombre: `${data.nameDoc}`,
          valor: data.serieComprobante
        })
        $scope.dataDocumentoReferenciado = {
          serieComprobante: data.serieComprobante,
          labelName: `${data.nameDoc}: ${data.serieComprobante}`
        }
        tS.toastr('info', 'Recuerde que si el documento de referencia es distinto a la factura, el número de comprobante se agrega en los datos adicionales.', '', 6000, 2000)
      }
      $scope.gridOptionsDetalle.data = data.detalles;
      focusColumnCantidad();
      enumGridOptions();
      tS.toastr('success', 'Agregado correctamente!');
    }

    //=====================================END SEARCH DOCS ============================

    //==========================Detalle==========================

    function addRow() {
      const newRow = {
        n: 0,
        idGuiaRemisionDetalle: 0,
        idArticulo: 0,
        codigo: null,
        descripcion: null,
        llevaInventario: false,
        cantidad: 1,
        estado: true
      };
      $scope.gridOptionsDetalle.data.push(newRow);
      return newRow;
    }

    $scope.setItemArticuloEnDetalle = function (item) {
        const { articulo } = item;

        // Always add a new row for the selected articulo (do not sum quantities)
        const entity = addRow();

        entity.idArticulo = articulo.idArticulo;
        entity.codigo = articulo.codigoArticulo;
        entity.descripcion = articulo.descripcion;
        entity.llevaInventario = articulo.llevaInventario;

        enumGridOptions();
        focusColumnCantidad();
    }



    function enumGridOptions() {
      let index = 1;
      for (let item of $scope.gridOptionsDetalle.data) {
        item.n = index++;
      }
    }


    function focusColumnCantidad() {
      let index = $scope.gridOptionsDetalle.columnDefs.findIndex(item => item.field === 'cantidad')
      $scope.gridApi.cellNav.scrollToFocus(
        $scope.gridOptionsDetalle.data[0],
        $scope.gridOptionsDetalle.columnDefs[2]
      )

      $timeout(() => {
        $scope.gridApi.cellNav.scrollToFocus(
          $scope.gridOptionsDetalle.data[$scope.indexRowDetalle],
          $scope.gridOptionsDetalle.columnDefs[index]
        );
        $scope.indexRowDetalle = null;
      }, 30)
    }


    function setFocusArticulo() {
      setTimeout(function () {
        document.querySelector('#custom-template-md-autocomplete-articulo').focus();
      }, 100);
    }


    $scope.openModalArticuloEditar = function (item) {
      $scope.indexRowDetalle = $scope.gridOptionsDetalle.data.indexOf(item);
      $scope.gridApi.cellNav.scrollToFocus(
        $scope.gridOptionsDetalle.data[0],
        $scope.gridOptionsDetalle.columnDefs[2]
      )
      $scope.$broadcast("editArticulo", item)
    }


    $scope.deleteRow = async function (row) {

      let { isConfirmed } = await Swal.fire({
        icon: 'warning',
        html: `<small>¿Desea eliminar el artículo ${row.descripcion}?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false
      })

      if (isConfirmed) {
        let index = $scope.gridOptionsDetalle.data.indexOf(row);
        $scope.gridOptionsDetalle.data.splice(index, 1);
        if (row.idGuiaRemisionDetalle > 0) {
          deletedItems.push({
            ...row,
            estado: false
          })
        }
        enumGridOptions();
        $scope.$apply()
      }
    }



    //Información Adicional del Documento
    $scope.resultModalInfoAdicional = function (infoAdicionalDocumento) {
      $scope.infoAdicionalDocumento = infoAdicionalDocumento
    }


    const isUpdate = () => $scope.data.idGuiaRemision > 0;
    const isRegister = () => !($scope.data.idGuiaRemision > 0)


    $scope.onSave = async function () {
      try {
        if (!fS.isValidField($scope.data.codEstab)) {
          tS.toastr('warning', 'Seleccione el Establecimiento');
          return
        }

        if (!($scope.data.idPuntoEmision > 0)) {
          tS.toastr('warning', 'Seleccione el Pto. Emisión');
          return
        }

        if (!fS.isValidField($scope.data.fechaEmision)) {
          tS.toastr('warning', 'Ingrese la Fecha de Emisión');
          return
        }

        if (!(fS.isDateValid($scope.data.fechaEmision))) {
          tS.toastr('warning', 'Ingrese la Fecha de emisión');
          return
        }

        if (fS.validateDateIsAfterCurrentDate($scope.data.fechaEmision)) {
          tS.toastr('warning', 'La fecha de emisión del documento no puede ser posterior a la fecha actual.')
          return
        }


        let ajusteFechaEmision = fS.ajustarFechaEmision(isUpdate(), $scope.data.fechaEmision, $scope.data.fechaEmisionDocCreado);

        if (ajusteFechaEmision) {
          $scope.data.fechaEmision = ajusteFechaEmision;
        } else {
          console.log('Error al justar la fecha de Emisión')
          return
        }

        if (!$scope.data.fechaInicio) {
          tS.toastr('warning', 'Ingrese Fecha de Inicio');
          return
        }
        if (!$scope.data.fechaFin) {
          tS.toastr('warning', 'Ingrese Fecha de Fin');
          return
        }


        if (!fS.isValidField($scope.data.ptoPartida)) {
          tS.toastr('warning', 'Ingrese el Punto de Partida');
          return
        }
        if (!fS.isValidField($scope.data.ptoLlegada)) {
          tS.toastr('warning', 'Ingrese el Punto de Llegada');
          return
        }

        if (!fS.isValidField($scope.data.ruta)) {
          tS.toastr('warning', 'Ingrese la Ruta');
          return
        }

        if (!fS.isValidField($scope.data.motivo)) {
          tS.toastr('warning', 'Ingrese el Motivo de Traslado');
          return
        }

        if (!($scope.cliente.idCliente > 0)) {
          tS.toastr('warning', 'Seleccione el Cliente');
          return
        }


        if (!($scope.transportista.idTransportista > 0)) {
          tS.toastr('warning', 'Seleccione el Transportista');
          return
        }
        if (!($scope.vehiculo.idVehiculo > 0)) {
          tS.toastr('warning', 'Seleccione el Vehiculo');
          return
        }



        // if (!$scope.data.estableDestino) {
        //     tS.toastr('warning', 'Ingrese Est. Destino');
        //     return
        // }

        if ($scope.gridOptionsDetalle.data.length === 0) {
          tS.toastr('warning', 'Al menos ingrese un Articulo en el Detalle');
          return
        }
        if ($scope.gridOptionsDetalle.data.some((item) => ["", null, undefined].includes(item.cantidad))) {
          tS.toastr('warning', 'Agregue la cantidades!');
          return
        }

        let nroDocSecuencial = null, html = '', titleModal = '';
        if (isUpdate()) {
          titleModal = 'Actualizar';
          html = `<small>Esta Ud. seguro de Actualizar este Documento</small>?`;
        }

        if (isRegister()) {
          nroDocSecuencial = await guiaRemisionSvc.generateSerieComprobante({
            idPuntoEmision: $scope.data.idPuntoEmision,
          })
          if (!nroDocSecuencial) throw "NO SE GENERÓ CORRECTAMENTE EL NÚMERO SECUENCIAL";

          titleModal = 'Guardar';
          html = `<small>Esta Ud. seguro de registrar este Documento Nro.: ${nroDocSecuencial}</small>?`;
        }

        const swalSave = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger ml-2'
          },
          buttonsStyling: false
        })

        let { isConfirmed } = await swalSave.fire({
          title: `<small>${titleModal} Guía de Remisión</small>`,
          html,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si!',
          cancelButtonText: 'No!',
          reverseButtons: false,
          allowOutsideClick: false,
          allowEscapeKey: false
        })

        if (isConfirmed) {
          save();
        }
      } catch (error) {
        console.log(error)
      }
    }

    function save() {

      let data = {
        ...$scope.data,
        idCliente: $scope.cliente.idCliente,
        idTransportista: $scope.transportista.idTransportista,
        idVehiculo: $scope.vehiculo.idVehiculo,
        idEmpleado: $scope.empleado.idEmpleado,
        idDocumento: $scope.dataDocumentoReferenciado.idDocumento
      }

      let params = {
        data: structuredClone(data),
        detalles: structuredClone($scope.gridOptionsDetalle.data),
        infoAdicionalDocumento: $scope.infoAdicionalDocumento,
        docReferenciado: $scope.dataDocumentoReferenciado,
        deletedItems
      }
      let dataMapper = guiaRemisionSvc.mapperTo(params)


      if (isUpdate()) {
        $scope.isLoading = true;
        guiaRemisionSvc.put($scope.data.idGuiaRemision, dataMapper)
          .then($scope.successResponse)
          .catch(error => {
            $scope.isLoading = false;
            console.log(error);
          }).finally(() => {
            $scope.isLoading = false;
          })
      }

      if (isRegister()) {
        $scope.isLoading = true;
        guiaRemisionSvc.post(dataMapper)
          .then($scope.successResponse)
          .catch(error => {
            $scope.isLoading = false;
            console.log(error);
          }).finally(() => {
            $scope.isLoading = false;
          })
      }
    }

    $scope.successResponse = function (response) {
      $scope.isLoading = false;
      if (response.code === '0') {
        fS.sweetAlert('warning', response.message)
      }
      if (response.code === '1') {
        fS.sweetAlert('success', response.message, '', 1000)
        $uibModalInstance.close(response)
      }
    }


    $scope.closeModal = function () {
      $uibModalInstance.close();
    }
  }


})(window.angular)
