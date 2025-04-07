USE Acontplus
GO
CREATE OR ALTER VIEW Config.vw_Solicitud_Autorizacion
AS
SELECT  
    s.id,
    s.rowguid,
    e.ruc AS rucEmpresa,
    e.razonSocial,
    jsonData.codEstab,
    s_e.nombreComercial AS establecimiento,
    s.Id AS idSolicitudAutorizacion,
    s.idUsuarioRolAprobante,
    s.idUsuarioRolSolicitante,
    s.userRoleIdLogged,
    cc_aprob.BusinessName AS usuarioAprobante,
    cc_soli.BusinessName AS usuarioSolicitante,
    s.codigoAccion,
    CASE s.codigoAccion 
        WHEN 'E' THEN 'EDITAR'
        WHEN 'A' THEN 'ANULAR' 
    END AS nombreAccion,
    s.codigoEstado,
    CASE s.codigoEstado 
        WHEN 'P' THEN 'PENDIENTE'
        WHEN 'A' THEN 'APROBADA'
        WHEN 'R' THEN 'RECHAZADO'
        WHEN 'F' THEN 'FINALIZADO'
    END AS nombreEstado,
    s.obs,
    s.fechaRegistro,
    s.FechaRespuesta,
    s.IdDocumentoRef AS idDocumento,
    s.codigoModulo,
    jsonData.nombreModulo,
    jsonData.serieComprobante 

FROM 
    Config.SolicitudAutorizacion s
    OUTER APPLY OPENJSON(s.infoExtraJson)
    WITH( 
        nombreModulo VARCHAR(100) , 
        serieComprobante VARCHAR(100) , 
        codEstab VARCHAR(150) 
    ) AS jsonData
    INNER JOIN dbo.Entidad e WITH(NOLOCK) ON e.idEntidad = s.idEntidad
    --Usuario que aprueba
    LEFT JOIN App.UsuarioRol ura WITH(NOLOCK) ON ura.idUsuarioRol = s.idUsuarioRolAprobante
    LEFT JOIN Usuario u_aprob WITH(NOLOCK) ON u_aprob.idUsuario = ura.idUsuario
    LEFT JOIN Customer.Customer cc_aprob WITH(NOLOCK) ON cc_aprob.Id = u_aprob.customerId
    --Usuario que solicita
    INNER JOIN App.UsuarioRol urs WITH(NOLOCK) ON urs.idUsuarioRol = s.idUsuarioRolSolicitante
    INNER JOIN Usuario u_soli WITH(NOLOCK) ON u_soli.idUsuario = urs.idUsuario
    INNER JOIN Customer.Customer cc_soli WITH(NOLOCK) ON cc_soli.Id = u_soli.customerId
    LEFT JOIN Sri.Establecimiento s_e WITH(NOLOCK) ON s_e.codEstab = jsonData.codEstab;
