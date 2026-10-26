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

CREATE OR ALTER PROCEDURE Recepcion.Documento_Delete @userRoleId INT ,@idDocumento INT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	
    DECLARE @idUsuario INT 
    
    --> Contabilidad 
    DECLARE @codDoc VARCHAR(10) ,@idEstadoPago INT ,@numAutDocSustento NVARCHAR(50)

	
	BEGIN TRY
        --> Variables
        SELECT TOP 1 @idUsuario = idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @codDoc = ISNULL(codDoc,'00') ,@numAutDocSustento = claveAcceso FROM Recepcion.DocumentoRecibido  WHERE idDocumento = @idDocumento

        IF EXISTS (SELECT 1 FROM Recepcion.DocumentoRecibido WHERE idDocumento = @idDocumento AND estado = 1)
            BEGIN 
                SELECT TOP 1 @idEstadoPago = idEstadoPago FROM EstadoPago WITH (NOLOCK) WHERE codigo = 'A'
            END
        ELSE
            BEGIN
                SELECT TOP 1 @idEstadoPago = idEstadoPago FROM EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'
            END 

        --> Validaciones
        IF @codDoc IN ('04','01')
            BEGIN
                 IF EXISTS (SELECT 1 FROM Recepcion.DocumentoRecibido WHERE complete = 1 AND inventarioAnulado = 0 AND idDocumento = @idDocumento)
                    BEGIN
                        SELECT '0' code, 'Este Documento tiene un proceso de inventario no puede ser anulado' as 'message'
				        RETURN
                    END 

                IF EXISTS (SELECT 1 FROM v_CuentaPorPagar WITH (NOLOCK) WHERE codDoc = @codDoc AND idDocumento = @idDocumento AND codEstado NOT IN ('PE','A'))
                    BEGIN
                        SELECT '0' code, 'Este Documento se encuentra ' + estado + ' no puede ser anulado' as 'message'
                        FROM v_CuentaPorPagar
                        WHERE uniqueId = @numAutDocSustento 
				        RETURN
			         END

                IF @codDoc = '01'
                    BEGIN
                        IF EXISTS (SELECT 1 FROM FactElect.RetencionAts            rt WITH (NOLOCK)
                                            INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = rt.idDocumentoElectronico
			                                INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts         = rt.idRetencionAts
			                                WHERE ds.numAutDocSustento = @numAutDocSustento
				                                AND rt.anuladaSri = 0 
                                                AND ds.estado = 1)
                            BEGIN
                                SELECT '0' code, 'Documento vinculado al comprobante de retención Nro.' + de.serieComprobante  as 'message'
			                    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
                                INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = rt.idDocumentoElectronico
			                    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts         = rt.idRetencionAts
			                    WHERE ds.numAutDocSustento = @numAutDocSustento
				                    AND rt.anuladaSri = 0 
                                    AND ds.estado = 1
				                RETURN
			                END
                    END 
            END 

        IF @codDoc IN ('07')
            BEGIN
                IF EXISTS (SELECT 1 FROM v_CuentaPorCobrar WITH (NOLOCK) WHERE codDoc = '07' AND idDocumento = @idDocumento AND codEstado NOT IN ('PE','A'))
                    BEGIN
				        SELECT '0' code, 'Este documento se encuentra aplicado a un cobro, no puede ser anulado' as 'message'
				        RETURN
			        END
            END

		BEGIN TRAN
            UPDATE Recepcion.DocumentoRecibido SET estado =  IIF(estado = 1, 0, 1), fechaEdicion = GETDATE() ,idUsuarioEdicion = @idUsuario WHERE idDocumento = @idDocumento

            IF @codDoc IN ('04','01')
                BEGIN
                    IF EXISTS (SELECT 1 FROM v_CuentaPorPagar WITH (NOLOCK) WHERE codDoc = @codDoc AND idDocumento = @idDocumento)
                        BEGIN
                            UPDATE Contabilidad.CuentaPorPagar SET idEstadoPago = @idEstadoPago WHERE codDoc = @codDoc AND idDocumento = @idDocumento
			            END
                END 

            IF @codDoc IN ('07')
                BEGIN
                    IF EXISTS (SELECT 1 FROM v_CuentaPorCobrar WITH (NOLOCK) WHERE codDoc = '07' AND idDocumento = @idDocumento)
                        BEGIN
                             UPDATE Contabilidad.CuentaPorCobrar SET idEstadoPago = @idEstadoPago WHERE codDoc = @codDoc AND idDocumento = @idDocumento
			            END
                END 

            IF @codDoc IN ('00')
                BEGIN
                    DELETE FROM Recepcion.DocumentoImpuesto WHERE DocumentoRecibidoId = @idDocumento
			
                    DELETE FROM Recepcion.DocumentoRecibido WHERE idDocumento = @idDocumento
                END

		COMMIT TRAN
        SELECT '1' code, 'Anulado Exitosamente' as 'message'
	END TRY

	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
  		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'DocumentoRecibido/Delete', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END
