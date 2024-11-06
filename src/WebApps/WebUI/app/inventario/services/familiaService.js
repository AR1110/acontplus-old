import app from '@src/app';
app.factory('familiaService', familiaService)
    
    familiaService.$inject = ['$injector'];
    function familiaService($injector) {

    let url = 'Inventario/Familia/';
    let mS = $injector.get('mainService');
    let service = {};

    service.getAll = function (query) {
        return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
            if (response.code === "0") {
                throw response;
            }
            if (response.code === "1") {
                let familias = JSON.parse(response.payload) || [];
                return familias.map(item => ({
                    idFamilia: item.idFamilia,
                    descripcion: item.descripcion,
                    siglas: item.siglas,
                    estado: item.estado,
                    totalRecords: item.totalRecords
                }))
            }
        })
    }

    service.save = function (data) {
        return mS.getData('post', url + 'Insert', { data }, true);
    }

    service.update = function (id, data) {
        return mS.getData('put', url + 'Update/' + id, { data }, true);
    }

    service.delete = function (id) {
        return mS.getData('delete', url + 'Delete/' + id, null, true);
    }

    return service;
} 