USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for insert sustentos
-- =============================================

CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Insert @userRoleId INT  
,@idRetencionAts INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idUsuario INT

	BEGIN TRY
        SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId)


		BEGIN TRAN 
			
			INSERT INTO FactElect.RetAtsDocSustento(idRetencionAts, uniqueIdDoc, documentoSustentoTributarioId
			, numDocSustento, fechaEmisionDocSustento, fechaRegistroContable
			, numAutDocSustento, pagoLocExt, tipoRegimenFiscalExteriorId, paisEfecPago, aplicConvDobTrib, pagExtSujRetNorLeg, pagoRegFis
			, totalComprobantesReembolso, totalBaseImponibleReembolso, totalImpuestoReembolso, totalSinImpuestos, importeTotal)

			SELECT @idRetencionAts idRetencionAts, uniqueIdDoc, documentoSustentoTributarioId
			, numDocSustento, fechaEmisionDocSustento, fechaRegistroContable
			, numAutDocSustento, pagoLocExt, tipoRegimenFiscalExteriorId, paisEfecPago, aplicConvDobTrib, pagExtSujRetNorLeg, pagoRegFis
			, totalComprobantesReembolso, totalBaseImponibleReembolso, totalImpuestoReembolso, totalSinImpuestos, importeTotal
			FROM OPENJSON(@json) WITH (uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc'
								,documentoSustentoTributarioId INT '$.documentoSustentoTributarioId'
								,numDocSustento VARCHAR(15) '$.numDocSustento'
								,fechaEmisionDocSustento DATETIME '$.fechaEmisionDocSustento'
								,fechaRegistroContable DATETIME '$.fechaRegistroContable'
								,numAutDocSustento VARCHAR(49) '$.numAutDocSustento'
								,pagoLocExt VARCHAR(2) '$.pagoLocExt'
								,tipoRegimenFiscalExteriorId INT '$.tipoRegi'
								,paisEfecPago VARCHAR(3) '$.paisEfecPago'
								,aplicConvDobTrib VARCHAR(2) '$.aplicConvDobTrib'
								,pagExtSujRetNorLeg VARCHAR(2) '$.pagExtSujRetNorLeg'
								,pagoRegFis VARCHAR(2) '$.pagoRegFis'
								,totalComprobantesReembolso NUMERIC(18,5) '$.totalComprobantesReembolso'
								,totalBaseImponibleReembolso NUMERIC(18,5) '$.totalBaseImponibleReembolso'
								,totalImpuestoReembolso NUMERIC(18,5) '$.totalImpuestoReembolso'
								,totalSinImpuestos NUMERIC(18,5) '$.totalSinImpuestos'
								,importeTotal NUMERIC(18,5) '$.importeTotal'
			) 

			SELECT '1' code, 'Documento de sustento guardado con exito'  as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
	SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/POST', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
