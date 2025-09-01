USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-03-02
-- Description: sp for cancel in sri retencion ats
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.RetencionAts_Cancel @userRoleId INT,@id INT 
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @idUsuario INT
	       ,@idRetencionAts INT
           ,@idEstadoServicio INT
           ,@idEstadoPago INT

	BEGIN TRY
        
        SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 6

        SELECT TOP 1 @idRetencionAts = idRetencionAts FROM FactElect.RetencionAts WITH (NOLOCK) WHERE idDocumentoElectronico = @id

        SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'A'

        --> Validacion de Informacion
        IF EXISTS (SELECT 1 FROM [FactElect].[v_DocElectronico] WITH (NOLOCK) WHERE idDocumentoElectronico = @id AND codEstado != 4)
            BEGIN
                SELECT '0'code, 'El Documento no esta Autorizado no puede ser Anulado' as 'message'
                RETURN 
            END

        IF EXISTS (SELECT 1 FROM v_CuentaPorPagar WITH (NOLOCK) WHERE codDoc = '07' AND codEstado != 'APL' AND idDocumento = @id)
            BEGIN
                SELECT '0'code, 'El Documento tiene movimientos financieros o esta Anulado' as 'message'
                RETURN 
            END

		BEGIN TRAN 
			
            --> ANULA EN DOCUMENTO ELECTRONICO
			UPDATE DocumentoElectronico SET idEstadoServicio = @idEstadoServicio WHERE idDocumentoElectronico = @id

            UPDATE Contabilidad.CuentaPorPagar SET idEstadoPago = @idEstadoPago WHERE codDoc = '07' AND idDocumento = @idRetencionAts
			
            UPDATE FactElect.RetencionAts SET anuladaSri = 1 WHERE idRetencionAts = @idRetencionAts

			UPDATE FactElect.RetAtsDocSustento SET estado = 0 WHERE idRetencionAts = @idRetencionAts


			--ANULA EN FACTURA
			UPDATE fc SET fc.retencion = 0
			FROM FacturaCompra fc
			JOIN 
            (
				SELECT numAutDocSustento, numDocSustento FROM FactElect.RetAtsDocSustento WHERE idRetencionAts = @idRetencionAts

			) AS t ON fc.nroAutorizacion = t.numAutDocSustento
			AND REPLACE(fc.puntoEmision,'-','')+Helper.F_Auto_Sequential(fc.nroDocumento) = t.numDocSustento


		COMMIT TRAN
        SELECT '1' code, 'Retencion anulada en el SRI con exito'  as 'message'
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN;
		    END

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/RetencionAts/Delete',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT '0' code,'Info: Error en el procedimiento ' as 'message'
	END CATCH
END
GO