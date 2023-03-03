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
-- Create date: 3/01/2023
-- Description:	SP para leer el xml de documentos recibidos
-- =============================================
IF OBJECT_ID(N'FactElect.Doc_Relac_Serv_Insert', N'P') IS NOT NULL
DROP PROCEDURE FactElect.Doc_Relac_Serv_Insert
GO
CREATE PROCEDURE FactElect.Doc_Relac_Serv_Insert
	@idDocumento INT
   ,@codDoc VARCHAR(5)
   ,@versionComp VARCHAR(10)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @tmp as Table(
		xmlComp xml
	)


	DECLARE @DocumentoRelacionado AS TABLE(
		codDocSustento VARCHAR(5),
		numDocSustento VARCHAR(25),
		fechaEmisionDocSustento VARCHAR(100),
		codigo VARCHAR(5),
		baseImponible NUMERIC(18,2),
		porcentajeRetener NUMERIC(18,2),
		valorRetenido NUMERIC(18,2)
	)

	BEGIN TRY 
		BEGIN TRAN 
			INSERT INTO @tmp(xmlComp)
			SELECT  xmlComp = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante'))))
			FROM Recepcion.DocumentoRecibido ci
			where CI.idDocumento = @idDocumento

			IF @codDoc = '07' 
				BEGIN 
					DECLARE @mainRet AS TABLE(retenciones XML)


					INSERT INTO @mainRet (retenciones)
					SELECT CASE WHEN @versionComp = '1.0.0' then xmlComp.query('//comprobanteRetencion') else xmlComp.query('//docsSustento/docSustento') end
					FROM @tmp

					IF @versionComp = '1.0.0'
						BEGIN 
							INSERT INTO @DocumentoRelacionado(codDocSustento, numDocSustento,fechaEmisionDocSustento,codigo,baseImponible,porcentajeRetener,valorRetenido)
							SELECT  
								  codDocSustento  = X.Y.value('(codDocSustento)[1]','VARCHAR(2)') 
								 ,numDocSustento  = X.Y.value('(numDocSustento)[1]','VARCHAR(15)')
								 ,fechaEmisionDocSustento = X.Y.value('(fechaEmisionDocSustento)[1]','VARCHAR(50)')
								 ,codigo          = x.y.value('(codigo)[1]','VARCHAR(2)')
								 ,baseImponible = x.y.value('(baseImponible)[1]','NUMERIC(18,2)')
								 ,porcentajeRetener = x.y.value('(porcentajeRetener)[1]','NUMERIC(18,2)')
								 ,valorRetenido = x.y.value('(valorRetenido)[1]','NUMERIC(18,2)')
							from @mainRet rt 
							CROSS APPLY rt.retenciones.nodes('//impuestos/impuesto') x(y) 
						END 

					IF @versionComp = '2.0.0'
						BEGIN
							INSERT INTO @DocumentoRelacionado(codDocSustento, numDocSustento,fechaEmisionDocSustento,codigo,baseImponible,porcentajeRetener,valorRetenido)
							SELECT  
							  codDocSustento  = X.Y.value('(//docSustento/codDocSustento)[1]','VARCHAR(2)') 
							 ,numDocSustento  = X.Y.value('(//docSustento/numDocSustento)[1]','VARCHAR(15)')
							 ,fechaEmisionDocSustento = X.Y.value('(//docSustento/fechaEmisionDocSustento)[1]','VARCHAR(50)')
							 ,codigo = X.Y.value('(codigo)[1]','VARCHAR(5)')
							 ,baseImponible = X.Y.value('(baseImponible)[1]','NUMERIC(18,2)')
							 ,porcentajeRetener = X.Y.value('(porcentajeRetener)[1]','NUMERIC(18,2)')
							 ,valorRetenido = X.Y.value('(valorRetenido)[1]','NUMERIC(18,2)')
							FROM @mainRet rt 
							CROSS APPLY  rt.retenciones.nodes('//docSustento//retenciones/retencion') x(y) 
						END 
				END 

			IF @codDoc = '04'
				BEGIN
					INSERT INTO @DocumentoRelacionado(codDocSustento, numDocSustento,fechaEmisionDocSustento,codigo,baseImponible,porcentajeRetener,valorRetenido)
					SELECT 
						 codDocSustento = x.y.value('(codDocModificado)[1]','VARCHAR(5)')
						,numDocSustento = x.y.value('(numDocModificado)[1]','VARCHAR(25)')
						,fechaEmisionDocSustento = x.y.value('(fechaEmisionDocSustento)[1]','VARCHAR(25)')
						,codigo = x.y.value('(//totalConImpuestos/totalImpuesto/codigo)[1]','VARCHAR(5)')
						,baseImponible = x.y.value('(//totalConImpuestos/totalImpuesto/baseImponible)[1]','NUMERIC(18,2)')
						,porcentajeRetener = x.y.value('(//totalConImpuestos/totalImpuesto/tarifa)[1]','NUMERIC(18,2)')
						,valorRetenido = x.y.value('(//totalConImpuestos/totalImpuesto/valor)[1]','NUMERIC(18,2)')
					FROM @tmp r
					CROSS APPLY r.xmlComp.nodes('//comprobante/notaCredito/infoNotaCredito') x(y) 
				END 

		COMMIT TRAN 
		INSERT INTO FactElect.DocRelacionado 
			(idDocumentoRecibido
			,codDocSustento
			,numDocSustento
			,fechaEmisionDocSustento
			,codigo
			,baseImponible
			,porcentajeRetener
			,valorRetenido)
		SELECT
		    @idDocumento
		   ,codDocSustento
		   ,numDocSustento
		   ,fechaEmisionDocSustento
		   ,codigo
		   ,baseImponible
		   ,porcentajeRetener = ISNULL(porcentajeRetener,0) 
		   ,valorRetenido
		FROM @DocumentoRelacionado r 

		IF (SELECT COUNT(*) FROM FactElect.DocRelacionado WHERE idDocumentoRecibido = @idDocumento) > 1
			BEGIN
				SELECT 1 
				RETURN 
			END
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		INSERT INTO ErroresSistema(token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		VALUES (NEWID(),'/WS_DocumentoRelacionado/GetDataXml',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),1)
	END CATCH 

END
GO
