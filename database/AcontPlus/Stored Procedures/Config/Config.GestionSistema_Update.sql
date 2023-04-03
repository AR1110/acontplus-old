USE [Acontplus]
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
IF OBJECT_ID(N'Config.GestionSistema_Update', N'P') IS NOT NULL
DROP PROCEDURE Config.GestionSistema_Update 
GO
CREATE PROCEDURE Config.GestionSistema_Update
	@idRol INT
   ,@id INT
   ,@idTipoIva INT
   ,@idCliente INT 
   ,@idArticulo INT
   ,@idMetodoValoracion INT 
   ,@llevaInventario VARCHAR(5)
   ,@searchCode INT 
   ,@printerAutomatic INT 
   ,@payAutomatic INT 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @nroIdentificacion VARCHAR(20)
	DECLARE @codigoPorcentaje INT
	DECLARE @codMetodoValoracion VARCHAR(5)
	DECLARE @codArticulo VARCHAR(20)
	DECLARE @idUsuario INT

	SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT TOP 1 @codigoPorcentaje = codigoPorcentaje FROM dbo.TipoIva WITH (NOLOCK) WHERE idTipoIva = @idTipoIva

	SELECT TOP 1 @codMetodoValoracion = codigo FROM Inventario.MetodoValoracion WITH (NOLOCK) WHERE idMetodoValoracion = @idMetodoValoracion

	SELECT TOP 1 @codArticulo = codigo FROM dbo.Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo

	BEGIN TRY
		BEGIN TRAN 
			UPDATE Config.GestionSistema SET 
				idTipoIva = @idTipoIva
			   ,idMetodoValoracion = IIF(@idMetodoValoracion = 0, NULL,@idMetodoValoracion)
			   ,idCliente = IIF(@idCliente = 0,NULL,@idCliente)
			   ,idArticulo = IIF(@idArticulo = 0,NULL,@idArticulo)
			   ,llevaInventario = UPPER(@llevaInventario)
			   ,codigoPorcentaje = @codigoPorcentaje
			   ,nroIdentificacion = @nroIdentificacion
			   ,codArticulo = @codArticulo
			   ,codMetodoValoracion = @codMetodoValoracion
			   ,searchCode = @searchCode
			   ,printerAutomatic  = @printerAutomatic 
			   ,payAutomatic = @payAutomatic 
			WHERE idGestionSistema = @id
		COMMIT TRAN 
		SELECT '1' code,'Actualizado Correctamente' as 'message'
		RETURN 
	END TRY 
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos' as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
