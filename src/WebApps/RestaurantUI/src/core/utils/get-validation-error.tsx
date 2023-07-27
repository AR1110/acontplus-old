import { TypeWithKey } from "../models/type-with-key";

export const getValidationError = (errorCode: any) => {
  const codeMatcher: TypeWithKey<string> = {
    ERR_NETWORK: "Network Error",
    ERR_TIMEOUT: 'Se acabó el tiempo',
    ERR_CANCEL: 'Se canceló la petición',
    ERR_UNKNOWN: 'Error desconocido',
    ERR_400: 'Error 400',
    ERR_401: 'Error 401',
    ERR_403: 'Error 403',
    ERR_BAD_REQUEST: "Solicitud fallida con código de estado 400",
    BAD_REQUEST: 'Formato no válido en los datos enviados',
    UNAUTHORIZED: 'Por favor inicie sesión para continuar',
    NOT_AUTHORIZED: 'Por favor inicie sesión para continuar',
    FORBIDDEN: 'No tienes permiso para ejecutar la acción.',
    NOT_FOUND: 'No se encontró la información de la solicitud',
    REQUEST_TIMEOUT: 'La acción solicitada está tomando '    ,
    INTERNAL_ERROR: 'Se produjo un error interno',
    INTERNAL_SERVER_ERROR: 'Ocurrió un error interno del servidor',
    BAD_GATEWAY: 'Ha habido un error, por favor inténtalo de nuevo',
    GATEWAY_TIMEOUT: 'Ha habido un error, por favor inténtalo de nuevo'
  };
  return codeMatcher[errorCode];
};
