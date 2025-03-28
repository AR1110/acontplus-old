USE AcontPlus
GO
/****** Object:  StoredProcedure [Recepcion].[ASPComprobanteImportacionInsert]    Script Date: 8/4/2022 9:30:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-10-31
-- Description:	SP PARA ELIMINAR LOS COMPROBANTES ELECTRONICOS DEL SRI
-- =============================================

CREATE OR ALTER PROCEDURE Recepcion.Documento_Delete @userRoleId INT
,@idDocumento INT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	
    DECLARE @idUsuario INT 
    
    --> Contabilidad 
    DECLARE @codDoc VARCHAR(10) ,@idEstadoPago INT 

	
	BEGIN TRY
        --> Variables
        SELECT TOP 1 @idUsuario = idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @codDoc = ISNULL(codDoc,'00') FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE idDocumento = @idDocumento

        SELECT TOP 1 @idEstadoPago = idEstadoPago FROM EstadoPago WITH (NOLOCK) WHERE codigo = 'A'

        IF EXISTS(SELECT 1 FROM Recepcion.DocumentoRecibido WHERE idDocumento = @idDocumento AND complete = 1)
			 BEGIN
				SELECT '0' code, 'Imposible eliminar, este archivo ya ha sido importado' as 'message'
				RETURN
			 END

        IF @codDoc IN ('04','01')
            BEGIN
                IF EXISTS (SELECT 1 FROM v_CuentaPorPagar WITH (NOLOCK) WHERE codDoc = @codDoc AND idDocumento = @idDocumento AND codEstado NOT IN ('A'))
                    BEGIN
				        SELECT '0' code, 'Esta Documento tiene un proceso contable no puede ser eliminado' as 'message'
				        RETURN
			         END
            END 

        IF @codDoc IN ('07')
            BEGIN
                IF EXISTS (SELECT 1 FROM v_CuentaPorCobrar WITH (NOLOCK) WHERE codDoc = '07' AND idDocumento = @idDocumento AND codEstado NOT IN ('PE'))
                    BEGIN
				        SELECT '0' code, 'Esta Documento tiene un proceso contable no puede ser eliminado' as 'message'
				        RETURN
			         END
            END 
        

		BEGIN TRAN
            IF @codDoc IN ('04','01')
                BEGIN
                    IF EXISTS (SELECT 1 FROM v_CuentaPorPagar WITH (NOLOCK) WHERE codDoc = @codDoc AND idDocumento = @idDocumento)
                        BEGIN
				            UPDATE Recepcion.DocumentoRecibido SET estado = 0 WHERE idDocumento = @idDocumento
			
                            UPDATE Contabilidad.CuentaPorPagar SET idEstadoPago = @idEstadoPago WHERE codDoc = @codDoc AND idDocumento = @idDocumento
			             END
                END 

            IF @codDoc IN ('07')
                BEGIN
                    IF EXISTS (SELECT 1 FROM v_CuentaPorCobrar WITH (NOLOCK) WHERE codDoc = '07' AND idDocumento = @idDocumento)
                        BEGIN
				             UPDATE Recepcion.DocumentoRecibido SET estado = 0 WHERE idDocumento = @idDocumento

                             UPDATE Contabilidad.CuentaPorCobrar SET idEstadoPago = @idEstadoPago WHERE codDoc = @codDoc AND idDocumento = @idDocumento
			             END
                END 

            IF @codDoc IN ('00')
                BEGIN
                    DELETE FROM Recepcion.DocumentoImpuesto WHERE DocumentoRecibidoId = @idDocumento
			
                    DELETE FROM Recepcion.DocumentoRecibido WHERE idDocumento = @idDocumento
                END

		COMMIT TRAN
        SELECT '1' code, 'Eliminado Exitosamente' as 'message'
	END TRY

	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
  		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'DocumentoRecibido/Delete', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END
