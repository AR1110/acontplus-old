USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Almacen].[Articulo_Insert]    Script Date: 1/9/2023 9:08:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-25
-- Description:	SP para registrar los aritculos 
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.Articulo_Insert 
     @userRoleId INT
	,@json NVARCHAR(MAX)
	,@s3ObjectKey VARCHAR(500) NULL
	,@s3ObjectUrl VARCHAR(800) NULL
AS

BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT ,@idArticulo INT

    --> Data Json
	DECLARE @jsonArticulo NVARCHAR(MAX) ,@jsonPvp VARCHAR(MAX) ,@idBodega INT ,@ubicacion VARCHAR(90) 

	--> Artculo
	DECLARE @idSubFamilia INT ,@llevaInventario BIT ,@codigo VARCHAR(50) ,@codigoBarra VARCHAR(50) ,@code UNIQUEIDENTIFIER = NEWID() ,@payload VARCHAR(MAX) ,@inventory VARCHAR(5)

	--> Restaurante
	DECLARE @siglaFamilia VARCHAR(5)
	   
    --> Tb Temp
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
	   ,fechaCreacion DATETIME NULL
	   ,fechaCaducidadlote DATETIME NULL
	   ,stockMinimo INT NULL
	   ,stockMaximo INT NULL
	   ,observaciones VARCHAR(300) NULL
	   ,caducidad BIT NULL
	   ,fechaCaducidad DATETIME NULL
	   ,cantMinimaVentaPorMayor INT NOT NULL
	)

	DECLARE @tbPrices AS TABLE (
		idTarifa INT UNIQUE NOT NULL
	   ,precioVenta NUMERIC(18,6) NOT NULL  
	   ,precioConIva NUMERIC(18,6) NOT NULL 
	   ,porcentajeUtilidad NUMERIC(18,5) NOT NULL 
	   ,precioPredeterminado BIT NOT NULL
	)
	BEGIN TRY
        --> Variables Globales
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json
        SELECT @jsonArticulo = jsonArticulo
		      ,@jsonPvp      = jsonPvp
		      ,@idBodega     = idBodega
		      ,@ubicacion    = ubicacion
	    FROM OPENJSON (@json) WITH
        (
	        jsonArticulo VARCHAR(MAX) 
	       ,jsonPvp      VARCHAR(MAX) 
	       ,idBodega     INT          
	       ,ubicacion    VARCHAR(90) 
        )

		 INSERT INTO @tbArticle
			   (idSubFamilia,idMarca,idModelo,idTipoIce,idTipoArticulo,idTipoIva,idMedida,precioCosto,precioSinSubsidio,codigo,codigoAuxiliar,valorIce,descripcion
			   ,llevaInventario,datosAdicionales,productoFraccionable,datosLote,lote,fechaCreacion,fechaCaducidadLote,stockMinimo,stockMaximo,observaciones,caducidad
			   ,fechaCaducidad,codigoBarra,idEtiqueta,cantMinimaVentaPorMayor)

		 SELECT idSubFamilia,idMarca,idModelo,idTipoIce,idTipoArticulo,idTipoIva,idMedida,precioCosto,precioSinSubsidio,codigo,codigoAuxiliar,valorIce,descripcion
			   ,llevaInventario,datosAdicionales,productoFraccionable,datosLote,lote,fechaCreacion,fechaCaducidadLote,stockMinimo,stockMaximo,observaciones,caducidad
			   ,fechaCaducidad,codigoBarra,idEtiqueta,cantMinimaVentaPorMayor
		 FROM OPENJSON(@jsonArticulo) WITH 
         (
             idSubFamilia            INT
            ,idMarca                 INT
            ,idModelo                INT 
            ,idTipoIce               INT 
            ,idTipoArticulo          INT 
            ,idTipoIva               INT 
            ,idMedida                INT 
            ,precioCosto             NUMERIC(15,5)
            ,precioSinSubsidio       NUMERIC(15,5)
            ,codigo                  VARCHAR(100)
            ,codigoAuxiliar          VARCHAR(100) 
            ,valorIce                NUMERIC(15,5)
            ,descripcion             VARCHAR(255)
            ,llevaInventario         BIT
            ,datosAdicionales        BIT
            ,productoFraccionable    BIT
            ,datosLote               BIT
            ,lote                    VARCHAR(100)
            ,fechaCreacion           DATETIME2
            ,fechaCaducidadLote      DATETIME2
            ,stockMinimo             INT
            ,stockMaximo             INT
            ,observaciones           VARCHAR(300)
            ,caducidad               BIT 
            ,fechaCaducidad          DATETIME2 
            ,codigoBarra             VARCHAR(100) 
            ,idEtiqueta              INT 
            ,cantMinimaVentaPorMayor INT 

         ) AS dt

		 INSERT INTO @tbPrices
               (idTarifa,precioVenta,precioConIva,porcentajeUtilidad,precioPredeterminado)
		 SELECT idTarifa,precioVenta,precioConIva,porcentajeUtilidad,precioPredeterminado
		 FROM OPENJSON(@jsonPvp) WITH 
         (
             idArticuloPvP        INT
            ,idTarifa             INT 
            ,precioVenta          NUMERIC(20,6) 
            ,precioConIva         NUMERIC(20,6)
            ,porcentajeUtilidad   NUMERIC(20,5)
            ,precioPredeterminado BIT

         ) as dt 

		--> Capturar Variables
        IF(LEN(LTRIM(RTRIM(@s3ObjectKey))) = 0)
		    BEGIN
			    SET @s3ObjectKey = NULL
			    SET @s3ObjectUrl = NULL
		    END

		SELECT TOP 1 @inventory = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.llevaInventario') FROM Config.Sistema WHERE idEntidad = @idEntidad AND codConfig = 'CI'
		
		SELECT @codigo          = t1.codigo
              ,@codigoBarra     = t1.codigoBarra
              ,@llevaInventario = t1.llevaInventario
              ,@idSubFamilia    = t1.idSubFamilia
              ,@siglaFamilia    = t3.siglas
        FROM @tbArticle           t1
        INNER JOIN dbo.SubFamilia t2 ON t2.idSubFamilia = t1.idSubFamilia
        INNER JOIN dbo.Familia    t3 ON t3.idFamilia    = t2.idFamilia

		--> Validaciones
		IF NOT EXISTS(SELECT 1 FROM @tbArticle)
			BEGIN
				SELECT '0'code,'Error en la informacion del Articulo' as 'message'
				RETURN
			END 

        IF NOT EXISTS(SELECT 1 FROM @tbPrices)
            BEGIN
				SELECT '0'code,'Error en la informacion de las tarifas' as 'message'
				RETURN
			END

		IF EXISTS (SELECT 1 FROM Articulo WITH (NOLOCK) WHERE codigo = @codigo AND idEntidad = @idEntidad)
			BEGIN
				SELECT '0'code,'Este codigo se encuentra en uso para otro articulo' as 'message'
				RETURN 
			END 

		IF EXISTS (SELECT 1 FROM Articulo WITH (NOLOCK) WHERE codigoBarra = @codigoBarra AND idEntidad = @idEntidad)
			BEGIN
				SELECT '0'code,'Este codigo de Barra se encuentra en uso para otro articulo' as 'message'
				RETURN 
			END 

		IF @llevaInventario = 1 AND @inventory = 'NO'
			BEGIN
				SELECT '0'code,'No se ha establecido una configuración de control de inventario en la sección general de la configuración esto indica que no es posible establecer que este artículo requiere llevar un registro de inventario.' as 'message'
				RETURN
			END

		BEGIN TRAN 
            --> Articulo
			INSERT INTO Articulo 
				(code_unique,idSubFamilia,idMarca,idModelo,idTipoIce,idTipoArticulo,idTipoIva,idMedida
				,idEtiqueta,precioCosto,precioSinSubsidio,codigo,codigoAuxiliar,codigoBarra,valorIce,descripcion,llevaInventario
				,datosAdicionales,productoFraccionable,datosLote,Lote,fechaCreacion,fechaCaducidadLote,stockMinimo
				,stockMaximo,observaciones,caducidad,fechaCaducidad,idEntidad,idUsuario,fechaRegistro,cantMinimaVentaPorMayor)

			SELECT @code,idSubFamilia,idMarca,idModelo,idTipoIce,idTipoArticulo,idTipoIva,idMedida
				,idEtiqueta,precioCosto,precioSinSubsidio,codigo,codigoAuxiliar,codigoBarra,valorIce,descripcion,llevaInventario
				,datosAdicionales,productoFraccionable,datosLote,lote,fechaCreacion,fechaCaducidadlote,stockMinimo
				,stockMaximo,observaciones,caducidad,fechaCaducidad,@idEntidad,@idUsuario,dbo.ufnGetDateEcuador(),cantMinimaVentaPorMayor
			FROM @tbArticle

			SET @idArticulo = SCOPE_IDENTITY()

            --> Tarifas de precio
			INSERT INTO ArticuloPvP 
                   (idArticulo,idTarifa,precioVenta,precioConIva,porcentajeUtilidad,precioPredeterminado)
			SELECT @idArticulo,idTarifa,precioVenta,precioConIva,porcentajeUtilidad,precioPredeterminado
			FROM @tbPrices
            
            --> Photo Product
            IF @s3ObjectKey IS NOT NULL AND @s3ObjectUrl IS NOT NULL
                BEGIN 
                    INSERT INTO [Inventario].[ProductPhoto]( [ProductId], [S3ObjectKey], [S3ObjectUrl], [IsDefault], [UserId] ) 
                    SELECT @idArticulo,@s3ObjectKey,@s3ObjectUrl,1,@idUsuario
                END 
			
			--> ubicacion  
			INSERT INTO ArticuloUbicacion 
				(idArticulo
				,idBodega
				,ubicacion)
			VALUES 
				(@idArticulo
				,CASE WHEN @idBodega  = 0  THEN NULL ELSE @idBodega  END 
				,CASE WHEN @ubicacion = '' THEN NULL ELSE @ubicacion END )
			
            --> Stock Historial
			IF @llevaInventario = 1 
				BEGIN
					INSERT INTO Inventario.Stock
					       (idArticulo,idBodega,cantidad,lastUpdate,idUsuario)
					SELECT @idArticulo,bo.idBodega,0,GETDATE(),@idUsuario 
                    FROM dbo.Bodega bo WITH (NOLOCK) 
                    INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = bo.codEstab
                    WHERE es.idEntidad = @idEntidad
				END 
            
            --> Restaurant
			IF(@siglaFamilia IN ('RES', 'POR'))
				BEGIN
					INSERT INTO Restaurant.Item
					(ProductId, Summary, Cooking, Recipe, Instructions, Content, CreatedAt, UpdatedAt
					,[Enabled], Deleted, UserId)
					VALUES(@idArticulo, NULL, 1, NULL, NULL, NULL, dbo.ufnGetDateEcuador(), NULL, 1, 0, @idUsuario)
				END

			IF(@siglaFamilia = 'ING')
				BEGIN
					INSERT INTO Restaurant.Ingredient
					(ProductId, Summary, Quantity, Unit, Content, CreatedAt, UpdatedAt, [Enabled], Deleted, UserId, IngredientTypeId)
					VALUES(@idArticulo, (SELECT  descripcion FROM @tbArticle), NULL, NULL, NULL, dbo.ufnGetDateEcuador(), NULL, 1, 0, @idUsuario, NULL)
				END

            IF(@siglaFamilia = 'COM')
				BEGIN
					INSERT INTO Restaurant.Menu
					(ProductId, Title,Summary, Content, CreatedAt, UpdatedAt, [Enabled], Deleted, UserId)
					VALUES(@idArticulo,(SELECT descripcion FROM @tbArticle),(SELECT descripcion FROM @tbArticle), NULL, dbo.ufnGetDateEcuador(), NULL, 1, 0, @idUsuario)
				END

            UPDATE SubFamilia SET ultimoSecuencial = ultimoSecuencial+1 WHERE idSubFamilia = @idSubFamilia

            SET @payload = (

                                SELECT idArticulo
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
	END TRY

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END
		
		INSERT INTO ErroresSistema(token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		VALUES(NEWID(),'/Articulo/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario)

        SELECT '0'code,'Info: Error en el procedimiento ' as 'message'
	END CATCH  
END
