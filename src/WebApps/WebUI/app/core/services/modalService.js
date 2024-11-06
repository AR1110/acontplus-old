import app from '@src/app'; 
app.factory("modalService", modalService);
modalService.$inject = ["$uibModal", "$mdDialog"];

function modalService($uibModal, $mdDialog) {
    return {

        /**
         *
         * @param {object} params {controller, template, size, params, keyboard=false, animation = true, windowClass = null, scope, props = {}}
         * @returns object
         */
        openModalCustom: function ({
            controller,
            template,
            component,
            size,
            params,
            keyboard = false,
            animation = true,
            windowClass = null,
            windowTopClass,
            openedClass,
            scope,
            props = {}, 
        }) {
            let templateUrl = ""; 
            
            templateUrl = `/Home/Index?name=${template}`; 

            return $uibModal.open({
                animation,
                templateUrl,
                controller,
                controllerAs: "$ctrl",
                component,
                scope,
                size,
                windowClass,
                backdrop: "static",
                scrollable: true,
                keyboard,
                width: props.width,
                height: props.height,
                maxWidth: props.maxWidth,
                maxHeight: props.maxHeight,
                minWidth: props.minWidth,
                minHeight: props.minHeight,
                windowTopClass,
                openedClass,
                resolve: {
                    params: function () {
                        return params;
                    },
                },
            });
        },
        open: function ({
            controller,
            template,
            component,
            size,
            params,
            keyboard = false,
            animation = true,
            windowClass = null,
            windowTopClass,
            openedClass,
            scope,
            props = {},
        }) {
            let templateUrl = "";

            templateUrl = `/Home/Index?name=${template}`;

            return $uibModal.open({
                animation,
                templateUrl,
                controller,
                controllerAs: "$ctrl",
                component,
                scope,
                size,
                windowClass,
                backdrop: "static",
                scrollable: true,
                keyboard,
                width: props.width,
                height: props.height,
                maxWidth: props.maxWidth,
                maxHeight: props.maxHeight,
                minWidth: props.minWidth,
                minHeight: props.minHeight,
                windowTopClass,
                openedClass,
                resolve: {
                    params: function () {
                        return params;
                    },
                },
            });
        },
        openWithComponent: function ({ component, params, size, windowClass }){
            return $uibModal.open({
                animation: true,
                component,
                size,
                windowClass,
                backdrop: "static",
                resolve: {
                    params: function () {
                        return params;
                    },
                },
            })
        }
    };
}