USE AcontPlus
GO
-- =============================================
-- Author:		DANIS MANCHU
-- Create date: 2023-06-29
-- Description:	SP para registrar los aritculos desde la app
-- =============================================
CREATE OR ALTER PROCEDURE Almacen.Articulo_Insert_v2
	  @idUsuarioRol INT 
	 ,@json VARCHAR(max)
	--,@jsonArticulo VARCHAR(max)	
	--,@idBodega INT 
	--,@ubicacion VARCHAR(90) 
AS

BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idArticulo INT
	DECLARE @idEntidad INT 
	DECLARE @idUsuario INT 
	DECLARE @idSubFamilia INT 
	DECLARE @sequential INT
	DECLARE @llevaInventario BIT 
	DECLARE @ruc VARCHAR(13)
	DECLARE @codigo VARCHAR(50)
	DECLARE @codigoBarra VARCHAR(50)
	DECLARE @codigoAuxiliar VARCHAR(50)
	DECLARE @code VARCHAR(15)
	DECLARE @payload VARCHAR(MAX)
		   ,@fechaCreacion DATETIME = (SELECT dbo.ufnGetDateEcuador())

	DECLARE @inventory VARCHAR(5)

	DECLARE @tbArticle AS TABLE (
		idSubFamilia INT NOT NULL
	   ,idMarca INT NULL
	   ,idModelo INT NULL
	   ,idTipoIce INT NULL
	   ,idTipoArticulo INT NULL
	   ,idTipoIva INT NOT NULL
	   ,idMedida INT NOT NULL
	   ,idEtiqueta INT NULL
	   ,precioCosto NUMERIC(18,5) NOT NULL
	   ,precioSinSubsidio NUMERIC(18,5) NOT NULL
	   ,codigo VARCHAR(150) UNIQUE NOT NULL
	   ,codigoAuxiliar VARCHAR(150) UNIQUE NOT NULL
	   ,codigoBarra VARCHAR(150) UNIQUE NOT NULL
	   ,valorIce NUMERIC(18,5)
	   ,descripcion VARCHAR(500) NOT NULL
	   ,llevaInventario BIT NOT NULL
	   ,datosAdicionales BIT NOT NULL
	   ,productoFraccionable BIT NOT NULL
	   ,datosLote BIT NULL
	   ,lote BIT NULL	   
	   ,stockMinimo INT NULL
	   ,stockMaximo INT NULL
	   ,observaciones VARCHAR(300) NULL
	   ,caducidad BIT NULL	   
	   ,cantMinimaVentaPorMayor INT NOT NULL
	)

	DECLARE @tbPrices AS TABLE (
		idTarifa INT UNIQUE NOT NULL
	   ,precioVenta NUMERIC(18,5) NOT NULL  
	   ,precioConIva NUMERIC(18,5) NOT NULL 
	   ,porcentajeUtilidad NUMERIC(18,5) NOT NULL 
	   ,precioPredeterminado BIT NOT NULL
	)

	IF ISJSON(@json) = 0
		BEGIN 
			SELECT '0' code, 'Formato no válido '+ @json as 'message', 'Artículo'
			RETURN
		END

	BEGIN TRY 
		
		 INSERT INTO @tbArticle
				(idSubFamilia
				,idMarca
				,idModelo
				,idTipoIce
				,idTipoArticulo
				,idTipoIva
				,idMedida
				,precioCosto
				,precioSinSubsidio
				,codigo
				,codigoAuxiliar
				,valorIce
				,descripcion
				,llevaInventario
				,datosAdicionales
				,productoFraccionable
				,datosLote
				,lote				
				,stockMinimo
				,stockMaximo
				,observaciones
				,caducidad				
				,codigoBarra		
				,idEtiqueta
				,cantMinimaVentaPorMayor)
			SELECT 
				 CASE WHEN idSubFamilia   = 0 THEN NULL ELSE idSubFamilia   END
				,CASE WHEN idMarca        = 0 THEN NULL ELSE idMarca        END 
				,CASE WHEN idModelo       = 0 THEN NULL ELSE idModelo       END 
				,CASE WHEN idTipoIce      = 0 THEN NULL ELSE idTipoIce      END 
				,CASE WHEN idTipoArticulo = 0 THEN NULL ELSE idTipoArticulo END 
				,idTipoIva
				,idMedida
				,precioCosto
				,ISNULL(precioSinSubsidio,0)
				,codigo
				,codigoAuxiliar
				,ISNULL(valorIce,0)
				,ISNULL(descripcion, '')
				,ISNULL(llevaInventario,0)
				,ISNULL(datosAdicionales,0)
				,ISNULL(productoFraccionable,0)
				,ISNULL(datosLote,0)
				,ISNULL(lote, 0)
				,ISNULL(stockMinimo,0)
				,ISNULL(stockMaximo,0)
				,ISNULL(observaciones, '')
				,ISNULL(caducidad,0)				
				,ISNULL(codigoBarra, '')	
				,CASE WHEN datosAdicionales = 1 THEN idEtiqueta ELSE NULL END 
				,ISNULL(cantMinimaVentaPorMayor,0)
		 FROM OPENJSON(@json) 
		 WITH (idSubFamilia                  INT '$.idSubFamilia'
				,idMarca                     INT '$.idMarca'
				,idModelo                    INT '$.idModelo'
				,idTipoIce                   INT '$.idTipoIce'
				,idTipoArticulo              INT '$.idTipoArticulo'
				,idTipoIva                   INT '$.idTipoIva'
				,idMedida                    INT '$.idMedida'
				,precioCosto       NUMERIC(15,5) '$.precioCosto'
				,precioSinSubsidio NUMERIC(15,5) '$.precioSinSubsidio'
				,codigo             VARCHAR(100) '$.codigo'
				,codigoAuxiliar     VARCHAR(100) '$.codigoAuxiliar'
				,valorIce          NUMERIC(15,5) '$.valorIce'
				,descripcion        VARCHAR(255) '$.descripcion'
				,llevaInventario             BIT '$.llevaInventario'
				,datosAdicionales            BIT '$.datosAdicionales'
				,productoFraccionable        BIT '$.productoFraccionable'
				,datosLote                   BIT '$.datosLote'
				,lote               VARCHAR(100) '$.lote'				
				,stockMinimo                 INT '$.stockMinimo'
				,stockMaximo                 INT '$.stockMaximo'
				,observaciones      VARCHAR(300) '$.observaciones'
				,caducidad                   BIT '$.caducidad'				
				,codigoBarra        VARCHAR(100) '$.codigoBarra'
				,idEtiqueta                  INT '$.idEtiqueta'
				,cantMinimaVentaPorMayor     INT '$.cantMinimaVentaPorMayor') AS dt

		INSERT INTO @tbPrices(idTarifa,precioVenta,precioConIva,porcentajeUtilidad,precioPredeterminado)

		SELECT idTarifa
				,precioVenta
				,ISNULL(precioConIva, 0)
				,ISNULL(porcentajeUtilidad, 0)
				,precioPredeterminado
		FROM OPENJSON(@json) 
		WITH (idArticuloPvP                INT '$.idArticuloPvP'
				,idTarifa                     INT '$.idTarifa' 
				,precioVenta        NUMERIC(20,5) '$.precioVenta'
				,precioConIva       NUMERIC(20,5) '$.precioConIva' 
				,porcentajeUtilidad NUMERIC(20,5) '$.porcentajeUtilidad'
				,precioPredeterminado         BIT '$.precioPredeterminado') as dt 

		--============================================== Capturar Variables ===============================================================
		SELECT @sequential = COUNT(*)+1 FROM dbo.Articulo 

		SET @code = ('A'+Helper.F_Auto_Sequential(@sequential))

		SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad
		
		SELECT TOP 1 @inventory = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.llevaInventario') FROM Config.Sistema WHERE idEntidad = @idEntidad AND codConfig = 'CI'
		
		SELECT @codigo = codigo,@codigoBarra = codigoBarra,@codigoAuxiliar = codigoAuxiliar,@llevaInventario = llevaInventario,@idSubFamilia = idSubFamilia FROM @tbArticle

		--=============================================== Validaciones ======================================================================
		
		IF (SELECT COUNT(*) FROM @tbArticle) = 0 
			BEGIN
				SELECT '0'code,'Error en la informacion del Articulo' as 'message'
				RETURN
			END 

		IF (SELECT COUNT(*) FROM @tbPrices) = 0 
			BEGIN
				SELECT '0'code,'Error en la informacion de las tarifas de precios' as 'message'
				RETURN
			END 

		IF EXISTS (SELECT 1 FROM Articulo WITH (NOLOCK) WHERE codigo = @codigo AND idEntidad = @idEntidad)
			BEGIN
				SELECT '0'code,'Este codigo se encuentra en uso para otro articulo' as 'message'
				RETURN 
			END 

		IF EXISTS (SELECT 1 FROM Articulo WITH (NOLOCK) 
							WHERE codigoBarra = @codigoBarra 
							AND LEN(codigoBarra) > 0
							AND codigoBarra IS NOT NULL
							AND codigoBarra != ''
							AND idEntidad = @idEntidad)
			BEGIN
				SELECT '0'code,'Este codigo de Barra se encuentra en uso para otro articulo' as 'message'
				RETURN 
			END 

		------ 	
		IF EXISTS (SELECT 1 FROM Articulo WITH (NOLOCK) WHERE codigoAuxiliar = @codigoAuxiliar AND idEntidad = @idEntidad)
			BEGIN
				SELECT '0'code,'Este codigo Auxiliar se encuentra en uso para otro articulo' as 'message'
				RETURN 
			END 

		IF @llevaInventario = 1 AND @inventory = 'NO'
			BEGIN
				SELECT '0'code,'No se ha establecido una configuración de control de inventario en la sección general de la configuración esto indica que no es posible establecer que este artículo requiere llevar un registro de inventario.' as 'message'
				RETURN
			END

		BEGIN TRAN 
			--REGISTRAR LOS DATOS GENERALES DEL ARTICULO 
			INSERT INTO Articulo 
				(code_unique,idSubFamilia,idMarca,idModelo,idTipoIce,idTipoArticulo,idTipoIva,idMedida
				,idEtiqueta,precioCosto,precioSinSubsidio,codigo,codigoAuxiliar,codigoBarra,valorIce,descripcion,llevaInventario
				,datosAdicionales,productoFraccionable,datosLote,Lote,fechaCreacion,fechaCaducidadLote,stockMinimo
				,stockMaximo,observaciones,caducidad,fechaCaducidad,idEntidad,idUsuario,fechaRegistro,cantMinimaVentaPorMayor)
			SELECT 
				 @code,idSubFamilia,idMarca,idModelo,idTipoIce,idTipoArticulo,idTipoIva,idMedida
				,idEtiqueta,precioCosto,precioSinSubsidio,codigo,codigoAuxiliar,codigoBarra,valorIce,descripcion,llevaInventario
				,datosAdicionales,productoFraccionable,datosLote,lote,@fechaCreacion,NULL,stockMinimo
				,stockMaximo,observaciones,caducidad,NULL,@idEntidad,@idUsuario,dbo.ufnGetDateEcuador(),cantMinimaVentaPorMayor
			FROM @tbArticle

			SET @idArticulo = @@IDENTITY

			INSERT INTO ArticuloPvP (idArticulo,idTarifa,precioVenta,precioConIva,porcentajeUtilidad,precioPredeterminado)
					         SELECT @idArticulo,idTarifa,precioVenta,precioConIva,porcentajeUtilidad,precioPredeterminado
					         FROM @tbPrices
			
			--Registrmos la ubicacion del articulo en las bodegas 
			--INSERT INTO ArticuloUbicacion 
			--	(idArticulo
			--	,idBodega
			--	,ubicacion)
			--VALUES 
			--	(@idArticulo
			--	,CASE WHEN @idBodega  = 0  THEN NULL ELSE @idBodega  END 
			--	,CASE WHEN @ubicacion = '' THEN NULL ELSE @ubicacion END )
			

			IF @llevaInventario = 1 
				BEGIN
					INSERT INTO Inventario.Stock
					       (idArticulo,idBodega,cantidad,lastUpdate,idUsuario)
					SELECT @idArticulo,bo.idBodega,0,GETDATE(),@idUsuario FROM dbo.Bodega bo WITH (NOLOCK) INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = bo.codEstab WHERE es.ruc = @ruc
				END 

			 UPDATE SubFamilia SET ultimoSecuencial = ultimoSecuencial+1 WHERE idSubFamilia = @idSubFamilia
		
			 SET @payload = (SELECT 
								 idArticulo
								,idMedida
								,codigo
								,codigoAuxiliar
								,codigoBarra
								,gestion = 'A'
	 							,'data'  = 0
								,etiquetas = ISNULL((SELECT e.idEtiqueta , e.descripcion, e.etiquetas FROM Inventario.Etiqueta e WHERE e.idEtiqueta = art.idEtiqueta FOR JSON PATH), '[]')
							 FROM Articulo art 
							 WHERE art.idArticulo = @idArticulo FOR JSON PATH 
							 )

		COMMIT TRAN 
		SELECT '1'code,'Registrado Correctamente' as 'message', @payload as payload
		RETURN;
	END TRY

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0'code,'Error en el procedimiento - app: ' + ERROR_MESSAGE() + CAST(ERROR_NUMBER() AS VARCHAR) as 'message'
		INSERT INTO ErroresSistema(token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		VALUES(NEWID(),'/Articulo/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE() + @json,GETDATE(),@idUsuario)
	END CATCH  
END
