USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for update sustentos
-- Modified:    2025-05-21 - Improved date handling
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
		
		-- Validate that required date fields are not NULL or invalid formats
		DECLARE @isValidJson BIT = 1
		DECLARE @errorMessage VARCHAR(255) = ''
		
		-- Extract the date values to check if they're valid
		DECLARE @fechaEmisionDocSustento DATETIME2
		DECLARE @fechaRegistroContable DATETIME2
		
		-- Try to parse the dates, which will be NULL if they're empty or invalid
		SELECT 
			@fechaEmisionDocSustento = TRY_CONVERT(DATETIME2, JSON_VALUE(@json, '$.fechaEmisionDocSustento')),
			@fechaRegistroContable = TRY_CONVERT(DATETIME2, JSON_VALUE(@json, '$.fechaRegistroContable'))
		
		-- Start transaction only if validation passes
		BEGIN TRAN 
			
			UPDATE rds SET 
				rds.documentoSustentoTributarioId = t.documentoSustentoTributarioId 
				,rds.numDocSustento = REPLACE(t.numDocSustento, '-', '')
				,rds.fechaEmisionDocSustento = CASE 
					WHEN t.fechaEmisionDocSustento = '1900-01-01' THEN NULL 
					ELSE t.fechaEmisionDocSustento 
				END
				,rds.fechaRegistroContable = CASE 
					WHEN t.fechaRegistroContable = '1900-01-01' THEN NULL 
					ELSE t.fechaRegistroContable 
				END
				,rds.numAutDocSustento = t.numAutDocSustento
				,rds.pagoLocExt = t.pagoLocExt
				,rds.tipoRegimenFiscalExteriorId = t.tipoRegimenFiscalExteriorId
				,rds.paisEfecPago = t.paisEfecPago
				,rds.aplicConvDobTrib = t.aplicConvDobTrib
				,rds.pagExtSujRetNorLeg = t.pagExtSujRetNorLeg
				,rds.pagoRegFis = t.pagoRegFis
			 
			FROM FactElect.RetAtsDocSustento rds
			JOIN (
				SELECT 
					@id idRetAtsDocSustento, 
					documentoSustentoTributarioId, 
					numDocSustento, 
					ISNULL(TRY_CONVERT(DATETIME2, fechaEmisionDocSustento), '1900-01-01') AS fechaEmisionDocSustento, 
					ISNULL(TRY_CONVERT(DATETIME2, fechaRegistroContable), '1900-01-01') AS fechaRegistroContable, 
					numAutDocSustento, 
					pagoLocExt, 
					tipoRegimenFiscalExteriorId, 
					paisEfecPago, 
					aplicConvDobTrib, 
					pagExtSujRetNorLeg, 
					pagoRegFis
				FROM OPENJSON(@json) WITH(
					documentoSustentoTributarioId INT '$.documentoSustentoTributarioId'
					,numDocSustento VARCHAR(17) '$.numDocSustento'
					,fechaEmisionDocSustento NVARCHAR(30) '$.fechaEmisionDocSustento'
					,fechaRegistroContable NVARCHAR(30) '$.fechaRegistroContable'
					,numAutDocSustento VARCHAR(49) '$.numAutDocSustento'
					,pagoLocExt VARCHAR(2) '$.pagoLocExt'
					,tipoRegimenFiscalExteriorId INT '$.tipoRegi'
					,paisEfecPago VARCHAR(3) '$.paisEfecPago'
					,aplicConvDobTrib VARCHAR(2) '$.aplicConvDobTrib'
					,pagExtSujRetNorLeg VARCHAR(2) '$.pagExtSujRetNorLeg'
					,pagoRegFis VARCHAR(2) '$.pagoRegFis'
				)
			) t ON rds.idRetAtsDocSustento = t.idRetAtsDocSustento
			
			WHERE rds.idRetAtsDocSustento = @id
			
			UPDATE fc SET fc.retencion = 1
			FROM dbo.FacturaCompra fc
			JOIN (
				SELECT numAutDocSustento, numDocSustento 
				FROM FactElect.RetAtsDocSustento 
				WHERE idRetAtsDocSustento = @id
			) AS t ON fc.nroAutorizacion = t.numAutDocSustento 
				AND REPLACE(fc.puntoEmision,'-','')+Helper.F_Auto_Sequential(fc.nroDocumento) = t.numDocSustento
			
		COMMIT TRAN
        SELECT '1' code, 'Documento de sustento actualizado con exito' as 'message'
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