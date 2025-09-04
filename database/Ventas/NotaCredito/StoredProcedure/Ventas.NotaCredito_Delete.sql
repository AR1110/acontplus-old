USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[NotaCredito_Delete]    Script Date: 12/9/2022 9:36:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.NotaCredito_Delete @idUsuarioRol int,@id int 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET LANGUAGE SPANISH;

	-- GLOBAL
	DECLARE @idEntidad INT, @idUsuario INT 

     -- Venta 
    DECLARE @idFactura INT 

    -- Contabilidad
    DECLARE @idEstadoPago INT

    --> Fact.Elect
    DECLARE @idEstadoServicio INT ,@idDocumentoElectronico INT

	BEGIN TRY 
        -- Recuperando Variables
		SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM EstadoPago WITH (NOLOCK) WHERE codigo = 'A'

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 6

		SELECT TOP 1 @idFactura = idFactura, @idDocumentoElectronico = idDocumentoElectronico FROM NotaCredito WITH (NOLOCK) WHERE idNotaCredito = @id

		-- Validacion de Informacion
        IF EXISTS (SELECT 1 FROM Ventas.v_NotaCredito WITH (NOLOCK) WHERE idNotaCredito = @id AND codServicio NOT IN(4))
            BEGIN
                SELECT '0'code, 'El Documento no esta Autorizado no puede ser Anulado' as 'message'
                RETURN 
            END

		IF EXISTS (SELECT 1 FROM Ventas.v_NotaCredito WITH (NOLOCK) WHERE idNotaCredito = @id AND codCuenta NOT IN('PE'))
            BEGIN
                SELECT '0'code, 'El Documento tiene movimientos financieros o esta Anulado' as 'message'
                RETURN 
            END

		BEGIN TRAN 

			UPDATE dbo.DocumentoElectronico WITH (ROWLOCK) SET idEstadoServicio = @idEstadoServicio WHERE idDocumentoElectronico = @idDocumentoElectronico
           
            UPDATE NotaCredito WITH (ROWLOCK) SET idUsuario = @idUsuario,lastChange = dbo.ufnGetDateEcuador() ,estado = 0 WHERE idNotaCredito = @id

			UPDATE Factura WITH (ROWLOCK) SET notaCredito = 0 WHERE idFactura = @idFactura

            UPDATE Contabilidad.CuentaPorCobrar WITH (ROWLOCK) SET idEstadoPago = @idEstadoPago WHERE idDocumento = @id AND codDoc = '04' 

			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
				BEGIN
                    DECLARE @idTipoDocumento INT ,@idTipoTransaccion INT ,@idTransaccion INT

                    SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'NC'

                    SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'S'
                            
                    SELECT TOP 1 @idTransaccion = idTransaccion FROM Inventario.Transaccion WHERE idTipoTransaccion = @idTipoTransaccion AND idTipoDocumento = @idTipoDocumento AND idDocumento = @id

                    --> Transaccion
                    UPDATE Inventario.Transaccion WITH (ROWLOCK) SET estado = 0 WHERE idTransaccion = @idTransaccion

                    UPDATE Inventario.TransaccionDetalle WITH (ROWLOCK) SET estado = 0 WHERE idTransaccion = @idTransaccion

                    EXEC dbo.Transaccion_Handler_Init 'S', 'NC', @id ,3
				        
				END  
				
		COMMIT TRAN 
		SELECT '1'code,'Documento Anulado'as 'message',''
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END

		INSERT INTO ErroresSistema
		    (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/NotaCredito/Delete',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
	    
        SELECT '0' as code,'Info: Error en el procedimiento ' as 'message', 'Nota de Credito'
    END CATCH 
END
