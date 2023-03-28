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
ALTER FUNCTION Recepcion.f_Comprobante_04 
(
	-- Add the parameters for the function here
	@idEntidad AS INT
)
RETURNS 
@table TABLE 
(
	-- Add the column definitions for the TABLE variable here
	 idEstablecimiento INT NOT NULL
	,idUsuario INT NOT NULL
	,serieComprobante VARCHAR(20) NOT NULL
	,claveAcceso VARCHAR(50) UNIQUE NOT NULL
	,fechaEmision DATE NOT NULL
	,rucEmisor VARCHAR(20) NOT NULL
	,razonSocialEmisior VARCHAR(150) NOT NULL
	,subTotalExento NUMERIC(18,2) NULL
	,subTotalNoIva NUMERIC(18,2) NULL
	,subTotal0 NUMERIC(18,2) NULL
	,subTotalIva NUMERIC(18,2) NULL
	,totalIce NUMERIC(18,2)
	,iva NUMERIC(18,2)
	,descuento NUMERIC(18,2)
	,total NUMERIC(18,2)
	,numDocModificado VARCHAR(20)
)
AS
BEGIN
	-- Fill the table variable with the rows for your result set
	
	DECLARE @identificacionReceptor AS VARCHAR(13) 
	
	DECLARE @cedula AS VARCHAR(10) 

	DECLARE @comprobantes AS TABLE(
		 idDocumento INT NOT NULL
		,versionComp VARCHAR(5) NOT NULL
		,xmlComp XML 
	)


	DECLARE @infoNotaCredito AS TABLE(
		 idDocumento INT NOT NULL
		,fechaEmision VARCHAR(150) NOT NULL
		,numDocModificado VARCHAR(20) NOT NULL
	)

	DECLARE @impuestos AS TABLE (
		 idDocumento INT NOT NULL
		,codigo VARCHAR(5) NOT NULL
		,codigoPorcentaje VARCHAR(5) NOT NULL
		,tarifa NUMERIC(18,2) NULL
		,baseImponible NUMERIC(18,2) NULL
		,valor NUMERIC(18,2)
	)

	DECLARE @detalles AS TABLE(
		 idDocumento INT NOT NULL
		,cantidad NUMERIC(18,5) NOT NULL
		,precioUnitario NUMERIC(18,5) NOT NULL
		,descuento NUMERIC(18,2) NOT NULL
		,precioTotalSinImpuesto NUMERIC(18,2) NOT NULL 
	)

	SELECT TOP 1 @identificacionReceptor = ruc, @cedula = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

	INSERT INTO @comprobantes (idDocumento,versionComp,xmlComp)
	SELECT 
		 idDocumento
		,versionComp
		,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX),dr.xmlDoc.query('//autorizacion/comprobante')))
	FROM Recepcion.DocumentoRecibido dr WHERE dr.codDoc = '04' AND dr.identificacionReceptor = @identificacionReceptor AND dr.xmlDoc IS NOT NULL

	INSERT INTO @comprobantes (idDocumento,versionComp,xmlComp)
	SELECT 
		 idDocumento
		,versionComp
		,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX),dr.xmlDoc.query('//autorizacion/comprobante')))
	FROM Recepcion.DocumentoRecibido dr WHERE dr.codDoc = '04' AND dr.identificacionReceptor = @cedula AND dr.xmlDoc IS NOT NULL


	INSERT INTO @infoNotaCredito (idDocumento,fechaEmision,numDocModificado)
	SELECT 
		 nc.idDocumento
		,fechaEmision     = x.y.value('(fechaEmision)[1]','VARCHAR(150)')
		,numDocModificado = x.y.value('(numDocModificado)[1]','VARCHAR(50)')
	FROM @comprobantes nc
	CROSS APPLY nc.xmlComp.nodes('//infoNotaCredito') x(y)


	INSERT INTO @impuestos (idDocumento,codigo,codigoPorcentaje,tarifa,baseImponible,valor)
	SELECT 
		 nc.idDocumento
		,codigo           = x.y.value('(impuesto/codigo)[1]','VARCHAR(5)')
		,codigoPorcentaje = x.y.value('(impuesto/codigoPorcentaje)[1]','VARCHAR(5)')
		,tarifa           = x.y.value('(impuesto/tarifa)[1]','NUMERIC(18,2)')
		,baseImponible    = x.y.value('(impuesto/baseImponible)[1]','NUMERIC(18,2)')
		,valor            = x.y.value('(impuesto/valor)[1]','NUMERIC(18,2)')
	FROM @comprobantes nc
	CROSS APPLY nc.xmlComp.nodes('//detalles/detalle/impuestos') x(y)

	INSERT INTO @detalles (idDocumento,cantidad,precioUnitario,descuento,precioTotalSinImpuesto)
	SELECT 
		 nc.idDocumento
		,cantidad               = x.y.value('(detalle/cantidad)[1]','NUMERIC(18,2)')
		,precioUnitario         = x.y.value('(detalle/precioUnitario)[1]','NUMERIC(18,2)')
		,descuento              = x.y.value('(detalle/descuento)[1]','NUMERIC(18,2)')
		,precioTotalSinImpuesto = x.y.value('(detalle/precioTotalSinImpuesto)[1]','NUMERIC(18,2)')
	FROM @comprobantes nc
	CROSS APPLY nc.xmlComp.nodes('//detalles') x(y)

	INSERT INTO @table(
		 idEstablecimiento
		,idUsuario
		,serieComprobante
		,claveAcceso
		,fechaEmision
		,rucEmisor
		,razonSocialEmisior
		,subTotalExento 
		,subTotalNoIva 
		,subTotal0
		,subTotalIva
		,totalIce
		,iva 
		,descuento
		,total
		,numDocModificado
		)
	SELECT 
		 dr.idEstablecimiento
		,dr.idUsuario
		,nroDoc = dr.serieComprobante
		,nroAutorizacion = dr.claveAcceso
		,fechaEmision = CONVERT(date,dr.fechaEmision,103)
		,numeroIdentificacion = dr.rucEmisor
		,nombreFiscal = dr.razonSocialEmisior
		,subTotalExento = (SELECT SUM(im.baseImponible) FROM @impuestos im WHERE im.idDocumento = nc.idDocumento AND im.codigoPorcentaje = '7')
		,subTotalNoIva  = (SELECT SUM(im.baseImponible) FROM @impuestos im WHERE im.idDocumento = nc.idDocumento AND im.codigoPorcentaje = '6')
		,subTotal0      = (SELECT SUM(im.baseImponible) FROM @impuestos im WHERE im.idDocumento = nc.idDocumento AND im.codigoPorcentaje = '0')
		,subTotalIva    = (SELECT SUM(im.baseImponible) FROM @impuestos im WHERE im.idDocumento = nc.idDocumento AND im.codigoPorcentaje = '2')
		,totalIce       = (SELECT SUM(im.baseImponible) FROM @impuestos im WHERE im.idDocumento = nc.idDocumento AND im.codigo = '3')
		,iva            = (SELECT SUM(im.valor) FROM @impuestos im WHERE im.idDocumento = nc.idDocumento AND im.codigoPorcentaje = '2')
		,descuento      = (SELECT SUM(de.descuento)     FROM @detalles  de WHERE de.idDocumento = nc.idDocumento)
		,total          = (SELECT SUM(de.precioTotalSinImpuesto) FROM @detalles de WHERE de.idDocumento = nc.idDocumento)
		,nroFactura     = nc.numDocModificado
	
	FROM  @infoNotaCredito nc 
	INNER JOIN Recepcion.DocumentoRecibido dr WITH (NOLOCK) ON dr.idDocumento = nc.idDocumento
	RETURN 
END
GO