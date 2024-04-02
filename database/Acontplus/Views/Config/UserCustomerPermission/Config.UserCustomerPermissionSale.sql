

--CREATE OR ALTER VIEW Config.UserCustomerPermissionSale 
--AS
--SELECT * FROM Config.UserPermission WHERE idUsuarioRol=467
--{"comprobante":  }, }, ,  ,  ,"additional":{"requestAuthorizationKey":{"label":"Solicitar Autorización para Editar o Anular el Doc. Venta","requestKey":false,"usuarioAprobante":null,"idUsuarioRolAprobante":0},"viewOthersDocs":{"label":"Consultar documentos electronicos de otros usuarios","view":true},"kardex":{"label":"Ver Kardex","view":true},"totalesVenta":{"label":"Mostrar totales de ventas ","view":true}}}
SELECT DISTINCT
	idUserPermission
	,idUsuarioRol
	,codModule
    ,(
        SELECT fechaEmision        = CAST(ISNULL(JSON_VALUE(comprobante, '$.fechaEmision.update'), 0) AS BIT),
               tiempoCredito       = CAST(ISNULL(JSON_VALUE(comprobante, '$.tiempoCredito.update'),0) AS BIT),
               tarifa              = CAST(ISNULL(JSON_VALUE(comprobante, '$.tarifa.update'),0) AS BIT),
               porcentajeDescuento = CAST(ISNULL(JSON_VALUE(comprobante, '$.porcentajeDescuento.update'),0) AS BIT),
               descuento           = CAST(ISNULL(JSON_VALUE(comprobante, '$.descuento.update'),0) AS BIT)
		FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    ) AS comprobante,
    (
        SELECT medida = CAST(ISNULL(JSON_VALUE(detalle, '$.medida.update'), 0) AS BIT),
               tipoIva = CAST(ISNULL(JSON_VALUE(detalle, '$.tipoIva.update'), 0) AS BIT),
               tarifa  =CAST(ISNULL(JSON_VALUE(detalle, '$.tarifa.update'), 0) AS BIT),
               precioUnitario  =CAST(ISNULL(JSON_VALUE(detalle, '$.precioUnitario.update'), 0) AS BIT),
               precioConIva  =CAST(ISNULL(JSON_VALUE(detalle, '$.precioConIva.update'), 0) AS BIT),
               porcentajeDescuento  =CAST(ISNULL(JSON_VALUE(detalle, '$.porcentajeDescuento.update'), 0) AS BIT),
               descuento  =CAST(ISNULL(JSON_VALUE(detalle, '$.descuento.update'), 0) AS BIT)
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    ) AS detalle
	,estado 
FROM 
    Config.UserPermission up
CROSS APPLY OPENJSON (up.jsonPermission)
WITH(
	comprobante NVARCHAR(MAX) '$.comprobante' AS JSON
	,detalle NVARCHAR(MAX) '$.detail' AS JSON 
)
WHERE 
    up.codModule = 'V'
 