(function () {
    'use strict'; 

    app.controller('retencionAtsCtrl', retencionAtsCtrl);

    retencionAtsCtrl.$inject = [
        '$scope',
        '$injector', 
    ]

    function retencionAtsCtrl($scope, $injector) {
        const mS = $injector.get('mainService') 
        const modalSvc = $injector.get('modalService');
        const nombreModalFactElect = $injector.get('nombreModalFactElect');
       

        mS.detectDevice()
        /**Initial Load */ 

        $scope.openModal = async function () {
            try {
                let { fileCtrl, controller, template } = nombreModalFactElect.RETENCION_ATS;
                let ctrl = (await import(fileCtrl))[controller];

                modalSvc.openModalCustom({
                    controller: ctrl,
                    template,
                    size: 'xl',
                    params: {},
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                }).result.then(result => {

                })
            } catch (error) {
                console.log(error)
            }
        }


      
    }
})(window.angular);
