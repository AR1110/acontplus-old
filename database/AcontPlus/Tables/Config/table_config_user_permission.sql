
USE AcontPlus;

--IF OBJECT_ID('Config.UserPermission') IS NOT NULL
--DROP TABLE Config.UserPermission
--GO
--CREATE TABLE Config.UserPermission (
--	idUserPermission INT PRIMARY KEY IDENTITY (1,1) NOT NULL
--	,idUsuarioRol INT NOT NULL CONSTRAINT PK_UsuarioRol FOREIGN KEY (idUsuarioRol) REFERENCES App.UsuarioRol(idUsuarioRol)	
--	,codModule VARCHAR(5) NOT NULL
--	,jsonPermission VARCHAR(MAX)
--	,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
--	,estado BIT NOT NULL DEFAULT 1	
--)

--IF OBJECT_ID('Config.Solicitud')IS NOT NULL
--	DROP TABLE Config.Solicitud
--GO 

----tabla solicitud para modificar, anular el documento de venta 
--CREATE TABLE Config.Solicitud(
--	idSolicitud INT NOT NULL PRIMARY KEY IDENTITY(1,1)
--	,idUsuarioRolAprobante  INT NOT NULL CONSTRAINT FK_Solicitud_UsuarioRol1 FOREIGN KEY (idUsuarioRolAprobante) REFERENCES App.UsuarioRol(idUsuarioRol)	
--	,idUsuarioRolSolictante INT NOT NULL CONSTRAINT FK_Solicitud_UsuarioRol2 FOREIGN KEY (idUsuarioRolSolictante) REFERENCES App.UsuarioRol(idUsuarioRol)	
--	,observacion VARCHAR(200) NOT NULL
--	,codigoAccion VARCHAR(2) -- E(EDITAR), A(ANULAR)
--	,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
--	,fechaAprobacion DATETIME  NULL 
--	,codEstado VARCHAR(2) -- P(PENDIENTE), A(APROBADA), F(FINALIZADO)
--)

DECLARE @jsonSalePermission VARCHAR(MAX) = '{"comprobante":{"fechaEmision":{"label":"Modificar descuento","update":true},"tiempoCredito":{"label":"Cambiar tiempo Credito","update":true},"tarifa":{"label":"Modifcar tarifa general","update":true},"porcentajeDescuento":{"label":"Cambiar Porcentaje Descuento ","update":true},"descuento":{"label":"Cambiar Descuento","update":true}},"detail":{"medida":{"label":"Cambiar Medida","update":true},"tipoIva":{"label":"Cambiar Tipo IVA","update":true},"tarifa":{"label":"Cambiar tarifa","update":true},"precioUnitario":{"label":"Modificar Precio Unitario","update":true},"precioConIva":{"label":"Modificar Precio con IVA","update":true},"porcentajeDescuento":{"label":"Modificar Porcentaje Descuento","update":true},"descuento":{"label":"Modificar Descuento","update":true}}}';

DECLARE @jsonArticlePermission VARCHAR(MAX) = '{"precio":{"label":"Permitir actualizar el precio costo y venta","update":true}}';

DECLARE @jsonCajaPermission VARCHAR(MAX) = '{"verOtrasCajas": {"label": "Ver otras cajas", "view": true}, "reporteMovimientoCaja": {"label": "Ver Reporte", "view": true}, "cerrarCaja": {"label": "Cerrar Caja", "cerrar": true}}'


DECLARE @newjson VARCHAR(MAX);

-----------------------------------------START SALE PERMISSIONS------------------------------------------
	--Insert properties in voucher property comprobante
		--SET @newjson = N'{"label":"Punto Emision", "update":true}';		
		--UPDATE Config.UserPermission SET jsonPermission = REPLACE(REPLACE(JSON_MODIFY(jsonPermission, 'append $.comprobante.puntoEmision', JSON_QUERY(@newjson)),'[', ''), ']', '') 
		--WHERE codModule='V'

		--Appendo property request key 
		--SET @newjson = '{"requestAuthorizationKey":{"label":"Solicitar Clave Autorización para Editar o Anular el Doc. Venta","requestKey":true}}'
		--UPDATE Config.UserPermission SET jsonPermission = JSON_MODIFY(jsonPermission, '$.additional', JSON_QUERY(@newjson)) 
		--WHERE codModule='V'
		--RETURN 

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
		--SET jsonPermission = JSON_MODIFY(jsonPermission, '$."additional"', NULL)			
		--WHERE codModule='V'		  	

	--Remove properties of voucher 
	
		--UPDATE Config.UserPermission 
		--SET jsonPermission = JSON_MODIFY(jsonPermission, '$."precioConIva"', NULL)			
		--WHERE codModule='AR'	

	--Remove properties of detail 
-----------------------------------------END SALE PERMISSIONS------------------------------------------


-----------------------------------------START ARTICLE PERMISSIONS------------------------------------------
	--Insert properties of article	

	
	--Update properties (label, update) of article 	

	--Remove properties of article 	
-----------------------------------------END ARTICLE PERMISSIONS------------------------------------------


-- Insertando permisos de usuarios de la entidad SEA CORP
-- SELECT * FROM App.UsuarioRol WHERE idEntidad = 4
		
--INSERT INTO Config.UserPermission(idUsuarioRol, codModule, jsonPermission)SELECT idUsuarioRol, 'V', @jsonSalePermission FROM App.UsuarioRol where idEntidad = 4
--INSERT INTO Config.UserPermission(idUsuarioRol, codModule, jsonPermission)SELECT idUsuarioRol, 'AR', @jsonArticle FROM App.UsuarioRol where idEntidad = 4

INSERT INTO Config.UserPermission(idUsuarioRol, codModule, jsonPermission)SELECT idUsuarioRol, 'C', @jsonCajaPermission FROM App.UsuarioRol

SELECT * FROM Config.UserPermission


