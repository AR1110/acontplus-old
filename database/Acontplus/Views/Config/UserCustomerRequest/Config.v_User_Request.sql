USE Acontplus
GO
CREATE OR ALTER VIEW Config.v_User_Request
AS(
    SELECT  
        rowguid
        ,rucEmpresa = e.ruc
        ,razonSocial = e.razonSocial
        ,s_e.codEstab 
        ,establecimiento = s_e.nombreComercial
        ,s.idSolicitud
	    ,s.idUsuarioRolAprobante
	    ,s.idUsuarioRolSolicitante 
        ,u_aprob.nombreCompleto AS usuarioAprobante
        ,u_soli.nombreCompleto AS usuarioSolicitante
        ,s.codigoAccion
        ,accionDescripcion = CASE s.codigoAccion 
                                WHEN 'E' THEN 'EDITAR'
                                WHEN 'A' THEN 'ANULAR' 
                             END
        ,s.codEstado
        ,estadoDescripcion = CASE s.codEstado 
                                WHEN 'P' THEN 'PENDIENTE'
                                WHEN 'A' THEN 'APROBADA'
                                WHEN 'R' THEN 'RECHAZADO'
                                WHEN 'F' THEN 'FINALIZADO'
                            END
        ,s.observacion
        ,s.fechaRegistro  
        ,s.fechaAprobacion  
        ,idDocumento = ISNULL(idDocumento, 0)
        ,codDoc = ISNULL(codDoc,  null)
        ,tipoDoc = ISNULL(tipoDoc,  null)
        ,serieComprobante = ISNULL(serieComprobante, null)
    FROM 
        Config.Solicitud s 
        OUTER APPLY OPENJSON (s.jsonData)
    WITH(
        idDocumento INT '$.idDocumento'
        ,codDoc VARCHAR(10) '$.codDoc' 
        ,tipoDoc VARCHAR(100) '$.tipoDoc' 
        ,serieComprobante VARCHAR(100) '$.serieComprobante' 
        ,codEstab VARCHAR(150) 
    ) AS jsonData
        INNER JOIN dbo.Entidad e WITH(NOLOCK) ON e.idEntidad = s.idEntidad
        INNER JOIN App.UsuarioRol ura WITH(NOLOCK) ON ura.idUsuarioRol = s.idUsuarioRolAprobante
        INNER JOIN Usuario u_aprob WITH(NOLOCK) ON u_aprob.idUsuario = ura.idUsuario
        --Datos Solicitante
        INNER JOIN App.UsuarioRol urs WITH(NOLOCK) ON urs.idUsuarioRol = s.idUsuarioRolSolicitante
        INNER JOIN Usuario u_soli WITH(NOLOCK) ON u_soli.idUsuario = urs.idUsuario
        LEFT JOIN Sri.Establecimiento s_e WITH(NOLOCK) ON s_e.codEstab = jsonData.codEstab 

    
)
 