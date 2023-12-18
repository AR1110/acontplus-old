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
IF OBJECT_ID(N'FactElect.RetAts_Doc_Sust_Update', N'P') IS NOT NULL
DROP PROCEDURE FactElect.RetAts_Doc_Sust_Update
GO
CREATE PROCEDURE FactElect.RetAts_Doc_Sust_Update @idUsuarioRol INT 
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idUsuario INT

	--DECLARE @tblDocs AS TABLE(
	--	uniqueIdDoc UNIQUEIDENTIFIER NOT NULL
	--	,codSustento VARCHAR(2) NULL
	--	,codDocSustento VARCHAR(2) NULL
	--	,numDocSustento VARCHAR(15) NULL
	--	,fechaEmisionDocSustento DATE NOT NULL
	--	,fechaRegistroContable DATE NULL
	--	,numAutDocSustento VARCHAR(49) NULL
	--	,pagoLocExt VARCHAR(2) NULL
	--	,tipoRegi VARCHAR(2) NULL
	--	,paisEfecPago VARCHAR(3) NULL
	--	,aplicConvDobTrib VARCHAR(2) NULL
	--	,pagExtSujRetNorLeg VARCHAR(2) NULL
	--	,pagoRegFis VARCHAR(2) NULL
	--	,totalComprobantesReembolso NUMERIC(18,5) NULL
	--	,totalBaseImponibleReembolso NUMERIC(18,5) NULL
	--	,totalImpuestoReembolso NUMERIC(18,5) NULL
	--	,totalSinImpuestos NUMERIC(18,5) NOT NULL
	--	,importeTotal NUMERIC(18,5) NOT NULL
	--)
	SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
	BEGIN TRY
		BEGIN TRAN 

			--INSERT INTO @tblDocs(uniqueIdDoc, codSustento, codDocSustento, numDocSustento, fechaEmisionDocSustento, fechaRegistroContable, numAutDocSustento, pagoLocExt, tipoRegi, paisEfecPago, aplicConvDobTrib, pagExtSujRetNorLeg, pagoRegFis, totalComprobantesReembolso, totalBaseImponibleReembolso, totalImpuestoReembolso, totalSinImpuestos, importeTotal)
			
			UPDATE rds SET rds.codSustento = t.codSustento
			,rds.codDocSustento = t.codDocSustento
			,rds.numDocSustento = t.numDocSustento
			,rds.fechaEmisionDocSustento = t.fechaEmisionDocSustento
			,rds.fechaRegistroContable = t.fechaRegistroContable
			,rds.numAutDocSustento = t.numAutDocSustento
			,rds.pagoLocExt = t.pagoLocExt
			,rds.tipoRegi = t.tipoRegi
			,rds.paisEfecPago = t.paisEfecPago
			,rds.aplicConvDobTrib = t.aplicConvDobTrib
			,rds.pagExtSujRetNorLeg = t.pagExtSujRetNorLeg
			,rds.pagoRegFis = t.pagoRegFis
			--,rds.totalComprobantesReembolso = t.totalComprobantesReembolso
			--,rds.totalBaseImponibleReembolso = t.totalBaseImponibleReembolso
			--,rds.totalImpuestoReembolso = t.totalImpuestoReembolso
			--,rds.totalSinImpuestos = t.totalSinImpuestos
			--,rds.importeTotal = t.importeTotal
			 
			FROM FactElect.RetAtsDocSustento rds
			JOIN (SELECT @id idRetAtsDocSustento, codSustento, codDocSustento, numDocSustento, fechaEmisionDocSustento, fechaRegistroContable, numAutDocSustento, pagoLocExt, tipoRegi, paisEfecPago, aplicConvDobTrib, pagExtSujRetNorLeg, pagoRegFis--, totalComprobantesReembolso, totalBaseImponibleReembolso, totalImpuestoReembolso, totalSinImpuestos, importeTotal
			FROM OPENJSON(@json) WITH( codSustento VARCHAR(2) '$.codSustento'
				,codDocSustento VARCHAR(2) '$.codDocSustento'
				,numDocSustento VARCHAR(15) '$.numDocSustento'
				,fechaEmisionDocSustento DATETIME '$.fechaEmisionDocSustento'
				,fechaRegistroContable DATETIME '$.fechaRegistroContable'
				,numAutDocSustento VARCHAR(49) '$.numAutDocSustento'
				,pagoLocExt VARCHAR(2) '$.pagoLocExt'
				,tipoRegi VARCHAR(2) '$.tipoRegi'
				,paisEfecPago VARCHAR(3) '$.paisEfecPago'
				,aplicConvDobTrib VARCHAR(2) '$.aplicConvDobTrib'
				,pagExtSujRetNorLeg VARCHAR(2) '$.pagExtSujRetNorLeg'
				,pagoRegFis VARCHAR(2) '$.pagoRegFis'
				--,totalComprobantesReembolso NUMERIC(18,5) '$.totalComprobantesReembolso'
				--,totalBaseImponibleReembolso NUMERIC(18,5) '$.totalBaseImponibleReembolso'
				--,totalImpuestoReembolso NUMERIC(18,5) '$.totalImpuestoReembolso'
				--,totalSinImpuestos NUMERIC(18,5) '$.totalSinImpuestos'
				--,importeTotal NUMERIC(18,5) '$.importeTotal'
			)) t ON rds.idRetAtsDocSustento = t.idRetAtsDocSustento
			
			WHERE rds.idRetAtsDocSustento = @id

			
			UPDATE fc SET fc.retencion = 1
			FROM FacturaCompra fc
			JOIN (
				SELECT numAutDocSustento, numDocSustento FROM FactElect.RetAtsDocSustento where idretencionAts = @id
			) AS t ON fc.nroAutorizacion = t.numAutDocSustento AND  REPLACE(fc.puntoEmision,'-','')+Helper.F_Auto_Sequential(fc.nroDocumento) = t.numDocSustento


			SELECT '1' code, 'Documento de sustento actualizado con exito'  as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
	SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/UPDATE', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
