import app from '@src/app';
app.factory("tokenService", tokenService)

tokenService.$inject = [
    "$localStorage",
    "jwtHelper"
]
function tokenService($localStorage, jwtHelper) {

    return {
        getToken,
        getDecodedJwt
    };

    function getToken({ decoded = false }) {
        let authData = $localStorage.currentUser;
        if (authData) {
            if (decoded) {
                return (decodedJwt = jwtHelper.decodeToken(authData.token));
            } else {
                return authData;
            }
        }
    }

    function getDecodedJwt() {
        let authData = $localStorage.currentUser;
        let decodedJwt = {};
        if (authData) {
            decodedJwt = jwtHelper.decodeToken(authData.token);
        }
        return decodedJwt;
    }

 }