USE Acontplus
GO
CREATE OR ALTER VIEW Config.v_User_Permission_Sale 
AS(
    SELECT  
	    idUserPermission
	    ,idUsuarioRol
	    ,codModule
        ,(
            SELECT fechaEmision        = CAST(ISNULL(JSON_VALUE(comprobante, '$.fechaEmision.enabled'), 0) AS BIT),
                   tiempoCredito       = CAST(ISNULL(JSON_VALUE(comprobante, '$.tiempoCredito.enabled'),0) AS BIT),
                   tarifa              = CAST(ISNULL(JSON_VALUE(comprobante, '$.tarifa.enabled'),0) AS BIT),
                   porcentajeDescuento = CAST(ISNULL(JSON_VALUE(comprobante, '$.porcentajeDescuento.enabled'),0) AS BIT),
                   descuento           = CAST(ISNULL(JSON_VALUE(comprobante, '$.descuento.enabled'),0) AS BIT)
		    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ) AS comprobante,
        (
            SELECT medida = CAST(ISNULL(JSON_VALUE(detalle, '$.medida.enabled'), 0) AS BIT),
                   tipoIva = CAST(ISNULL(JSON_VALUE(detalle, '$.tipoIva.enabled'), 0) AS BIT),
                   tarifa  =CAST(ISNULL(JSON_VALUE(detalle, '$.tarifa.enabled'), 0) AS BIT),
                   precioUnitario  =CAST(ISNULL(JSON_VALUE(detalle, '$.precioUnitario.enabled'), 0) AS BIT),
                   precioConIva  =CAST(ISNULL(JSON_VALUE(detalle, '$.precioConIva.enabled'), 0) AS BIT),
                   porcentajeDescuento  =CAST(ISNULL(JSON_VALUE(detalle, '$.porcentajeDescuento.enabled'), 0) AS BIT),
                   descuento  =CAST(ISNULL(JSON_VALUE(detalle, '$.descuento.enabled'), 0) AS BIT)
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ) AS detalle,
        (
            SELECT keyRequest = CAST(ISNULL(keyRequest, 0) AS BIT),
                   usersAdmin,
                   viewOthersDocs  =CAST(ISNULL(viewOthersDocs, 0) AS BIT),
                   kardex  =CAST(ISNULL(JSON_VALUE(additional, '$.kardex.enabled'), 0) AS BIT),
                   totalesVenta  =CAST(ISNULL(JSON_VALUE(additional, '$.totalesVenta.enabled'), 0) AS BIT) 
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ) AS adicionales
         ,viewOthersDocs  =CAST(ISNULL(viewOthersDocs, 0) AS BIT)
         ,usersAdmin 
         ,keyRequest
	    ,estado  
    FROM 
        Config.UserPermission up
    CROSS APPLY OPENJSON (up.permission)
    WITH(
	    comprobante NVARCHAR(MAX) '$.comprobante' AS JSON
	    ,detalle NVARCHAR(MAX) '$.detail' AS JSON 
	    ,additional NVARCHAR(MAX) '$.additional' AS JSON 
        ,viewOthersDocs BIT '$.additional.viewOthersDocs.enabled'
        ,keyRequest BIT '$.additional.keyRequest.enabled' 
        ,usersAdmin NVARCHAR(MAX)  '$.additional.keyRequest.usersAdmin' as json
    )
    WHERE 
        up.codModule = 'V'   
)
-- SELECT * FROM Config.v_User_Permission_Sale  WHERE idUsuarioRol = 264