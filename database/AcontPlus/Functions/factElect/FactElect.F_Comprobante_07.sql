USE [Acontplus]
go
-- ================================================
-- Template generated from Template Explorer using:
-- Create Multi-Statement Function (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the function.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER FUNCTION FactElect.F_Comprobante_07 
(
	-- Add the parameters for the function here
	@idEntidad AS INT 
)
RETURNS 
@table TABLE 
(
	 idPuntoEmision INT NOT NULL
    ,codEstado INT NOT NULL
	,idUsuario INT NOT NULL
	,serieComprobante VARCHAR(20) NOT NULL
	,fechaEmision DATE NOT NULL
	,nroAutorizacion VARCHAR(50)NOT NULL
	,identificacionSujetoRetenido VARCHAR(25)  NULL
	,razonSocialSujetoRetenido VARCHAR(150)  NULL
	,numDocSustento VARCHAR(25) NULL
	,totalRenta NUMERIC(18,2) 
	,totalIva NUMERIC(18,2)
	,total NUMERIC(18,2)
)
AS
BEGIN
	DECLARE @tmp as Table(
		 idDocumentoElctronico INT NOT NULL
		,xmlComp xml NULL
		,versionComp VARCHAR(5) NOT NULL
	)

	DECLARE @mainRet AS TABLE(
		 idDocumentoElectronico INT NOT NULL
		,versionComp VARCHAR(10) NOT NULL
		,retenciones XML NULL
	)

	DECLARE @comprobanteRetencion AS TABLE(
			idDocumentoElectronico INT NOT NULL
		   ,razonSocialSujetoRetenido VARCHAR(150) NULL
		   ,identificacionSujetoRetenido VARCHAR(20) NULL
		   ,codDocSustento VARCHAR(5)  NULL
		   ,numDocSustento VARCHAR(25)  NULL
		   ,fechaEmisionDocSustento VARCHAR(100)  NULL
		   ,codigo VARCHAR(5)  NULL
		   ,baseImponible NUMERIC(18,2)  NULL
		   ,porcentajeRetener NUMERIC(18,2)  NULL
		   ,valorRetenido NUMERIC(18,2)  NULL
		)

	INSERT INTO @tmp(idDocumentoElctronico,versionComp,xmlComp)
	SELECT de.idDocumentoElectronico
	      ,de.versionComp 
		  ,xmlComp = CASE de.codEstado WHEN 4 THEN CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), de.xmlSri.query('//autorizacion/comprobante'))))
								   ELSE dbo.f_sanitize_xml(de.xmlAcontPlus)
					 END
	FROM dbo.DocumentoElectronico de
	WHERE codDoc = '07' AND de.idEntidad = @idEntidad

	INSERT INTO @mainRet (idDocumentoElectronico,versionComp, retenciones)
	SELECT  idDocumentoElctronico,versionComp, xmlComp.query('//comprobanteRetencion') 
	FROM @tmp

	INSERT INTO @comprobanteRetencion
		(idDocumentoElectronico
		,identificacionSujetoRetenido
		,razonSocialSujetoRetenido
		,codigo
		,codDocSustento
		,numDocSustento
		,fechaEmisionDocSustento
		,baseImponible
		,porcentajeRetener
		,valorRetenido)
	SELECT  
		 rt.idDocumentoElectronico
		,identificacionSujetoRetenido  = X.Y.value('(//infoCompRetencion/identificacionSujetoRetenido)[1]','VARCHAR(150)') 
		,razonSocialSujetoRetenido     = X.Y.value('(//infoCompRetencion/razonSocialSujetoRetenido)[1]','VARCHAR(20)') 
		,codigo                        = X.Y.value('(codigo)[1]','VARCHAR(2)') 
		,codDocSustento                = X.Y.value('(codDocSustento)[1]','VARCHAR(2)') 
		,numDocSustento                = X.Y.value('(numDocSustento)[1]','VARCHAR(15)')
		,fechaEmisionDocSustento       = X.Y.value('(fechaEmisionDocSustento)[1]','VARCHAR(50)')
		,baseImponible                 = x.y.value('(baseImponible)[1]','NUMERIC(18,2)')
		,porcentajeRetener             = x.y.value('(porcentajeRetener)[1]','NUMERIC(18,2)')
		,valorRetenido = x.y.value('(valorRetenido)[1]','NUMERIC(18,2)')
	from @mainRet rt 
	CROSS APPLY rt.retenciones.nodes('//impuestos/impuesto') x(y) 
	INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = rt.idDocumentoElectronico
	WHERE rt.versionComp = '1.0.0'

	INSERT INTO @comprobanteRetencion
		(idDocumentoElectronico
		,identificacionSujetoRetenido
		,razonSocialSujetoRetenido
		,codDocSustento
		,numDocSustento
		,fechaEmisionDocSustento
		,codigo
		,baseImponible
		,porcentajeRetener
		,valorRetenido)
	SELECT  
		 rt.idDocumentoElectronico
		,identificacionSujetoRetenido  = X.Y.value('(//infoCompRetencion/identificacionSujetoRetenido)[1]','VARCHAR(150)') 
		,razonSocialSujetoRetenido     = X.Y.value('(//infoCompRetencion/razonSocialSujetoRetenido)[1]','VARCHAR(20)') 
		,codDocSustento                = X.Y.value('(docSustento/codDocSustento)[1]','VARCHAR(2)') 
		,numDocSustento                = X.Y.value('(docSustento/numDocSustento)[1]','VARCHAR(15)')
		,fechaEmisionDocSustento       = X.Y.value('(docSustento/fechaEmisionDocSustento)[1]','VARCHAR(50)')
		
		,codigo            = X.Y.value('(docSustento/retenciones/retencion/codigo)[1]','VARCHAR(5)')
		,baseImponible     = X.Y.value('(docSustento/retenciones/retencion/baseImponible)[1]','NUMERIC(18,2)')
		,porcentajeRetener = X.Y.value('(docSustento/retenciones/retencion/porcentajeRetener)[1]','NUMERIC(18,2)')
		,valorRetenido     = X.Y.value('(docSustento/retenciones/retencion/valorRetenido)[1]','NUMERIC(18,2)')
	FROM @mainRet rt 
	CROSS APPLY  rt.retenciones.nodes('//docsSustento') x(y) 
	INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = rt.idDocumentoElectronico
	WHERE rt.versionComp = '2.0.0'
	
	INSERT INTO @table
		(idPuntoEmision
		,codEstado
		,idUsuario
		,serieComprobante
		,fechaEmision
		,nroAutorizacion
		,identificacionSujetoRetenido
		,razonSocialSujetoRetenido
		,numDocSustento
		,totalRenta
		,totalIva
		,total)
	
	SELECT dl.idPuntoEmision
		  ,dl.codEstado
		  ,dl.idUsuario
		  ,nroDoc = es.estab+'-'+pe.ptoEmi+'-'+Helper.F_Auto_Sequential(dl.nroDocumento)
		  ,dl.fechaEmision
		  ,nroAutorizacion = dl.claveAcceso
		  ,numeroIdentificacion = (SELECT TOP 1 cr.identificacionSujetoRetenido FROM @comprobanteRetencion cr WHERE cr.idDocumentoElectronico = dl.idDocumentoElectronico)
		  ,nombreFiscal         = (SELECT TOP 1 cr.razonSocialSujetoRetenido    FROM @comprobanteRetencion cr WHERE cr.idDocumentoElectronico = dl.idDocumentoElectronico)
		  ,nroFactura           = (SELECT TOP 1 cr.numDocSustento               FROM @comprobanteRetencion cr WHERE cr.idDocumentoElectronico = dl.idDocumentoElectronico)
		  ,totalRenta           = (SELECT SUM(cr.valorRetenido) FROM @comprobanteRetencion cr WHERE cr.idDocumentoElectronico = dl.idDocumentoElectronico AND cr.codigo = '1')
		  ,totalIva             = (SELECT SUM(cr.valorRetenido) FROM @comprobanteRetencion cr WHERE cr.idDocumentoElectronico = dl.idDocumentoElectronico AND cr.codigo = '2')
		  ,total                = (SELECT SUM(cr.valorRetenido) FROM @comprobanteRetencion cr WHERE cr.idDocumentoElectronico = dl.idDocumentoElectronico)
		  
	FROM @tmp de
	INNER JOIN dbo.DocumentoElectronico dl WITH (NOLOCK) ON dl.idDocumentoElectronico = de.idDocumentoElctronico
	INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = dl.idPuntoEmision
	INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.codEstab               = pe.codEstab

	RETURN 
END
GO