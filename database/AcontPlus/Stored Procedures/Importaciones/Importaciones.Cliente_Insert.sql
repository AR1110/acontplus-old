USE [AcontPlus]
GO
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
IF OBJECT_ID(N'Importaciones.Cliente_Insert', N'P') IS NOT NULL
DROP PROCEDURE Importaciones.Cliente_Insert 
GO
CREATE PROCEDURE Importaciones.Cliente_Insert @idRol INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET NOCOUNT ON;
	DECLARE @idUsuario INT
	DECLARE @idEntidad INT
	DECLARE @count INT
	DECLARE @table table 
	(
		id INT IDENTITY(1,1) NOT NULL
	   ,idSubContribuyente INT NOT NULL
	   ,idTipoIdentificacion INT NOT NULL
	   ,numeroIdentificacion VARCHAR(200) UNIQUE NOT NULL
	   ,nombreComercial VARCHAR(500) NOT NULL
	   ,nombreFiscal VARCHAR(500) NOT NULL
	   ,direccion VARCHAR(500) NULL
	   ,telefono VARCHAR(500) NULL
	   ,correo VARCHAR(500) NULL
	   ,importacion BIT DEFAULT 1 
	)


	SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM APP.UsuarioRol WHERE idUsuarioRol = @idRol

	
	INSERT @table (idSubContribuyente,idTipoIdentificacion,numeroIdentificacion,nombreComercial,nombreFiscal,telefono,correo,direccion)
	SELECT dt.idSubContribuyente,dt.idTipoIdentificacion,dt.numeroidentificacion,dt.nombreComercial,dt.nombreFiscal,dt.telefono,dt.correo,dt.direccion
	FROM OPENJSON(@json)
	WITH
	(
		idSubContribuyente   INT          '$.idSubContribuyente'
	   ,idTipoIdentificacion INT          '$.idTipoIdentificacion'
	   ,numeroIdentificacion VARCHAR(50)  '$.numeroIdentificacion'
	   ,nombreComercial      VARCHAR(500) '$.nombreComercial'
	   ,nombreFiscal         VARCHAR(500) '$.nombreFiscal'
	   ,direccion            VARCHAR(500) '$.direccion'
	   ,telefono             VARCHAR(500) '$.telefono'
	   ,correo               VARCHAR(500) '$.correo'
	) as dt

	SELECT @count = COUNT(*) FROM @table 

	BEGIN TRY
		BEGIN TRAN 
			INSERT INTO dbo.Cliente
				(idSubContribuyente
				,idTipoIdentificacion
				,numeroIdentificacion
				,nombreComercial
				,nombreFiscal
				,correo
				,direccion
				,telefono
				,importacion
				,fechaRegistro
				,idUsuario
				,idEntidad)
			SELECT	
				idSubContribuyente
				,idTipoIdentificacion
				,numeroIdentificacion
				,nombreComercial
				,nombreFiscal
				,correo
				,direccion
				,telefono
				,importacion
				,dbo.ufnGetDateEcuador()
				,@idUsuario
				,@idEntidad
			FROM @table 

			INSERT INTO Importaciones.Historial(idUsuario,idEntidad,modulo,cantidad,fechaRegistro)
			SELECT @idUsuario,@idEntidad,'/Ventas/Cliente',@count,dbo.ufnGetDateEcuador()

		COMMIT TRAN 
		SELECT '1' code, 'Clientes Importadas correctamente' as 'message'
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
									,'/ImportacionCliente'
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
