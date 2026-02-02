//@ts-check
(function () {

  'use strict';

  app.controller('documentoElectronicoCtrl', documentoElectronicoCtrl)
  documentoElectronicoCtrl.$inject = [
    '$scope',
    '$injector',
    'proveedorService'
  ]

  function documentoElectronicoCtrl(
    $scope,
    $injector,
    proveedorSvc
  ) {

    let CODE_REPORT = $injector.get('CODE_REPORT');
    let mS = $injector.get('mainService');
    let commonSvc = $injector.get('commonService');
    let docElectSvc = $injector.get('docElectService');
    let modalSvc = $injector.get('modalService');
    let nombreModalConst = $injector.get('nombreModal');
    let fS = $injector.get('formulario');
    let tS = $injector.get('toastService');
    let nombreModalVenta = $injector.get('nombreModalVenta');






    $scope.comprobantes = [];
    $scope.selectedComprobantes = [];

    $scope.establecimientos = [];
    $scope.puntosEmision = [];
    $scope.tempPuntosEmision = [];
    $scope.codEstab_Asig = null;

    $scope.dataCustomerSearch = {

    }

    //DETECT MOBILE DEVICE
    mS.detectDevice()

    //const tipo = document.getElementById("tipo").value


    //Filtro
    $scope.recordsQuantity = [10, 25, 50, 100]
    $scope.dataSearch = {
      order: '',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      checkBoxDate: true,
      pageSize: 50,
      pageIndex: 1,
      maxSize: 5,
      totalRecords: 0,
      codEstado: null,
      codDoc: null
    };

    $scope.dataSearch.isCurrentDate = false;

    $scope.dataSearch.isSearchCustomerProvider = false;

    //Cuando la redieccion es del home - comprobantes error
    let params = new URLSearchParams(document.location.search);
    // Imprime el valor
    $scope.tipo =  params.get("tipo");

    function getComprobantes() {
      try {

        $scope.comprobantes = [];
        let codEstado = $scope.dataSearch.codEstado;
        let checkBoxDate = $scope.dataSearch.checkBoxDate = true;

        if ($scope.dataSearch.nroSecuencial) {
          if (!fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)) {
            tS.toastr('error', 'Define correctamente el número de secuencial o el rango de número secuencial!')
            return
          }

          checkBoxDate = false;
          tS.toastr({
            type: 'info',
            message: 'Buscando por número documento'
          })
        }


        if ($scope.tipo > 0) {
          codEstado = 8;
          checkBoxDate = false;
        }
        let dataSearch = {
          tipo: 1,
          codDoc: $scope.dataSearch.codDoc,
          codEstado,
          checkBoxDate,
          dateStart: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
          dateEnd: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
          codEstab: $scope.dataSearch.codEstab,
          idPuntoEmision: $scope.dataSearch.idPuntoEmision,
          identificacionReceptor: $scope.dataSearch.identificacionReceptor,
          idUsuario: $scope.dataSearch.idUsuario,
          pageIndex: $scope.dataSearch.pageIndex,
          pageSize: $scope.dataSearch.pageSize,
          nroSecuencial: fS.validAndFormatedRangeSequential($scope.dataSearch.nroSecuencial)
        }

        docElectSvc.getAll(dataSearch).then(response => {
          if (!$scope.isMobile) {
            document.getElementById('menu_toggle').click();
          }

          $scope.comprobantes = response;
          $scope.dataSearch.totalRecords = $scope.comprobantes.length > 0 ? $scope.comprobantes[0].totalRecords : 0
        })
          .catch(error => {
            $scope.dataSearch.totalRecords = 0;
            console.log(error)
          })

      } catch (error) {
        console.log(error)
      }
    }

    initiload()
    function initiload() {
      docElectSvc.getDataFilter().then(response => {
        let {
          estabs,
          tiposDoc,
          estadosDoc
        } = response;
        $scope.establecimientos = estabs;
        $scope.tiposDocumento = tiposDoc;
        $scope.tiposDoc = tiposDoc;
        $scope.estadosDoc = estadosDoc;

        if ($scope.establecimientos.length === 0) {
          tS.toastr('warning', 'No tiene establecimientos asignados para gestionar documentos electrónicos.')
          return
        }


        let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));

        if (!dataEstab) {
          dataEstab = $scope.establecimientos[0];
        }
        $scope.puntosEmision = dataEstab.puntosEmision;
        $scope.dataSearch.codEstab = $scope.tipo > 0 ? null : dataEstab.codEstab;

        const dataPuntoEmision = $scope.puntosEmision.length > 0 ? $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)) : null;

        if (dataPuntoEmision) {
          $scope.dataSearch.idPuntoEmision = $scope.tipo > 0 ? null : dataPuntoEmision.idPuntoEmision;
        } else {
          $scope.dataSearch.idPuntoEmision = null;
        }


        getComprobantes();

      })
    }

    const estadosConfig = {
      0: { disabled: false, authorized: false, class: 'table-default' },
      2: { disabled: false, authorized: false, class: '' },
      4: { disabled: true, authorized: true, class: 'table-success' },
      5: { disabled: false, authorized: false, class: 'table-warning' },
      6: { disabled: true, authorized: false, class: 'table-danger' }
    };


    $scope.getClass = function (item) {
      return estadosConfig[item.codEstado] ? estadosConfig[item.codEstado].class : '';
    };


    $scope.refresh = function () {
      getComprobantes()
    }

    $scope.isDisabledRow = function (item) {
      const estado = estadosConfig[item.codEstado];
      if (item.codEstado === 2) return false;

      if (estado) {
        return !estado.authorized;
      }
      return estado ? estado.disabled : false
    }

    function isAuthorized(item) {
      const estado = estadosConfig[item.codEstado];
      return estado ? estado.authorized : false
    }

    $scope.validateRowAction = function (item) {
      return {
        authorized: isAuthorized(item)
      }
    }

    //codEstado 4 autorizado
    $scope.canToCancel = function (item) {
      return isAuthorized(item)
    }

    $scope.canViewError = function (item) {
      return item.codEstado == 5 || item.codEstado == 0;
    }

    function getDocsToAuthorize() {
      return $scope.selectedComprobantes.filter(item => item.codEstado === 2);
    }

    $scope.showButtonAuthorize = function () {
      return getDocsToAuthorize().length > 0

    }

    $scope.showButtonDownloadAllXml = function () {
      return $scope.selectedComprobantes.filter(item => item.codEstado === 4).length > 0
    }

    $scope.downloadAllXml = function () {
      const docs = $scope.selectedComprobantes.filter(item => item.codEstado === 4).map(item => item.idDocumentoElectronico);

      docElectSvc.downloadMultipleXmlsAsZip(docs)
    }

    $scope.resultRangeFilter = function (item) {
      $scope.dataSearch.fechaInicio = item.startDate;
      $scope.dataSearch.fechaFin = item.endDate;
      getComprobantes();
    }

    $scope.onchangeEstablecimiento = () => {
      try {
        let dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);
        $scope.puntosEmision = dataEstab.puntosEmision;

        if ($scope.puntosEmision.length > 0) {
          $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
          getComprobantes();
        } else {
          tS.toastr('warning', 'No tiene puntos de emisión asignados')
        }
      } catch (error) {
        console.log(error);
      }
    }

    $scope.onSelectTipoDoc = () => {
      if ([null, undefined, ""].includes($scope.dataSearch.codDoc)) {
        $scope.dataCustomerSearch.name = null;
        $scope.dataSearch.identificacionReceptor = null;
      }
      getComprobantes();
    }


    $scope.searchCustomerProvider = function (textSearch) {
      try {
        $scope.dataSearch.identificacionReceptor = null;
        $scope.dataSearch.isSearchCustomerProvider = false;


        if (['01', '06', '04'].includes($scope.dataSearch.codDoc)) {
          return commonSvc.clienteSearch(textSearch).then(response => {
            return response.map(item => ({
              idClienteProveedor: item.idCliente,
              nameCustomerProvider: item.nombreFiscal,
              identificacionReceptor: item.numeroIdentificacion
            }))
          })
        } else {
          return proveedorSvc.search(textSearch).then(response => {
            return response.map(item => ({
              idClienteProveedor: item.idProveedor,
              nameCustomerProvider: item.nombreFiscal,
              identificacionReceptor: item.numeroIdentificacion
            }))
          })
        }
      } catch (error) {
        console.log(error);
      }
    }

    $scope.onKeyupCustomerSupplier = function () {

      if (!fS.isValidField($scope.dataCustomerSearch.name)) {
        //   $scope.dataCustomerSearch.name = null;
        $scope.dataSearch.isSearchCustomerProvider = false;
        $scope.dataSearch.identificacionReceptor = null;
      }
    }

    $scope.onSelectedCustomerProvider = function (item) {
      $scope.dataSearch.isSearchCustomerProvider = true;
      $scope.dataSearch.identificacionReceptor = item.identificacionReceptor;
      getComprobantes();
    }

    $scope.clearSearchCustomer = function () {
      $scope.dataCustomerSearch.name = null;
      $scope.dataSearch.identificacionReceptor = null;
      getComprobantes();
    }

    $scope.searchUser = function (textSearch) {
      try {
        let query = {
          busqueda: textSearch,
        }
        return commonSvc.usuarioSearch(query)
      } catch (error) {
        console.log(error);
      }
    }

    $scope.onSelectedUser = function (user) {
      $scope.modelUser = user.nombreCompleto;
      $scope.dataSearch.idUsuario = user.idUsuario;
      getComprobantes();
    }

    $scope.clearUserSearch = function () {
      $scope.modelUser = null;
      $scope.dataSearch.idUsuario = 0;
      getComprobantes();
    }

    $scope.pagechanged = function () {
      getComprobantes();
    }

    $scope.changePageSize = function () {
      $scope.dataSearch.pageIndex = 1;
      getComprobantes();
    }

    $scope.onSelectComprobante = (item) => {

    }
    //=====================================================END FILTER===============================================
    const REPORT_CODES = Object.freeze({
      '01': CODE_REPORT.RF,
      '03': CODE_REPORT.RLC,
      '04': CODE_REPORT.RNC,
      '06': CODE_REPORT.RGR,
      '07': CODE_REPORT.RRC,
    })

    //Get Report
    $scope.getReport = (item) => {
      try {

        if (!(Object.keys(REPORT_CODES).includes(item.codDoc))) {
          tS.toastr('warning', 'No Disponible')
          return
        }

        let format = 'pdf';


        const parameters = {
          dataParams: JSON.stringify({
            versionComp: item.versionComp,
            idDocumentoElectronico: item.idDocumentoElectronico,
            normalMethod: true,
          }),
          reportParams: JSON.stringify({
            codigo: REPORT_CODES[item.codDoc],
            codEstab: item.codEstab,
            format,
          }),
          hasService: true,
        }

        commonSvc.getReport({
          parameters,
          format
        })
      } catch (error) {
        console.log(item);
      }
    }


    $scope.downloadXml = (item) => {
      docElectSvc.downloadXml(item.idDocumentoElectronico)
    }


    $scope.getDetalleDoc = async (item) => {
      try {

        const tipoDoc = $scope.tiposDocumento.find(doc => doc.codDoc === item.codDoc);

        let codigo = '';
        if (tipoDoc.codDoc === "01") {
          loadDetalleInvoice(item.idDocumentoElectronico, tipoDoc.codDoc)
          return
        }
        if (tipoDoc.codDoc === "06") {
          codigo = 'GR'
        }
        commonSvc.viewDetailDocument({
          idDocumentoElectronico: item.idDocumentoElectronico,
          codigoDocumento: codigo,
          size: 'xl',
          windowClass: 'uibModalFullScreen'
        })

      } catch (error) {
        console.error(error)
      }
    }

    async function loadDetalleInvoice(idDocumentoElectronico, codDoc) {
      let { fileCtrl, controller, templates } = nombreModalVenta.DOC_VENTA_DETALLE;
      let ctrl = (await import(fileCtrl))[controller];
      let template = templates['FV_SRI'];
      modalSvc.openModalCustom({
        controller: ctrl,
        template: template,
        size: 'xl',
        params: {
          codDoc,
          idDocumentoElectronico,
        },
        windowClass: 'uibModalFullScreen',
        isRenderRazorPartial: true
      })
    }



    $scope.getAuthorizate = async () => {
      try {

        const docs = getDocsToAuthorize()

        if (docs.length === 0) {
          tS.toastr('warning', 'No hay documentos por autorizar');
          return;
        }

        let { isConfirmed } = await Swal.fire({
          title: '<small>Autorizar</small>',
          icon: 'warning',
          html: `<small>Estás seguro/a de Autorizar <h4><b>${docs.length}</b></h4> comprobantes?</small>`,
          showDenyButton: true,
          confirmButtonText: 'Si, autorizar',
          denyButtonText: 'No, cancelar',
          allowOutsideClick: false
        });

        if (isConfirmed) {
          let updatePromises = docs.map(item =>
            docElectSvc.updateXml(item.idDocumentoElectronico)
          );

          showLoader();

          try {
            const responses = await Promise.all(updatePromises);

            // Filtrar respuestas con código "0"
            const warningResponses = responses.filter(response => response && response.code === "0");

            if (warningResponses.length > 0) {
              // Mostrar advertencias si hay respuestas con código "0"
              const warningMessages = warningResponses.map(response => response.message).join('<br>');

              await Swal.fire({
                icon: 'warning',
                title: '<small>Advertencias</small>',
                html: `<small>${warningMessages}</small>`,
                confirmButtonText: 'Entendido'
              });
            } else {
              // Mostrar mensaje de éxito si no hay advertencias
              await Swal.fire({
                icon: 'success',
                html: `<small>Autorizando...</small>`,
                timer: 1000
              });
            }

            // Vaciar el array selectedComprobantes después de la actualización
            $scope.selectedComprobantes = [];
            $scope.refresh();

          } catch (error) {
            console.error("Error al procesar las respuestas:", error);
            Swal.fire({
              icon: 'error',
              title: '<small>Error</small>',
              html: '<small>Ha ocurrido un error al procesar las solicitudes</small>'
            });
          } finally {
            hideLoader();
          }
        }
      } catch (error) {
        console.error("Error general:", error);
        hideLoader();
        Swal.fire({
          icon: 'error',
          title: '<small>Error</small>',
          html: '<small>Ha ocurrido un error inesperado</small>'
        });
      }
    }


    $scope.getError = async (params) => {
      try {
        const {
          MODAL_COMPROBANTE_ERROR_CTRL,
          MODAL_COMPROBANTE_ERROR_CSHTML
        } = nombreModalConst.common;
        const {
          ComprobanteErrorCtrl
        } = await import('./../../modal/' + MODAL_COMPROBANTE_ERROR_CTRL);

        modalSvc.openModalCustom({
          controller: ComprobanteErrorCtrl,
          template: MODAL_COMPROBANTE_ERROR_CSHTML,
          params,
          size: 'lg',
          keyboard: true
        })
      } catch (error) {
        console.error(error)
      }
    }


    $scope.estadoCorreoComprobantes = () => {
      if (!$scope.comprobantes.some(item => item.codEstado === 4)) return

      //codEstado 4 Autorizadas
      const params = {
        comprobantes: $scope.comprobantes.filter(item => item.codEstado === 4)
      }
      $scope.getStatusSendMail(params);
    }

    $scope.getStatusSendMail = async (item) => {
      try {
        const {
          MODAL_SEND_MAIL_CTRL,
          MODAL_STATUS_MAIL_CSHTML
        } = nombreModalConst.common;
        const {
          StatusEmail
        } = await import(MODAL_SEND_MAIL_CTRL);
        modalSvc.openModalCustom({
          controller: StatusEmail,
          template: MODAL_STATUS_MAIL_CSHTML,
          size: 'xl',
          params: item,
          isRenderRazorPartial: true
        })
      } catch (error) {
        console.log(error)
      }
    }


    $scope.showBtnUpdateXml = (item) => {
      return [2, 0, 5].includes(item.codEstado)
    }

    $scope.updateXml = async (item) => {
      const {
        isConfirmed
      } = await Swal.fire({
        title: '<small>Actualizar XML</small>',
        icon: 'warning',
        html: `<small>Esta seguro de actualizar el Xml de este Comprobante <b>Nro. ${item.serieComprobante}</b></small>`,
        showDenyButton: true,
        confirmButtonText: 'Si, actualizar',
        denyButtonText: 'No, cancelar',
        allowOutsideClick: false
      })

      if (isConfirmed) {
        showLoader();
        docElectSvc.updateXml(item.idDocumentoElectronico).then(response => {
          if ((response)) {
            tS.toastr('success', response.message, response.titleSms);
            $scope.refresh();
          }

        })
          .catch(error => {
            console.log(error)
          })
          .finally(() => hideLoader())

      }
    }


    $scope.updateComprobanteResult = function (result) {
      if (typeof result === 'object') {
        $scope.refresh();
      }
    }

    // $scope.edit = (item) => {
    //     if (item.versionComp == '2.0.0') {
    //         location.href = '/RetencionAts/Index?id=' + item.idDocumentoElectronico
    //     } else {
    //         tS.toastr('warning', 'No disponible')
    //     }
    // }
    $scope.askToCancel = (item) => {
      try {
        if (item.codDoc != '07') {
          tS.toastr('info', 'Aun no disponible')
          return
        }
        Swal.fire({
          title: '¿Está seguro de anular este comprobante?',
          html: `<small>Asegurese de haber dado de baja este comprobante en el portal del SRI</small>`, // "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, anular!',
          cancelButtonText: 'No, cancelar',
          allowOutsideClick: false
        }).then((result) => {
          if (result.value) {
            $scope.cancel(item)
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
    $scope.cancel = (item) => {
      showLoader();
      docElectSvc.retencionAtsCancel(item.idDocumentoElectronico).then(response => {
        if (response.code == '1') {
          tS.toastr('success', response.message)
          $scope.refresh();
        }
        if (response.code == '0') {
          tS.toastr('warning', response.message)
        }
      }).finally(() => hideLoader())
    }


    $scope.refreshReload = () => {
      location.href = '/FactElect/DocumentoElectronico/Index';
    }
  }
})(window.angular)
