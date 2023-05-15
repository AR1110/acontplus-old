


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
-- Author:		Emilio Senguana
-- Create date: 15/05/2023
-- Description:	 
-- =============================================
IF OBJECT_ID(N'Recepcion.Dato_Adicional_Articulo_Delete', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Dato_Adicional_Articulo_Delete
GO
CREATE PROCEDURE Recepcion.Dato_Adicional_Articulo_Delete
	@idUsuarioRol AS INT
   ,@idInfoAdicional INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idUsuario INT = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
	BEGIN TRY		
		BEGIN TRAN
			IF EXISTS(SELECT 1 FROM Ventas.HistoryInfoAdicional WHERE idInfoAdicional = @idInfoAdicional)	
				BEGIN 
					SELECT '0'code, 'La etiqueta está asociada a una factura o nota de entrega, por eso no puedes borrar.' as 'message'
					RETURN
				END 

			DELETE FROM Compra.InfoAdicional WHERE idInfoAdicional = @idInfoAdicional
		COMMIT TRAN 
		SELECT '1' code,'Eliminado Correctamente' as 'message'
		RETURN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0'code,'Info: Error en el procedimiento : ' + ERROR_MESSAGE() as 'message'
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
									,'/DatoAdicionalArticulo/Delete'
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
