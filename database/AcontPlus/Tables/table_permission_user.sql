
USE AcontPlus;

--IF OBJECT_ID('Config.UserPermission') IS NOT NULL
--DROP TABLE Config.UserPermission

--CREATE TABLE Config.UserPermission (
--	idUserPermission INT PRIMARY KEY IDENTITY (1,1) NOT NULL
--	,idUsuarioRol INT NOT NULL CONSTRAINT PK_UsuarioRol FOREIGN KEY (idUsuarioRol) REFERENCES App.UsuarioRol(idUsuarioRol)	
--	,codModule VARCHAR(5) NOT NULL
--	,jsonPermission VARCHAR(MAX)
--	,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
--	,estado BIT NOT NULL DEFAULT 1	
--)


DECLARE @jsonSalePermission VARCHAR(MAX) = '{"comprobante":{"fechaEmision":{"label":"Modificar descuento","update":true},"tiempoCredito":{"label":"Cambiar tiempo Credito","update":true},"tarifa":{"label":"Modifcar tarifa general","update":true},"porcentajeDescuento":{"label":"Cambiar Porcentaje Descuento ","update":true},"descuento":{"label":"Cambiar Descuento","update":true}},"detail":{"medida":{"label":"Cambiar Medida","update":true},"tipoIva":{"label":"Cambiar Tipo IVA","update":true},"tarifa":{"label":"Cambiar tarifa","update":true},"precioUnitario":{"label":"Modificar Precio Unitario","update":true},"precioConIva":{"label":"Modificar Precio con IVA","update":true},"porcentajeDescuento":{"label":"Modificar Porcentaje Descuento","update":true},"descuento":{"label":"Modificar Descuento","update":true}}}';

DECLARE @jsonArticle VARCHAR(MAX) = '{"precio":{"label":"Permitir actualizar el precio costo y venta","update":true}}';


DECLARE @newjson VARCHAR(100);

-----------------------------------------START SALE PERMISSIONS------------------------------------------
	--Insert properties of voucher
		--SET @newjson = N'{"label":"Punto Emision", "update":true}';		
		--UPDATE Config.UserPermission SET jsonPermission = REPLACE(REPLACE(JSON_MODIFY(jsonPermission, 'append $.comprobante.puntoEmision', JSON_QUERY(@newjson)),'[', ''), ']', '') 
		--WHERE codModule='V'

	--Insert properties of detail 
		--SET @newjson = N'{"label":"Precio Con Iva", "update":true}';		
		--UPDATE Config.UserPermission SET jsonPermission = REPLACE(REPLACE(JSON_MODIFY(jsonPermission, 'append $.precioConIva', JSON_QUERY(@newjson)),'[', ''), ']', '') 
		--WHERE codModule='AR'
	
	--Update properties (label, update) of voucher 
		--SET @newjson = N'{"label":"Punto Emision UPDATE", "update":true}';		
		--UPDATE Config.UserPermission SET jsonPermission = REPLACE(REPLACE(JSON_MODIFY(jsonPermission, '$.comprobante.puntoEmision', JSON_QUERY(@newjson)),'[', ''), ']', '') 
		--WHERE codModule='V'
	--Update properties (label, update) of detail 

	----Rename Key property of voucher 		
		--UPDATE Config.UserPermission 
		--SET jsonPermission = JSON_MODIFY(jsonPermission, '$.comprobante.estabupdate', JSON_QUERY(jsonPermission, '$.comprobante.estab'))			
		--WHERE codModule='V'

		--UPDATE Config.UserPermission 
		--SET jsonPermission = JSON_MODIFY(jsonPermission, '$.comprobante."estab"', NULL)			
		--WHERE codModule='V'		  	

	--Remove properties of voucher 
	
		--UPDATE Config.UserPermission 
		--SET jsonPermission = JSON_MODIFY(jsonPermission, '$."precioConIva"', NULL)			
		--WHERE codModule='AR'	
		
		select * from Config.UserPermission

		SELECT * FROM Config.UserPermission up
		INNER JOIN App.UsuarioRol ur ON ur.idEntidad = 

	--Remove properties of detail 
-----------------------------------------END SALE PERMISSIONS------------------------------------------


-----------------------------------------START ARTICLE PERMISSIONS------------------------------------------
	--Insert properties of article	

	
	--Update properties (label, update) of article 	

	--Remove properties of article 	
-----------------------------------------END ARTICLE PERMISSIONS------------------------------------------
