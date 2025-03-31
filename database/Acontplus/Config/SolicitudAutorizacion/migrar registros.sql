USE Acontplus

INSERT INTO Config.SolicitudAutorizacion (
    IdUsuarioRolSolicitante, IdUsuarioRolAprobante, IdEntidad, obs, CodigoModulo, IdDocumentoRef,
    CodigoAccion, CodigoEstado, FechaRegistro, FechaRespuesta, RowGuid, infoExtraJson
)
SELECT 
    idUsuarioRolSolicitante, idUsuarioRolAprobante, idEntidad, observacion, codDoc,idDocumento,
    codigoAccion, codEstado, fechaRegistro, fechaAprobacion, rowguid,  
   -- Construcción manual del JSON con CONCAT
    CONCAT(
        '{',
        '"nombreModulo": "', tipoDoc, '",',
        '"serieComprobante": "',  serieComprobante, '",',
		'"codEstab": "',  codEstab, '"',
        '}'
    )
FROM Config.v_User_Request

SELECT   * FROM Config.vw_SolicitudAutorizacion
SELECT * FROM Config.Solicitud
