USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for update sustentos
-- =============================================

CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Update @userRoleId INT 
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @userId INT

	BEGIN TRY
        SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)

		BEGIN TRAN 
			
			UPDATE rds SET rds.documentoSustentoTributarioId = t.documentoSustentoTributarioId 
			,rds.numDocSustento = t.numDocSustento
			,rds.fechaEmisionDocSustento = t.fechaEmisionDocSustento
			,rds.fechaRegistroContable = t.fechaRegistroContable
			,rds.numAutDocSustento = t.numAutDocSustento
			,rds.pagoLocExt = t.pagoLocExt
			,rds.tipoRegimenFiscalExteriorId = t.tipoRegimenFiscalExteriorId
			,rds.paisEfecPago = t.paisEfecPago
			,rds.aplicConvDobTrib = t.aplicConvDobTrib
			,rds.pagExtSujRetNorLeg = t.pagExtSujRetNorLeg
			,rds.pagoRegFis = t.pagoRegFis
			 
			FROM FactElect.RetAtsDocSustento rds
			JOIN (SELECT @id idRetAtsDocSustento, documentoSustentoTributarioId, numDocSustento, fechaEmisionDocSustento, fechaRegistroContable, numAutDocSustento, pagoLocExt, tipoRegimenFiscalExteriorId, paisEfecPago, aplicConvDobTrib, pagExtSujRetNorLeg, pagoRegFis
			FROM OPENJSON(@json) WITH(documentoSustentoTributarioId INT '$.documentoSustentoTributarioId'
				,numDocSustento VARCHAR(15) '$.numDocSustento'
				,fechaEmisionDocSustento DATETIME2 '$.fechaEmisionDocSustento'
				,fechaRegistroContable DATETIME2 '$.fechaRegistroContable'
				,numAutDocSustento VARCHAR(49) '$.numAutDocSustento'
				,pagoLocExt VARCHAR(2) '$.pagoLocExt'
				,tipoRegimenFiscalExteriorId INT '$.tipoRegi'
				,paisEfecPago VARCHAR(3) '$.paisEfecPago'
				,aplicConvDobTrib VARCHAR(2) '$.aplicConvDobTrib'
				,pagExtSujRetNorLeg VARCHAR(2) '$.pagExtSujRetNorLeg'
				,pagoRegFis VARCHAR(2) '$.pagoRegFis'
			)) t ON rds.idRetAtsDocSustento = t.idRetAtsDocSustento
			
			WHERE rds.idRetAtsDocSustento = @id
			
			UPDATE fc SET fc.retencion = 1
			FROM dbo.FacturaCompra fc
			JOIN (
				SELECT numAutDocSustento, numDocSustento FROM FactElect.RetAtsDocSustento where idretencionAts = @id
			) AS t ON fc.nroAutorizacion = t.numAutDocSustento AND  REPLACE(fc.puntoEmision,'-','')+Helper.F_Auto_Sequential(fc.nroDocumento) = t.numDocSustento

			SELECT '1' code, 'Documento de sustento actualizado con exito'  as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
	    SELECT '0' code, 'Error en el procedimiento!' as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, idUsuario)
		VALUES ('DocSustento/Update', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId)
	END CATCH
END
GO
