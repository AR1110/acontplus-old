USE [AcontPlus]
GO 
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
ALTER FUNCTION Recepcion.Comprobante_07
(
	@idEntidad AS INT 
)
RETURNS 
@table  TABLE
(
	 idDocumento INT UNIQUE NOT NULL
	,numDocSustento VARCHAR(25) NOT NULL
	,totalRenta NUMERIC(18,2) NULL 
	,totalIva NUMERIC(18,2)  NULL
	,total NUMERIC(18,2) NOT NULL
)
AS
BEGIN
	-- Fill the table variable with the rows for your result set
	DECLARE @comprobantes AS TABLE(
		 idDocumento INT NOT NULL
		,versionComp VARCHAR(5) NOT NULL
		,xmlComp XML 
	)

	DECLARE @docsSustento AS TABLE(
		idDocumento INT NOT NULL
		,codDocSustento VARCHAR(5) NOT NULL
		,numDocSustento VARCHAR(25) NOT NULL
		,fechaEmisionDocSustento VARCHAR(25) NOT NULL
	)

	DECLARE @document AS TABLE (
 		 idDocumento INT NOT NULL
		,codDocSustento VARCHAR(5) NOT NULL
		,numDocSustento VARCHAR(25) NOT NULL
		,fechaEmisionDocSustento VARCHAR(25) NOT NULL
	)

	DECLARE @retencion AS TABLE (
 		 idDocumento INT NOT NULL
		,codigo VARCHAR(5) NOT NULL
		,codigoRetencion VARCHAR(5) NOT NULL
		,baseImponible NUMERIC(18,2) NOT NULL
		,porcentajeRetener NUMERIC(18,2) NOT NULL
		,valorRetenido NUMERIC(18,2) NOT NULL
	)

	DECLARE @identificacionReceptor VARCHAR(13)

	select @identificacionReceptor = ruc from Entidad where idEntidad = @idEntidad

	INSERT INTO @comprobantes(idDocumento,versionComp,xmlComp)
	SELECT 
		 idDocumento
		,versionComp
		,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX),dr.xmlDoc.query('//autorizacion/comprobante')))
	FROM Recepcion.DocumentoRecibido dr WHERE dr.codDoc = '07' AND dr.identificacionReceptor = @identificacionReceptor AND dr.xmlDoc IS NOT NULL

	INSERT INTO @docsSustento (idDocumento,codDocSustento,numDocSustento,fechaEmisionDocSustento)
	SELECT 
		cm.idDocumento
	   ,codDocSustento          = x.y.value('(codDocSustento)[1]','VARCHAR(5)')
	   ,numDocSustento          = x.y.value('(numDocSustento)[1]','VARCHAR(25)')
	   ,fechaEmisionDocSustento = x.y.value('(fechaEmisionDocSustento)[1]','VARCHAR(50)')
	FROM @comprobantes cm
	CROSS APPLY cm.xmlComp.nodes('//docsSustento/docSustento') x(y)
	WHERE cm.versionComp = '2.0.0'


	INSERT INTO @docsSustento (idDocumento,codDocSustento,numDocSustento,fechaEmisionDocSustento)
	SELECT 
		cm.idDocumento
	   ,codDocSustento          = x.y.value('(codDocSustento)[1]','VARCHAR(5)')
	   ,numDocSustento          = x.y.value('(numDocSustento)[1]','VARCHAR(25)')
	   ,fechaEmisionDocSustento = x.y.value('(fechaEmisionDocSustento)[1]','VARCHAR(50)')
	FROM @comprobantes cm
	CROSS APPLY cm.xmlComp.nodes('//impuestos/impuesto') x(y)
	WHERE cm.versionComp = '1.0.0'

	INSERT INTO @document (idDocumento,codDocSustento,numDocSustento,fechaEmisionDocSustento)
	SELECT idDocumento,codDocSustento,numDocSustento,fechaEmisionDocSustento
	FROM @docsSustento 
	GROUP BY idDocumento,codDocSustento,numDocSustento,fechaEmisionDocSustento

	INSERT INTO @retencion(idDocumento,codigo,codigoRetencion,baseImponible,porcentajeRetener,valorRetenido)
	SELECT 
		cm.idDocumento
	   ,codigo            = x.y.value('(codigo)[1]','VARCHAR(5)')
	   ,codigoRetencion   = x.y.value('(codigoRetencion)[1]','VARCHAR(50)')
	   ,baseImponible     = x.y.value('(baseImponible)[1]','NUMERIC(18,2)')
	   ,porcentajeRetener = x.y.value('(porcentajeRetener)[1]','NUMERIC(18,2)')
	   ,valorRetenido     = x.y.value('(valorRetenido)[1]','NUMERIC(18,2)')
	FROM @comprobantes cm
	CROSS APPLY cm.xmlComp.nodes('//docsSustento/docSustento/retenciones/retencion') x(y)
	WHERE cm.versionComp = '2.0.0'

	INSERT INTO @retencion(idDocumento,codigo,codigoRetencion,baseImponible,porcentajeRetener,valorRetenido)
	SELECT 
		cm.idDocumento
	   ,codigo            = x.y.value('(codigo)[1]','VARCHAR(5)')
	   ,codigoRetencion   = x.y.value('(codigoRetencion)[1]','VARCHAR(50)')
	   ,baseImponible     = x.y.value('(baseImponible)[1]','NUMERIC(18,2)')
	   ,porcentajeRetener = x.y.value('(porcentajeRetener)[1]','NUMERIC(18,2)')
	   ,valorRetenido     = x.y.value('(valorRetenido)[1]','NUMERIC(18,2)')
	FROM @comprobantes cm
	CROSS APPLY cm.xmlComp.nodes('//impuestos/impuesto') x(y)
	WHERE cm.versionComp = '1.0.0'

	INSERT INTO @table(idDocumento,numDocSustento,totalRenta,totalIva,total)
	SELECT 
		 dc.idDocumento
		,nroFactura = dc.numDocSustento
		,totalRenta = (SELECT SUM(rt.valorRetenido) FROM @retencion rt WHERE rt.idDocumento = dc.idDocumento AND rt.codigo = '1')
		,totalIva   = (SELECT SUM(rt.valorRetenido) FROM @retencion rt WHERE rt.idDocumento = dc.idDocumento AND rt.codigo = '2')
		,total      = (SELECT SUM(rt.valorRetenido) FROM @retencion rt WHERE rt.idDocumento = dc.idDocumento)
	FROM @document dc 
	INNER JOIN Recepcion.DocumentoRecibido dr WITH (NOLOCK) ON dr.idDocumento = dc.idDocumento
	RETURN 
END
GO