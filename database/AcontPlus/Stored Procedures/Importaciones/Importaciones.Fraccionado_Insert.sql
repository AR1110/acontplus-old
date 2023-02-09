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
IF OBJECT_ID(N'Importaciones.Fraccionado_Insert', N'P') IS NOT NULL
DROP PROCEDURE Importaciones.Fraccionado_Insert 
GO
CREATE PROCEDURE Importaciones.Fraccionado_Insert @idRol INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET NOCOUNT ON;
	DECLARE @idUsuario INT
	DECLARE @idEntidad INT
	DECLARE @count INT
	DECLARE @sequential INT
	DECLARE @tableArticulo TABLE 
	(
	    id INT IDENTITY(1,1) UNIQUE NOT NULL
	   ,unique_code VARCHAR(150) UNIQUE  NOT NULL   
	   ,idArticulo INT NOT NULL
	   ,idMedida INT NOT NULL
	   ,conversion DECIMAL(15,5) NOT NULL
	   ,precioCostoFraccionado DECIMAL(15,5) NOT NULL
	   ,importacion INT DEFAULT 1 
	)

	DECLARE @tablePvP TABLE 
	(
		 codTarifa INT NOT NULL
		,idTipoIva INT NOT NULL
		,codFraccionado NVARCHAR(150) NOT NULL
		,precio DECIMAL(20,5) 
		,precioCosto DECIMAL(15,5)
	)
	
	DECLARE @tablaTarifa  TABLE
	(
		idTarifa INT NOT NULL
	   ,codTarifa VARCHAR(50) UNIQUE NOT NULL
	   ,perdeterminada BIT
	)

	DECLARE @tablaArticuloImport TABLE
	(
		idArticuloFraccionado INT NOT NULL
	   ,codFraccionado  VARCHAR(50) UNIQUE NOT NULL
	)
	
	SELECT @idEntidad = idEntidad,@idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idRol

	SELECT @sequential = COUNT(*) FROM dbo.ArticuloFraccionado 

	INSERT INTO @tablaTarifa (idTarifa,codTarifa,perdeterminada)SELECT idTarifa,codigo ,predeterminada FROM dbo.Tarifa WHERE estado = 1 AND idEntidad = @idEntidad

	--SELECT '0' code, 'el json es: '+@json as 'message'
	--RETURN 

	BEGIN TRY
		BEGIN TRAN 
			INSERT INTO @tableArticulo
				(
				    unique_code
				   ,idArticulo 
				   ,idMedida  
				   ,conversion                
	               ,precioCostoFraccionado 
				)
			SELECT 
				    codigo
				   ,idArticulo 
				   ,idMedida  
				   ,conversion                
	               ,precioCostoFraccionado   
			FROM OPENJSON(@json) 
			WITH
			(
				 codigo                 VARCHAR(150)  '$.codigo'
				,idArticulo             INT           '$.idArticulo'
	            ,idMedida               INT           '$.idMedida' 
	            ,conversion             DECIMAL(15,5) '$.conversion'
	            ,precioCostoFraccionado DECIMAL(15,5) '$.precioCosto'

			) as dt


			INSERT INTO @tablePvP (precio,codTarifa,codFraccionado,precioCosto,idTipoIva)
			SELECT precio,REPLACE(tarifa,'PVP',''),codigo,precioCosto,idTipoIva
			FROM OPENJSON(@json)
			WITH
			(   
				 PVP1        DECIMAL(20,5) '$.PVP1'
				,PVP2        DECIMAL(20,5) '$.PVP2'
				,PVP3        DECIMAL(20,5) '$.PVP3'
				,PVP4        DECIMAL(20,5) '$.PVP4'
				,PVP5        DECIMAL(20,5) '$.PVP5'
				,codigo      VARCHAR(200)  '$.codigo'
				,idTipoIva   INT           '$.idTipoIva'
				,precioCosto DECIMAL(20,5) '$.precioCosto'
			) AS JS
			UNPIVOT
			(
			    precio 
				FOR tarifa in ([pvp1],[pvp2],[pvp3],[pvp4],[pvp5])           
			) as p


			SELECT @count = COUNT(*) FROM @tableArticulo 


			INSERT INTO dbo.ArticuloFraccionado
				(   
				    codigo
				   ,unique_code
				   ,idArticulo
				   ,idMedida
				   ,conversion
				   ,precioCostoFraccionado
				   ,importacion
				   ,idEntidad
				   ,idUsuario
				 )
			SELECT 
				   'F'+Helper.F_Auto_Sequential(id+@sequential)
				   ,unique_code
				   ,idArticulo
				   ,idMedida
				   ,conversion
				   ,precioCostoFraccionado
				   ,importacion
				   ,@idEntidad
				   ,@idUsuario 
		    FROM @tableArticulo 

			INSERT INTO @tablaArticuloImport(idArticuloFraccionado,codFraccionado)
			SELECT idArticuloFraccionado,unique_code FROM dbo.ArticuloFraccionado WHERE idEntidad = @idEntidad 

			INSERT INTO dbo.ArticuloFraccionadoPvP
				(
			     idArticuloFraccionado
				,idTarifa
				,precioConIva
				,precioVenta
				,porcentajeUtilidad
				,fechaRegistro
				)
			SELECT 
				 ai.idArticuloFraccionado
				,ta.idTarifa
				,precioConIva = pvp.precio
				,precioVenta =  CONVERT(DECIMAL(20,5),pvp.precio / (ti.porcentaje / 100 + 1))
				,0
				,dbo.ufnGetDateEcuador()
			FROM @tablePvP pvp
			INNER JOIN @tablaArticuloImport ai ON ai.codFraccionado = pvp.codFraccionado
			INNER JOIN @tablaTarifa ta ON ta.codTarifa = pvp.codTarifa
			INNER JOIN dbo.TipoIva ti ON ti.idTipoIva = pvp.idTipoIva

			INSERT INTO Importaciones.Historial(idUsuario,idEntidad,modulo,cantidad,fechaRegistro)
			SELECT @idUsuario,@idEntidad,'/Almacen/ArticuloFraccionado',@count,dbo.ufnGetDateEcuador()


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
									,'/Importacion/ArticuloFraccionado'
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
