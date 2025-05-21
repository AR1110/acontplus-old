USE Acontplus

INSERT INTO Config.SolicitudAutorizacion (
    IdUsuarioRolSolicitante, IdUsuarioRolAprobante, IdEntidad, obs, CodigoModulo, IdDocumentoRef,
    CodigoAccion, CodigoEstado, FechaRegistro, FechaRespuesta, RowGuid, AdminRolesJson, infoExtraJson, userRoleIdLogged
)
SELECT 
    idUsuarioRolSolicitante, idUsuarioRolAprobante, idEntidad, observacion, codDoc,idDocumento,
    codigoAccion, codEstado, fechaRegistro, fechaAprobacion, rowguid, '[' + CAST(idUsuarioRolAprobante AS VARCHAR) + ']',
   -- Construcción manual del JSON con CONCAT
    CONCAT(
        '{',
        '"nombreModulo": "', tipoDoc, '",',
        '"serieComprobante": "',  serieComprobante, '",',
		'"codEstab": "',  codEstab, '"',
        '}'
    ),
    idUsuarioRolSolicitante
FROM Config.v_User_Request

SELECT   * FROM Config.vw_Solicitud_Autorizacion
SELECT * FROM Config.Solicitud
