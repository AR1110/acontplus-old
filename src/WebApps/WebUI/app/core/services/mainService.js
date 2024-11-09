 
import app from '@src/app'; 
app.factory("mainService", mainService);

mainService.$inject = [
    "$http",
    "$timeout", 
    "Upload",
    "screenSize",
     "tokenService"
];

function mainService($http,$timeout, Upload,  _screenSize, tokenSvc,) {
    let service = {};
    let urlGateway = tokenSvc.getDecodedJwt().urlGateway;
    let token = tokenSvc.getToken({ decoded: false }).token;
 
    function _getData(
        method,
        url,
        data = null,
        forApi = false,
        externalApi = false,
        noLoader = false
    ) {
 
        if (externalApi) {
            return fetch(url, {
                method: method,
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                return response.json();
            });
        }
        return $http({
            method: method,
            url: urlGateway + "/gateway/" + url,
            data: data,
            noLoader,
        }).then((response) => {
            return response.data;
        });
    }

    function _getDataFile(url, file, data = null, forApi = false) {
        return Upload.upload({
            url: urlGateway + "/gateway/" + url,
            headers: {
                Authorization: token,
            },
            data: {
                file: file,
                data: data,
            },
        }).then((response) => {
            return response.data;
        });
    }

    function _uploadFile({ url, file, data = null }) {
        return Upload.upload({
            url: urlGateway + "/gateway/" + url,
            headers: {
                Authorization:token,
            },
            data: {
                file: file,
                data: data,
            },
        }).then((response) => {
            return response.data;
        });
    }

    function _getFile(method, url, data = null, forApi = false) {
        return $http({
            method,
            url: `${urlGateway}/gateway/${url}`,
            data,
            responseType: "blob",
        }).then((response) => response);
    }

    function _detectDevice () {
        let isMobile = _screenSize.on("xs, sm", (isMatch) => {
            isMobile = isMatch;
        });
        if (isMobile) {
            Swal.fire(
                "Dispositivo Móvil Detectado!",
                "Para una mejor comodidad, le recomendamos usar una Laptop o PC.",
                "success",
            );
        } else {
            $timeout(() => {
                document.getElementById("menu_toggle").click();
            }, 1100);
        }
    };

    function _print(method, url, data = null) {
        return $http({
            method: method,
            url: url,
            data: data
        }).then((response) => {
            return response.data;
        });
    }

    service.getData = _getData;
    service.getDataFile = _getDataFile;
    service.uploadFile = _uploadFile;
    service.getFile = _getFile;
    service.detectDevice = _detectDevice;
    service.print = _print;
    return service;
}