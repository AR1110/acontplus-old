import app from '@src/app';
app.directive('actionArticuloAddEdit', actionArticuloAddEdit)
actionArticuloAddEdit.$inject = ['modalService'];
function actionArticuloAddEdit(modalSvc) {
    return {
        restrict: 'A',
        scope: {
            params: '=',
            resultModal: '&',
        },
        link: function (scope, element) {
            element.on('click', async function () {

                // const { fileCtrl, controllers, templates } = nombreModalInventario.ARTICULO;
                // let ctrl = (await import(fileCtrl))[controllers['M']];
                // let template = templates['M'];
                // const modalDialogRef = modalService.openModalCustom({
                //     controller: ctrl,
                //     template,
                //     size: 'xl',
                //     params: scope.params || {},
                //     windowClass: 'uibModalFullScreen',
                //     isRenderRazorPartial: true
                // })

                const modalRef = modalSvc.openWithComponent({
                    component: 'articuloAddEditModalComp',
                    size: 'xl',
                    params: scope.params || {},
                     windowClass: 'uibModalFullScreen'
                })

                modalRef.result.then(result => {
                    if (typeof result === "object") {
                        scope.resultModal({
                            result
                        })
                    }
                })
            });
        }
    }
} 