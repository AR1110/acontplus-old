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
-- Author:		Alexis Ramirez
-- Create date: 03/16/2023
-- Description:	SP para dar de baja a las compra
-- =============================================
IF OBJECT_ID(N'Compra.Documento_Ingreso_Update_Cancel', N'P') IS NOT NULL
DROP PROCEDURE Compra.Documento_Ingreso_Update_Cancel
GO
CREATE PROCEDURE Compra.Documento_Ingreso_Update_Cancel @idUsuarioRol INT, @idDocumentoIngreso INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	--=============Datos capturados desde BD===========================
	DECLARE @idUsuario AS INT
	DECLARE @idEntidad AS INT

	--===========Datos para la validacion de informacion===============
	DECLARE @uniqueId AS VARCHAR(20)

	--==============Parametros para el area de contabilidad============
	DECLARE @idEstado AS INT
	DECLARE @idEstadoPago AS INT
	DECLARE @codPago AS VARCHAR(5)
	

	--==============Parametros para el Area de Inventario==============
	DECLARE @inventory AS VARCHAR(5)

	BEGIN TRY 
		
		----======================================Recuperar datos de las Tablas===========================================================
		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo  = 'A'

		SELECT TOP 1 @idUsuario = idUsuario, @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @inventory = llevaInventario FROM Config.GestionSistema WITH (NOLOCK) WHERE idEntidad = @idEntidad

		SELECT TOP 1 @uniqueId = uniqueId FROM Compra.Documento_Ingreso WITH (NOLOCK) WHERE idDocumentoIngreso = @idDocumentoIngreso
		
		SELECT TOP 1 @idEstado = idEstadoPago FROM Contabilidad.CuentaPorPagar WITH (NOLOCK) WHERE uniqueId = @uniqueId

		SELECT TOP 1 @codPago = codigo FROM dbo.EstadoPago WITH (NOLOCK) WHERE idEstadoPago = @idEstado

		--==================================Validacion de la informacion============================================================

		IF @codPago = 'PE'
			BEGIN 
				SELECT '0' code,'El Documento tiene un proceso contable no puede ser editado' as 'message'
				RETURN  
			END 

		BEGIN TRAN 
			--============================================================Administracion=========================================================================================
			UPDATE Compra.Documento_Ingreso SET estado = 0 WHERE idDocumentoIngreso = @idDocumentoIngreso

			UPDATE Compra.Documento_Ingreso_Detail SET estado = 0 WHERE idDocumentoIngreso = @idDocumentoIngreso

			UPDATE Compra.Documento_Ingreso_Taxes SET estado = 0 WHERE idDocumentoIngreso = @idDocumentoIngreso


			--==============================================================Inventario============================================================================================
			IF @inventory = 'SI'
				BEGIN 
					
					INSERT INTO Inventario.ControlStock
						  (idTipoDocumento,idDocumento,idArticulo,idBodega)
					SELECT idTipoDocumento = 1,d.idDocumentoIngreso,d.idArticulo,d.idBodega 
					FROM Compra.Documento_Ingreso_Detail d WITH (NOLOCK)
					INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = d.idArticulo
					WHERE d.idDocumentoIngreso = @idDocumentoIngreso AND ar.llevaInventario = 1
				END 

			 DELETE FROM Compra.Documento_Ingreso_Detail WHERE estado = 0 AND idDocumentoIngreso = @idDocumentoIngreso

			 --===========================================================Contabilidad=================================================================================================
			UPDATE Contabilidad.CuentaPorPagar SET idEstadoPago = @idEstadoPago, abono = 0 WHERE uniqueId = @uniqueId


		COMMIT TRAN 
		SELECT '0' code,'Anulado Correctamente' as 'message'
		RETURN
	END TRY 

	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'DocumentoIngreso/PutCancel', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 


END
GO
