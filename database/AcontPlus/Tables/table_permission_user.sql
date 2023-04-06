
USE AcontPlus;

DECLARE @table AS TABLE (
	 id INT IDENTITY (1,1) NOT NULL UNIQUE
	,idUsuario INT NOT NULL 
	,modulo VARCHAR(5) NOT NULL
	,jsonData VARCHAR(MAX) NOT NULL	
)




INSERT INTO @table (idUsuario, modulo, jsonData)
SELECT idUsuario,'V'modulo, jsonData = (SELECT comprobantes = (SELECT 
																	'fechaEmision'         = (SELECT 'update' = 'true' for json path)
																	,'tiempoCredito'       = (SELECT 'update' = 'true' for json path)
																	,'tarifa'              = (SELECT 'update' = 'true' for json path)
																	,'porcentajeDescuento' = (SELECT 'admin'  = 'true' for json path)
																	,'descuentoTotal'      = (SELECT 'update' = 'true' for json path)  
															   for json path)
											   ,detalles =  (SELECT 
																 'medida'              = (SELECT 'update' = 'true' for json path )
																,'tipoIva'             = (SELECT 'update' = 'true' for json path )
																,'tarifa'              = (SELECT 'update' = 'true' ,'view' = 'true' for json path )
																,'precioUnitario'      = (SELECT 'update' = 'true' for json path )
																,'precioConImpuesto'   = (SELECT 'update' = 'true' for json path )
																,'porcentajeDescuento' = (SELECT 'update' = 'true' for json path )
																,'descuento'           = (SELECT 'update' = 'true' for json path ) for json path)											  
															for json path)
FROM dbo.Usuario where idUsuario = 1 
union all
SELECT idUsuario,'AR'modulo, jsonData = (SELECT 'precio' = (SELECT 'admin'= 'true' for json path) for json path)
FROM dbo.Usuario where idUsuario = 1 

SELECT 
	 jsonData
FROM @table WHERE modulo = 'V'



