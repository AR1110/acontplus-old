USE [AcontPlus]
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Importaciones.Articulo_Insert', N'P') IS NOT NULL
DROP PROCEDURE Importaciones.Articulo_Insert 
GO
CREATE PROCEDURE Importaciones.Articulo_Insert @idRol INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET NOCOUNT ON;
	DECLARE @idUsuario INT
	DECLARE @idEntidad INT
	DECLARE @ruc AS VARCHAR(15)
	DECLARE @count INT
	DECLARE @sequential INT
	DECLARE @tablaTarifa TABLE
	(
		idTarifa INT NOT NULL,
		codTarifa VARCHAR(50) UNIQUE NOT NULL,
		perdeterminada BIT
	)

	DECLARE @tablaArticuloImport TABLE
	(
		idArticulo INT NOT NULL
	   ,codArticulo VARCHAR(50) UNIQUE NOT NULL
	)

	DECLARE @tableArticulo TABLE 
	(
		id INT IDENTITY(1,1) UNIQUE NOT NULL
	   ,idSubFamilia INT
	   ,idMedida INT 
	   ,idMarca INT
	   ,idModelo INT
	   ,idTipoIva INT 
	   ,codigo VARCHAR(200) UNIQUE NOT NULL
	   ,codBarras VARCHAR(200) UNIQUE 
	   ,codAuxiliar VARCHAR(200) UNIQUE 
	   ,descripcion VARCHAR(500) NOT NULL
	   ,precioCosto DECIMAL(15,5)
	   ,stock DECIMAL(15,5)
	   ,llevaInventario BIT NOT NULL
	   ,fraccionado BIT NOT NULL
	   ,importacion BIT DEFAULT 1 
	)

	DECLARE @tablePvP TABLE 
	(
		 codTarifa INT NOT NULL
		,idTipoIva INT NOT NULL
		,codArticulo NVARCHAR(150) NOT NULL
		,precio DECIMAL(20,5) 
		,precioCosto DECIMAL(15,5)
	)

	SELECT TOP 1 @idEntidad = idEntidad,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

	SELECT @sequential = COUNT(*) FROM dbo.Articulo 

	INSERT INTO @tablaTarifa (idTarifa,codTarifa,perdeterminada)SELECT idTarifa,codigo ,predeterminada       FROM dbo.Tarifa     WHERE estado = 1 AND idEntidad = @idEntidad

	BEGIN TRY
		BEGIN TRAN 
			INSERT INTO @tableArticulo
				(
					 idSubFamilia
					,idMedida
					,idMarca
					,idModelo
					,idTipoIva
					,codigo
					,codBarras
					,codAuxiliar
					,descripcion
					,precioCosto
					,stock
					,llevaInventario
					,fraccionado
				)
			SELECT 
					dt.idSubFamilia
				   ,dt.idMedida
				   ,dt.idMarca
				   ,dt.idModelo
				   ,dt.idTipoIva
				   ,dt.codigo
				   ,dt.codBarras
				   ,dt.codAuxiliar
				   ,dt.descripcion
				   ,dt.precioCosto
				   ,dt.stock
				   ,llevaInventario = dt.llevaInventario 
				   ,fraccionado     = dt.fraccionado 
			FROM OPENJSON(@json) 
			WITH
			(
				 codigo          VARCHAR(300)  '$.codigo'
				,codBarras       VARCHAR(500)  '$.codBarras'
				,codAuxiliar     VARCHAR(500)  '$.codigo'
				,idSubFamilia    INT           '$.idSubFamilia'
				,idMedida        INT           '$.idMedida'
				,idMarca         INT           '$.idMarca'
				,idModelo        INT           '$.idModelo'
				,idTipoIva       INT           '$.idTipoIva'
				,descripcion     VARCHAR(500)  '$.descripcion'
				,precioCosto     DECIMAL(20,5) '$.precioCosto'
				,llevaInventario BIT           '$.llevaInventario'
				,fraccionado     BIT           '$.fraccionado'
				,stock           DECIMAL(20,5) '$.stock'
			) as dt


			INSERT INTO @tablePvP (precio,codTarifa,codArticulo,precioCosto,idTipoIva)
			SELECT precio,REPLACE(tarifa,'PVP',''),codigo,precioCosto,idTipoIva
			FROM OPENJSON(@json)
			WITH
			(   
				 PVP1        DECIMAL(20,5) '$.PVP1'
				,PVP2        DECIMAL(20,5) '$.PVP2'
				,PVP3        DECIMAL(20,5) '$.PVP3'
				,PVP4        DECIMAL(20,5) '$.PVP4'
				,PVP5        DECIMAL(20,5) '$.PVP5'
				,codigo      NVARCHAR(200) '$.codigo'
				,idTipoIva   INT           '$.idTipoIva'
				,precioCosto DECIMAL(20,5) '$.precioCosto'
			) AS JS
			UNPIVOT
			(
			    precio 
				FOR tarifa in ([pvp1],[pvp2],[pvp3],[pvp4],[pvp5])           
			) as p


			SELECT @count = COUNT(*) FROM @tableArticulo 


			INSERT INTO dbo.Articulo
				(
				 code_unique
				,idTipoIva
				,idMedida
				,idSubFamilia
				,idMarca
				,idModelo
				,codigo
				,codigoBarra
				,codigoAuxiliar
				,descripcion
				,precioCosto
				,stock
				,llevaInventario
				,productoFraccionable
				,fechaRegistro
				,idUsuario
				,idEntidad
				,importacion)
			SELECT 
				 'I'+Helper.F_Auto_Sequential(id+@sequential)
				,idTipoIva
				,idMedida
				,idSubFamilia
				,idMarca
				,idModelo
				,codigo
				,codBarras
				,codAuxiliar
				,descripcion
				,precioCosto
				,stock
				,llevaInventario
				,fraccionado
				,dbo.ufnGetDateEcuador()
				,@idUsuario
				,@idEntidad
				,importacion
			FROM @tableArticulo 

			INSERT INTO @tablaArticuloImport(idArticulo,codArticulo)
			SELECT idArticulo,codigo FROM dbo.Articulo WHERE idEntidad = @idEntidad AND importacion = 1

			INSERT INTO dbo.ArticuloPvP
				(
			     idArticulo
				,idTarifa
				,precioConIva
				,precioVenta
				,porcentajeUtilidad
				,precioPredeterminado
				,fechaRegistro
				)
			SELECT 
				ai.idArticulo
				,ta.idTarifa
				,precioConIva = pvp.precio
				,precioVenta =  CONVERT(DECIMAL(20,5),pvp.precio / (ti.porcentaje / 100 + 1))
				,0
				,ta.perdeterminada
				,dbo.ufnGetDateEcuador()
			FROM @tablePvP pvp
			INNER JOIN @tablaArticuloImport ai ON ai.codArticulo = pvp.codArticulo
			INNER JOIN @tablaTarifa ta ON ta.codTarifa = pvp.codTarifa
			INNER JOIN dbo.TipoIva ti ON ti.idTipoIva = pvp.idTipoIva


			INSERT INTO Inventario.Stock(idBodega,idArticulo,cantidad)
							  SELECT bo.idBodega,ar.idArticulo,0
							  FROM dbo.Articulo      ar WITH (NOLOCK)
							  INNER JOIN dbo.Entidad en WITH (NOLOCK) ON en.idEntidad = ar.idEntidad
							  INNER JOIn dbo.Bodega  bo WITH (NOLOCK) ON bo.ruc       = en.ruc
							  WHERE ar.idEntidad = @idEntidad 
							    AND ar.llevaInventario = 1 
								AND ar.estado = 1
								AND ar.idArticulo NOT IN (SELECT s.idArticulo FROM Inventario.Stock s WITH (NOLOCK) INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = s.idArticulo WHERE ar.idEntidad = @idEntidad )

			INSERT INTO Importaciones.Historial(idUsuario,idEntidad,modulo,cantidad,fechaRegistro)
			SELECT @idUsuario,@idEntidad,'/Almacen/Articulo',@count,dbo.ufnGetDateEcuador()

		COMMIT TRAN 
		SELECT '1' code, 'Articulos Importados correctamente' as 'message'
		RETURN 
	END TRY 
	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0' code, 'Error en el procedimiento: '+ERROR_MESSAGE() as 'message'
		INSERT INTO ErroresSistema
								   (token
								   ,method
								   ,errorNumber
								   ,errorSeverity 
								   ,errorState
								   ,errorProcedure
								   ,errorLine
								   ,errorMessage
								   ,errorDate
								   ,idUsuario)
							VALUES
									(NEWID()
									,'/ImportacionArticulo'
									,ERROR_NUMBER()
									,ERROR_SEVERITY()
									,ERROR_STATE()
									,ERROR_PROCEDURE()
									,ERROR_LINE()
									,ERROR_MESSAGE()
									,GETDATE()
									,@idUsuario)
	END CATCH

END
GO
