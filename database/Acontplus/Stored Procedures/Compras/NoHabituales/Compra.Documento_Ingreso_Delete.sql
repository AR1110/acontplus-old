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
CREATE OR ALTER PROCEDURE Compra.Documento_Ingreso_Delete @userRoleId INT ,@id INT 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    DECLARE @idEstadoPago INT ,@idUsuario INT ,@idEntidad INT ,@uniqueId VARCHAR(150)

	BEGIN TRY 
		
		--> Recuperanado informacion
		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo  = 'A'

		SELECT TOP 1 @idUsuario = idUsuario, @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

		SELECT TOP 1 @uniqueId = uniqueId  FROM Compra.Documento_Ingreso WITH (NOLOCK) WHERE idDocumentoIngreso = @id


		--> Validando Informacion 
		IF EXISTS (SELECT 1 FROM v_CuentaPorPagar WITH (NOLOCK) WHERE codDoc = 'DH' AND codEstado != 'PE' AND idDocumento = @id)
            BEGIN
                SELECT [Common].[ufnSpResponse]('0','El Documento tiene movimientos financieros o esta Anulado',DEFAULT)
                RETURN 
            END
		

		BEGIN TRAN 
			
			UPDATE Compra.Documento_Ingreso SET estado = 0 WHERE idDocumentoIngreso = @id

            UPDATE Contabilidad.CuentaPorPagar SET idEstadoPago = @idEstadoPago, abono = 0 WHERE uniqueId = @uniqueId

			UPDATE Compra.InfoAdicional SET estado = 0 WHERE  uniqueId = @uniqueId

			--> Inventario
			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
				BEGIN 
					
                    IF EXISTS (SELECT 1 FROM Inventario.v_Articulo_Transaccion WHERE idDocumento = @id AND codDoc = 'IV' AND codTransaccion = 'E' AND estado = 1)
                        BEGIN 
                            DECLARE @idTipoDocumento INT ,@idTipoTransaccion INT 

                            SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'IV'

                            SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'E'
                            
                            UPDATE Inventario.Transaccion WITH (ROWLOCK) SET estado = 0 WHERE idTipoTransaccion = @idTipoTransaccion AND idTipoDocumento = idTipoDocumento AND idDocumento = @id

                            EXEC dbo.Transaccion_Handler_Init 'E', 'IV', @id ,3
				        END
				END 

		COMMIT TRAN 
		SELECT [Common].[ufnSpResponse]('1','Anulado Correctamente',DEFAULT) 
	END TRY 

	BEGIN CATCH
		IF (@@TRANCOUNT > 0)
            BEGIN 
			    ROLLBACK TRAN
            END 

        SELECT [Common].[ufnSpResponse]('0','Info: Error en el procedimiento',DEFAULT)

		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'DocumentoIngreso/Delete', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	    
    END CATCH 


END
GO
