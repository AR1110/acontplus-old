"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidacionCedulaRucService = void 0;
var TipoIdentificacionEnum;
(function (TipoIdentificacionEnum) {
    TipoIdentificacionEnum[TipoIdentificacionEnum["CEDULA"] = 0] = "CEDULA";
    TipoIdentificacionEnum[TipoIdentificacionEnum["RUC_PERSONA_NATURAL"] = 1] = "RUC_PERSONA_NATURAL";
    TipoIdentificacionEnum[TipoIdentificacionEnum["RUC_SOCIEDAD_PRIVADA"] = 2] = "RUC_SOCIEDAD_PRIVADA";
    TipoIdentificacionEnum[TipoIdentificacionEnum["RUC_SOCIEDAD_PUBLICA"] = 3] = "RUC_SOCIEDAD_PUBLICA";
})(TipoIdentificacionEnum || (TipoIdentificacionEnum = {}));
var ValidacionCedulaRucService = /** @class */ (function () {
    function ValidacionCedulaRucService() {
    }
    /**
     * Permite validar cualquier número de identificación, puede ser cédula, ruc
     * de persona natural, ruc de sociedad pública, ruc de sociedad privada
     *
     * @param identificacion
     * @return
     */
    ValidacionCedulaRucService.esIdentificacionValida = function (identificacion) {
        if (this.isNullOrEmpty(identificacion)) {
            return false;
        }
        else {
            var longitud = identificacion.length;
            this.esNumeroIdentificacionValida(identificacion, longitud);
            if (longitud === 10) {
                return this.esCedulaValida(identificacion);
            }
            else if (longitud === 13) {
                var tercerDigito = parseInt(identificacion.substring(2, 3), 10);
                if (0 <= tercerDigito && tercerDigito <= 5) {
                    return this.esRucPersonaNaturalValido(identificacion);
                }
                else if (6 === tercerDigito) {
                    return this.esRucSociedadPublicaValido(identificacion);
                }
                else if (9 === tercerDigito) {
                    return this.esRucSociedadPrivadaValido(identificacion);
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
    };
    /**
     * Permite verificar si un número de cédula es válido o no
     * @param numeroCedula
     * @return
     */
    ValidacionCedulaRucService.esCedulaValida = function (numeroCedula) {
        var esIdentificacionValida = this.validacionesPrevias(numeroCedula, 10, TipoIdentificacionEnum.CEDULA);
        if (esIdentificacionValida) {
            var ultimoDigito = parseInt(numeroCedula.charAt(9), 10);
            return this.algoritmoVerificaIdentificacion(numeroCedula, ultimoDigito, TipoIdentificacionEnum.CEDULA);
        }
        else {
            return false;
        }
    };
    /**
     * Permite verificar si un número de ruc de cualquier tipo es válido o no
     *
     * @param numeroRuc
     * @return
     */
    ValidacionCedulaRucService.esRucValido = function (numeroRuc) {
        return (this.esRucPersonaNaturalValido(numeroRuc) ||
            this.esRucSociedadPrivadaValido(numeroRuc) ||
            this.esRucSociedadPublicaValido(numeroRuc));
    };
    /**
     * Permite verificar si un número de ruc para personas naturales es válido o no.
     *
     * @param numeroRuc
     * @return
     */
    ValidacionCedulaRucService.esRucPersonaNaturalValido = function (numeroRuc) {
        var esIdentificacionValida = this.validacionesPrevias(numeroRuc, 13, TipoIdentificacionEnum.RUC_PERSONA_NATURAL);
        if (esIdentificacionValida) {
            var ultimoDigito = parseInt(numeroRuc.charAt(9), 10);
            return this.algoritmoVerificaIdentificacion(numeroRuc, ultimoDigito, TipoIdentificacionEnum.RUC_PERSONA_NATURAL);
        }
        else {
            return false;
        }
    };
    /**
     * Permite verificar si un número de ruc para sociedades privadas es válido o no.
     *
     * @param numeroRuc
     * @return
     */
    ValidacionCedulaRucService.esRucSociedadPrivadaValido = function (numeroRuc) {
        var esIdentificacionValida = this.validacionesPrevias(numeroRuc, 13, TipoIdentificacionEnum.RUC_SOCIEDAD_PRIVADA);
        if (esIdentificacionValida) {
            var ultimoDigito = parseInt(numeroRuc.charAt(9), 10);
            return this.algoritmoVerificaIdentificacion(numeroRuc, ultimoDigito, TipoIdentificacionEnum.RUC_SOCIEDAD_PRIVADA);
        }
        else {
            return false;
        }
    };
    /**
     * Permite verificar si un número de ruc para sociedades públicas es válido o no.
     *
     * @param numeroRuc
     * @return
     */
    ValidacionCedulaRucService.esRucSociedadPublicaValido = function (numeroRuc) {
        var esIdentificacionValida = this.validacionesPrevias(numeroRuc, 13, TipoIdentificacionEnum.RUC_SOCIEDAD_PUBLICA);
        if (esIdentificacionValida) {
            var ultimoDigito = parseInt(numeroRuc.charAt(8), 10);
            return this.algoritmoVerificaIdentificacion(numeroRuc, ultimoDigito, TipoIdentificacionEnum.RUC_SOCIEDAD_PUBLICA);
        }
        else {
            return false;
        }
    };
    /**
     * VALIDACIONES PREVIAS AL ALGORITMO DE IDENTIFICACIÓN PARA CÉDULA Y RUC
     * @param contenido
     */
    ValidacionCedulaRucService.isNullOrEmpty = function (contenido) {
        return undefined === contenido || null === contenido || '' === contenido;
    };
    /**
     * @param identificacion
     * @param longitud
     * @param tipoIdentificacion
     * @param validarEstablecimiento
     */
    ValidacionCedulaRucService.validacionesPrevias = function (identificacion, longitud, tipoIdentificacion) {
        if (TipoIdentificacionEnum.CEDULA === tipoIdentificacion) {
            return (this.esNumeroIdentificacionValida(identificacion, longitud) &&
                this.esCodigoProvinciaValido(identificacion) &&
                this.esTercerDigitoValido(identificacion, tipoIdentificacion));
        }
        else {
            return (this.esNumeroIdentificacionValida(identificacion, longitud) &&
                this.esCodigoProvinciaValido(identificacion) &&
                this.esTercerDigitoValido(identificacion, tipoIdentificacion) &&
                this.esCodigoEstablecimientoValido(identificacion));
        }
    };
    /**
     * @param numeroIdentificacion
     * @param longitud
     */
    ValidacionCedulaRucService.esNumeroIdentificacionValida = function (numeroIdentificacion, longitud) {
        return (numeroIdentificacion.length === longitud &&
            /^\d+$/.test(numeroIdentificacion));
    };
    /**
     * @param numeroCedula
     */
    ValidacionCedulaRucService.esCodigoProvinciaValido = function (numeroCedula) {
        var numeroProvincia = parseInt(numeroCedula.substring(0, 2), 10);
        return numeroProvincia > 0 && numeroProvincia <= 24;
    };
    /**
     * @param numeroRuc
     * @return
     */
    ValidacionCedulaRucService.esCodigoEstablecimientoValido = function (numeroRuc) {
        var ultimosTresDigitos = parseInt(numeroRuc.substring(10, 13), 10);
        return !(ultimosTresDigitos < 1);
    };
    /**
     * Tercer dígito:
     * <p>
     * RUC jurídicos y extranjeros sin cédula: 9
     * <p>
     * RUC públicos: 6
     * <p>
     * RUC natural menor a 6: (0,1,2,3,4,5)
     *
     * @param numeroCedula
     * @param tipoIdentificacion
     *            de documento cedula, ruc
     * @return
     */
    ValidacionCedulaRucService.esTercerDigitoValido = function (numeroCedula, tipoIdentificacion) {
        var tercerDigito = parseInt(numeroCedula.substring(2, 3), 10);
        if (tipoIdentificacion === TipoIdentificacionEnum.CEDULA) {
            return this.esTercerDigitoCedulaValido(tercerDigito);
        }
        if (tipoIdentificacion === TipoIdentificacionEnum.RUC_PERSONA_NATURAL) {
            return this.verificarTercerDigitoRucNatural(tercerDigito);
        }
        if (tipoIdentificacion === TipoIdentificacionEnum.RUC_SOCIEDAD_PUBLICA) {
            return this.verificarTercerDigitoRucPublica(tercerDigito);
        }
        if (tipoIdentificacion === TipoIdentificacionEnum.RUC_SOCIEDAD_PRIVADA) {
            return this.verificarTercerDigitoRucPrivada(tercerDigito);
        }
        return false;
    };
    /**
     * @param tercerDigito
     * @return
     */
    ValidacionCedulaRucService.esTercerDigitoCedulaValido = function (tercerDigito) {
        return !isNaN(tercerDigito) && !(tercerDigito < 0 && tercerDigito > 5);
    };
    /**
     * @param tercerDigito
     * @return
     */
    ValidacionCedulaRucService.verificarTercerDigitoRucNatural = function (tercerDigito) {
        return tercerDigito >= 0 || tercerDigito <= 5;
    };
    /**
     * @param tercerDigito
     * @return
     */
    ValidacionCedulaRucService.verificarTercerDigitoRucPrivada = function (tercerDigito) {
        return tercerDigito === 9;
    };
    /**
     * @param tercerDigito
     * @return
     */
    ValidacionCedulaRucService.verificarTercerDigitoRucPublica = function (tercerDigito) {
        return tercerDigito === 6;
    };
    /**
     * ALGORITMO DE VALIDACION DE IDENTIFICACION
     */
    /**
     * @param numeroIdentificacion
     * @param ultimoDigito
     * @param tipoIdentificacion
     * @return
     */
    ValidacionCedulaRucService.algoritmoVerificaIdentificacion = function (numeroIdentificacion, ultimoDigito, tipoIdentificacion) {
        var sumatoria = this.sumarDigitosIdentificacion(numeroIdentificacion, tipoIdentificacion);
        var digitoVerificador = this.obtenerDigitoVerificador(sumatoria, tipoIdentificacion);
        return ultimoDigito === digitoVerificador;
    };
    /**
     * @param numeroIdentificacion
     * @param tipoIdentificacion
     * @return
     */
    ValidacionCedulaRucService.sumarDigitosIdentificacion = function (numeroIdentificacion, tipoIdentificacion) {
        var coeficientes = this.obtenerCoeficientes(tipoIdentificacion);
        var identificacion = numeroIdentificacion.split('');
        var sumatoriaCocienteIdentificacion = 0;
        for (var posicion = 0; posicion < coeficientes.length; posicion++) {
            var resultado = parseInt(identificacion[posicion], 10) * coeficientes[posicion];
            var sumatoria = this.sumatoriaMultiplicacion(resultado, tipoIdentificacion);
            sumatoriaCocienteIdentificacion =
                sumatoriaCocienteIdentificacion + sumatoria;
        }
        return sumatoriaCocienteIdentificacion;
    };
    /**
     * @param multiplicacionValores
     * @param tipoIdentificacion
     * @return
     */
    ValidacionCedulaRucService.sumatoriaMultiplicacion = function (multiplicacionValores, tipoIdentificacion) {
        if (tipoIdentificacion === TipoIdentificacionEnum.CEDULA) {
            return multiplicacionValores >= 10
                ? multiplicacionValores - 9
                : multiplicacionValores;
        }
        else if (tipoIdentificacion === TipoIdentificacionEnum.RUC_PERSONA_NATURAL) {
            var identificacion = String(multiplicacionValores).split('');
            var sumatoria = 0;
            for (var posicion = 0; posicion < identificacion.length; posicion++) {
                sumatoria = sumatoria + parseInt(identificacion[posicion], 10);
            }
            return sumatoria;
        }
        else {
            return multiplicacionValores;
        }
    };
    /**
     * @param tipoIdentificacion
     * @return
     */
    ValidacionCedulaRucService.obtenerCoeficientes = function (tipoIdentificacion) {
        if (tipoIdentificacion === TipoIdentificacionEnum.CEDULA ||
            tipoIdentificacion === TipoIdentificacionEnum.RUC_PERSONA_NATURAL) {
            return [2, 1, 2, 1, 2, 1, 2, 1, 2];
        }
        else if (tipoIdentificacion === TipoIdentificacionEnum.RUC_SOCIEDAD_PRIVADA) {
            return [4, 3, 2, 7, 6, 5, 4, 3, 2];
        }
        else if (tipoIdentificacion === TipoIdentificacionEnum.RUC_SOCIEDAD_PUBLICA) {
            return [3, 2, 7, 6, 5, 4, 3, 2];
        }
        else {
            return null;
        }
    };
    /**
     * @param sumatoria
     * @param tipoIdentificacion
     * @return
     */
    ValidacionCedulaRucService.obtenerDigitoVerificador = function (sumatoria, tipoIdentificacion) {
        var residuo = 0;
        if (tipoIdentificacion === TipoIdentificacionEnum.CEDULA ||
            tipoIdentificacion === TipoIdentificacionEnum.RUC_PERSONA_NATURAL) {
            residuo = sumatoria % 10;
            return residuo === 0 ? 0 : 10 - residuo;
        }
        else if (tipoIdentificacion === TipoIdentificacionEnum.RUC_SOCIEDAD_PUBLICA ||
            tipoIdentificacion === TipoIdentificacionEnum.RUC_SOCIEDAD_PRIVADA) {
            residuo = sumatoria % 11;
            return residuo === 0 ? 0 : 11 - residuo;
        }
        else {
            return null;
        }
    };
    return ValidacionCedulaRucService;
}());
exports.ValidacionCedulaRucService = ValidacionCedulaRucService;
