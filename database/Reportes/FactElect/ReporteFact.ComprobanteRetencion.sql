
USE [AcontPlus]
GO

-- exec ReporteFact.ComprobanteRetencion '{"rdlcParams":"[{\"reportPath\":\"\\\/FactElect\\\/ComprobanteRetencion.rdl\",\"format\":\"pdf\",\"contentType\":\"application\\\/pdf\",\"fileName\":\"ComprobanteRetencion.pdf\"}]","id":333}'
-- exec ReporteFact.ComprobanteRetencion '[{"id": 323, "codigo":"RCR","format":"pdf"}]'

 
-- =============================================
-- Author:		Emilio Senguana
-- Create date: 28-02-2023
-- Description:	SP Retencion Compra y Venta 
-- =============================================



CREATE OR ALTER PROCEDURE ReporteFact.ComprobanteRetencion @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT  ON;
	SET LANGUAGE SPANISH;


	--Variables Globales 
	DECLARE @id INT 
	DECLARE @versionComp VARCHAR(30)
	DECLARE @codDoc VARCHAR(5)
	DECLARE @fechaAutorizacion VARCHAR(20)
	DECLARE @serieComprobante VARCHAR(30)


	--DataMail
	 DECLARE @cc VARCHAR(100)
	 DECLARE @nameDoc VARCHAR(150)
    
	--DataSets
	DECLARE @headerDs VARCHAR(MAX)
	DECLARE @detalleDs VARCHAR(MAX)
	DECLARE @infoAdditionalDs VARCHAR(MAX)

	DECLARE @rdlcParams VARCHAR(MAX)
	DECLARE @dataSources VARCHAR(MAX) 


	--XML 
	DECLARE @xmlCompRet TABLE(
		xmlRet XML
	)
	
	IF(OBJECT_ID('tempdb..#infoRetencion') IS NOT NULL) BEGIN DROP TABLE #infoRetencion END
	IF(OBJECT_ID('tempdb..#impuestosRetV1') IS NOT NULL) BEGIN DROP TABLE #impuestosRetV1 END
	IF(OBJECT_ID('tempdb..#impuestosRetV2') IS NOT NULL) BEGIN DROP TABLE #impuestosRetV2 END


	--Recuperando Data Json 
	SELECT 
		 @id = id
		,@rdlcParams  = rdlcParams 		
	FROM OPENJSON(@json)
	WITH (
		 id INT '$.id'
		,rdlcParams VARCHAR(MAX) '$.rdlcParams'
	) AS dt 


	

	---Set Variables Generales------------

	SELECT
		
		@versionComp       = dr.versionComp,
		@codDoc            = dr.codDoc,
		@fechaAutorizacion = fechaAutorizacion,
		@serieComprobante  = dr.serieComprobante
	FROM Recepcion.DocumentoRecibido dr WITH (NOLOCK) 
	WHERE dr.idDocumento = @id 


	INSERT INTO @xmlCompRet (xmlRet) 
	SELECT xmlComp = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante'))))
	FROM Recepcion.DocumentoRecibido ci where idDocumento = @id;
	--SELECT * FROM @xmlCompRet

	--Información General 

	SELECT * INTO #infoRetencion FROM (
		SELECT 		
			ambiente        = CASE WHEN y.value('(//infoTributaria/ambiente)[1]','varchar(15)') = '2' THEN 'PRODUCCION' ELSE 'PRUEBAS' END
		   ,tipoEmision     = CASE WHEN y.value('(//infoTributaria/tipoEmision)[1]','varchar(15)') = '1' THEN 'NORMAL' ELSE '' END
		   ,razonSocial     = y.value('(//infoTributaria/razonSocial)[1]','varchar(150)')
		   ,nombreComercial = ISNULL(y.value('(//infoTributaria/nombreComercial)[1]','varchar(150)'), '')
		   ,ruc             = y.value('(//infoTributaria/ruc)[1]','varchar(15)')
		   ,claveAcceso     = y.value('(//infoTributaria/claveAcceso)[1]','varchar(49)')
		   ,codDoc          = y.value('(//infoTributaria/codDoc)[1]','varchar(4)')
		   ,estab           = y.value('(//infoTributaria/estab)[1]','varchar(6)')
		   ,ptoEmi          = y.value('(//infoTributaria/ptoEmi)[1]','varchar(6)')
		   ,secuencial      = y.value('(//infoTributaria/secuencial)[1]','varchar(10)')
		   ,dirMatriz       = y.value('(//infoTributaria/dirMatriz)[1]','varchar(150)')

		   ,fechaAutorizacion = @fechaAutorizacion 
		   ,serieComprobante = @serieComprobante

		   --Info Comp. Ret
		   ,fechaEmision         = y.value('(//infoCompRetencion/fechaEmision)[1]','varchar(150)')
		   ,dirEstablecimiento   = y.value('(//infoCompRetencion/dirEstablecimiento)[1]','varchar(150)')
		   ,contribuyenteEspecial = y.value('(//infoCompRetencion/contribuyenteEspecial)[1]','INT')
		   ,obligadoContabilidad = y.value('(//infoCompRetencion/obligadoContabilidad)[1]','varchar(150)')
		   ,razonSocialSujetoRetenido    = y.value('(//infoCompRetencion/razonSocialSujetoRetenido)[1]','varchar(150)')
		   ,identificacionSujetoRetenido = y.value('(//infoCompRetencion/identificacionSujetoRetenido)[1]','varchar(150)')   
		   ,periodoFiscal = y.value('(//infoCompRetencion/periodoFiscal)[1]','varchar(150)')   
	
		FROM @xmlCompRet t
		CROSS APPLY t.xmlRet.nodes('//comprobante/comprobanteRetencion') x(y)
	) as infoTemp

	--SELECT * FROM #infoRetencion

	SELECT * FROM #infoRetencion ir 
     
	-------VERSION 1.0.0
	IF @versionComp = '1.0.0'
		BEGIN 
			SELECT impuesto = ir.descripcion, docSustento = ds.descripcion, impTemp.* INTO #impuestosRetV1 FROM (
				SELECT 
					codigo             = y.value('(codigo)[1]','varchar(150)')
					,codigoRetencion   = y.value('(codigoRetencion)[1]','varchar(150)')
					,baseImponible     = y.value('(baseImponible)[1]','varchar(150)')
					,porcentajeRetener = y.value('(porcentajeRetener)[1]','varchar(150)')
					,valorRetenido     = y.value('(valorRetenido)[1]','varchar(150)')
					,codDocSustento    = y.value('(codDocSustento)[1]','varchar(150)')
					,numDocSustento    = y.value('(numDocSustento)[1]','varchar(150)')
					,fechaEmisionDocSustento = y.value('(fechaEmisionDocSustento)[1]','varchar(150)')
				FROM @xmlCompRet t
				CROSS APPLY t.xmlRet.nodes('//comprobante/comprobanteRetencion/impuestos/impuesto') x(y)

			) AS impTemp
			INNER JOIN Sri.ImpuestoRetencion ir WITH (NOLOCK) ON ir.codigo         = impTemp.codigo
			LEFT JOIN Sri.DocumentoSustento ds WITH (NOLOCK) ON ds.codDocSustento = impTemp.codDocSustento
			
			--SELECT * FROM #impuestosRetV1
			SELECT * FROM #impuestosRetV1 
		END 	
		

	------VERSION 2.0.0
	IF @versionComp = '2.0.0'
		BEGIN 
			SELECT  impuesto = ir.descripcion, docSustento = ds.descripcion, impTemp.* INTO #impuestosRetV2 FROM (
				SELECT 
					 codigo            = y.value('(//retenciones/retencion/codigo)[1]','varchar(150)')
					,codigoRetencion   = y.value('(//retenciones/retencion/codigoRetencion)[1]','varchar(150)')
					,baseImponible     = y.value('(//retenciones/retencion/baseImponible)[1]','varchar(150)')
					,porcentajeRetener = y.value('(//retenciones/retencion/porcentajeRetener)[1]','varchar(150)')
					,valorRetenido     = y.value('(//retenciones/retencion/valorRetenido)[1]','varchar(150)')
					,codDocSustento    = y.value('(codDocSustento)[1]','varchar(150)')
					,numDocSustento    = y.value('(numDocSustento)[1]','varchar(150)')
					,fechaEmisionDocSustento = y.value('(fechaEmisionDocSustento)[1]','varchar(150)')
				FROM @xmlCompRet t
				CROSS APPLY t.xmlRet.nodes('//comprobante/comprobanteRetencion/docsSustento/docSustento') x(y)
			) AS impTemp
			INNER JOIN Sri.ImpuestoRetencion ir WITH (NOLOCK) ON ir.codigo       = impTemp.codigo
			LEFT JOIN Sri.DocumentoSustento ds WITH(NOLOCK) ON ds.codDocSustento = impTemp.codDocSustento
			--SELECT * FROM #impuestosRetV2
			SELECT * FROM #impuestosRetV2 
		END 

	--	SELECT * FROM #impuestosRetV2
		
	SELECT 
		y.value('@nombre','VARCHAR(100)') as nombre,  
		y.value('./.','VARCHAR(100)')  as valor
	FROM  @xmlCompRet t
	CROSS APPLY t.xmlRet.nodes('//comprobante/comprobanteRetencion/infoAdicional/*') x(y)
   
END 


