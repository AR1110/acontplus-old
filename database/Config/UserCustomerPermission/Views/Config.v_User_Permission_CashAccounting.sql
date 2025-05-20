USE Acontplus
GO 

CREATE OR ALTER VIEW Config.v_User_Permission_CashAccounting
AS(
    SELECT  
	    idUserPermission
	    ,idUsuarioRol
	    ,codModule
        ,verOtrasCajas = CAST(ISNULL( verOtrasCajas, 0) AS BIT)
        ,reporteMovimiento = CAST(ISNULL(reporteMovimiento , 0) AS BIT)
        ,cerrarCaja = CAST(ISNULL(cerrarCaja , 0) AS BIT)
        ,enterKey = CAST(ISNULL(enterKey , 0) AS BIT)
        ,reporteTransaccionPendiente = CAST(ISNULL(reporteTransaccionPendiente , 0) AS BIT)
        ,reporteDetalleControlCaja = CAST(ISNULL(reporteDetalleControlCaja , 0) AS BIT)
	    ,estado  
    FROM 
        Config.UserPermission up
    CROSS APPLY OPENJSON (up.jsonPermission)
    WITH(
	     verOtrasCajas BIT '$.verOtrasCajas.enabled'  
	    ,reporteMovimiento BIT '$.reporteMovimientoCaja.enabled'  
	    ,cerrarCaja BIT '$.cerrarCaja.enabled'  
	    ,enterKey BIT '$.enterKey.enabled'  
        ,reporteTransaccionPendiente BIT '$.reporteTransaccionPendiente.enabled'
        ,reporteDetalleControlCaja BIT '$.reporteDetalleControlCaja.enabled'
    )
    WHERE 
        up.codModule = 'C'  
)
 