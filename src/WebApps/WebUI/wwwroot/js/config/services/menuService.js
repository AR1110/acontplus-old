(function () {

    'use strict';
    app.factory('menuService', function ($injector) {
        const mS = $injector.get('mainService');
        const URL = 'Config/Menu/'; 
        const URL_SUBMENU = 'Config/SubMenu/'; 

        const service = {};

        service.get = function (query) {
            return mS.getData('get', URL + '?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let menus = JSON.parse(response.payload) || [];                    
                    return menus[0];
                }
            })
        }

        service.save = function (data) {
            return mS.getData('post', `${URL}?json=${JSON.stringify(data)}`, null, true);
        }

        service.update = function (id, data) {
            return mS.getData('put', `${URL}${id}?json=${JSON.stringify(data)}`, null, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', URL + id, null, true);
        }

        //SubMenu 
        service.findByIdMenu = function(idMenu){
            return mS.getData('get', URL_SUBMENU + 'FindByIdMenu/' + idMenu, null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let subMenus = JSON.parse(response.payload) || [];                    
                    return subMenus
                }
            })
        }

        service.saveSubMenu = function (data) {
            return mS.getData('post', `${URL_SUBMENU}?json=${JSON.stringify(data)}`, null, true);
        }

        service.updateSubMenu = function (id, data) {
            return mS.getData('put', `${URL_SUBMENU}${id}?json=${JSON.stringify(data)}`, null, true);
        }

        service.deleteSubMenu = function (id) {
            return mS.getData('delete', URL_SUBMENU + id, null, true);
        }



         

        return service;
    })
})(window.angular)