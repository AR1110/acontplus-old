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
IF OBJECT_ID(N'FactElect.RetencionAts_Cancel', N'P') IS NOT NULL
DROP PROCEDURE FactElect.RetencionAts_Cancel 
GO
CREATE PROCEDURE FactElect.RetencionAts_Cancel @idRol INT,@id INT 
AS
BEGIN
	SET NOCOUNT ON; 
	DECLARE @idUsuario INT
	,@idRetencionAts INT
	SELECT @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idRol
	SET @idRetencionAts = (select idDocumento from DocumentoElectronico with (nolock) where idDocumentoElectronico = @id)
	BEGIN TRY
		BEGIN TRAN 
			
			UPDATE FactElect.RetencionAts SET anuladaSri = 1 WHERE idRetencionAts = @idRetencionAts
			UPDATE FactElect.RetAtsDocSustento SET estado = 0 WHERE idRetencionAts = @idRetencionAts
			--ANULA EN FACTURA
			UPDATE fc SET fc.retencion = 0
			FROM FacturaCompra fc
			JOIN (
				SELECT numAutDocSustento, numDocSustento FROM FactElect.RetAtsDocSustento WHERE idRetencionAts = @idRetencionAts
			) AS t ON fc.nroAutorizacion = t.numAutDocSustento
			AND  REPLACE(fc.puntoEmision,'-','')+Helper.F_Auto_Sequential(fc.nroDocumento) = t.numDocSustento

			--ANULA EN PAGOS
			IF EXISTS(SELECT 1 FROM Pago p WITH(NOLOCK) INNER JOIN TipoDocumento td WITH(NOLOCK) ON p.idTipoDocumento = td.idTipoDocumento  
								WHERE td.codigo = 'RC' AND p.idComprobante = @idRetencionAts AND p.versionComp = '2.0.0')
				BEGIN
					UPDATE p SET p.estado = 0 FROM Pago p WITH(NOLOCK) INNER JOIN TipoDocumento td WITH(NOLOCK) ON p.idTipoDocumento = td.idTipoDocumento
					WHERE p.idComprobante = @idRetencionAts 
					AND td.codigo = 'RC' AND p.versionComp = '2.0.0'
				END

			--ANULA EN DOCUMENTO ELECTRONICO
			UPDATE DocumentoElectronico SET codEstado = 6 WHERE idDocumentoElectronico = @id

			SELECT '1' code, 'Retencion anulada en el SRI con exito'  as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
	SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/CANCEL', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO