USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Cliente_Get]    Script Date: 12/15/2022 11:21:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-10-06
-- Description:	SP para listar los clietes
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.Aprob_Document_Get_Id @id INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @uniqueId VARCHAR(150)

	DECLARE @idTipoDocumento INT 
	
	SELECT TOP 1 @uniqueId = uniqueId FROM Ventas.Aprob_Document WITH (NOLOCK) WHERE idAprob_Document = @id

	SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'APR'

	SELECT 
		d.idAprob_Document
	   ,d.uniqueId
	   ,idTiempoCredito = ISNULL(cl.idTiempoCredito, 0)
	   ,d.idPuntoEmision
	   ,d.estab
	   ,d.ptoEmi
	   ,serieComprobante = d.estab+'-'+d.ptoEmi+'-'+Helper.F_Auto_Sequential(d.secuencial)
	   ,d.identificacionComprador
	   ,d.codDoc
	   ,d.docOrigen
	   ,d.fechaEmision	 
	   ,d.observacion
	   ,codigoPorcentaje = CONVERT(VARCHAR(3), d.codigoPorcentaje)
	   ,totalSinImpuestos
	   ,totalDescuento
	   ,totalConImpuestos
	   ,propina
	   ,importeTotal	   
	FROM Ventas.Aprob_Document d WITH (NOLOCK)
	INNER JOIN Cliente        cl WITH (NOLOCK) ON cl.idCliente = d.idCliente
	WHERE d.idAprob_Document = @id

	SELECT cl.idCliente
		  ,cl.nombreComercial
		  ,cl.nombreFiscal
		  ,cl.numeroIdentificacion
		  ,direccion = ISNULL(cl.direccion,'')
	      ,tipoIdentificacion = ti.codigoSri 
	FROM Ventas.Aprob_Document    ad
	INNER JOIN Cliente            cl WITH(NOLOCK) ON cl.idCliente            = ad.idCliente
	 LEFT JOIN TipoIdentificacion ti WITH(NOLOCK) ON ti.idTipoIdentificacion = cl.idTipoIdentificacion
	WHERE ad.idAprob_Document = @id

	SELECT 
		idAprob_Document_Detailt
	   ,a.idArticulo
	   ,m.idMedida
	   ,t.idTipoIva
	   ,dt.idTarifa
	   ,dt.idBodega
	   ,a.codigo
	   ,dt.descripcion
	   ,medida = m.descripcion
	   ,dt.cantidad
	   ,dt.precioUnitario
	   ,((dt.precioUnitario - dt.descuento) * dt.cantidad) as precioTotalSinImpuesto
	   ,dt.descuento
	   ,dt.cantidad * dt.descuento                         as totalDescuento
	   ,nombreTipoIva = t.descripcion
	   ,valor = t.porcentaje
	   ,codigoTipoIva = t.codigo
	   ,CONVERT(VARCHAR(4), dt.codigoPorcentaje)           as codigoPorcentaje
	   ,dt.tarifa                                          as tarifa
	   ,a.datosAdicionales                                 as datosAdicionales
       ,ISNULL((SELECT idMedida     = m.idMedida 
			          ,descripcion  = m.descripcion
			          ,tarifas      = (SELECT afs.idTarifa,afs.precioVenta,afs.precioConIva,tarifa = UPPER(ta.descripcion), ta.ventaPorMayor
								       FROM dbo.ArticuloFraccionadoPvP  afs WITH (NOLOCK)
								       INNER JOIN dbo.Tarifa             ta WITH (NOLOCK) ON ta.idTarifa = afs.idTarifa
								       WHERE afs.idArticuloFraccionado = af.idArticuloFraccionado
								       ORDER BY ta.predeterminada DESC FOR JSON PATH)
			         ,orden = IIF(af.gestionVenta = 1,1,3)
                     ,af.conversion
			   FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			   INNER JOIN dbo.Medida         m WITH (NOLOCK) ON m.idMedida = af.idMedida
			   WHERE af.idArticulo = dt.idArticulo AND af.estado = 1 FOR JSON PATH),'[]') as fraccionado
             ,(
                SELECT m.idMedida
			          ,m.descripcion
			          ,tarifas		 = (SELECT ap.idTarifa,ap.precioVenta,ap.precioConIva,tarifa = UPPER(ta.descripcion), ta.ventaPorMayor 
								        FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
								        INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
								        WHERE ap.idArticulo = ar.idArticulo
								        ORDER BY ta.predeterminada DESC FOR JSON PATH)
			          ,orden = 2
                      ,1 as conversion
			    FROM dbo.Articulo     ar WITH (NOLOCK)
			    INNER JOIN dbo.Medida  m WITH (NOLOCK) ON m.idMedida = ar.idMedida
			    WHERE ar.idArticulo = a.idArticulo FOR JSON PATH
             ) as principal
            ,(
               SELECT idArticulo,idBodega,fechaConsolidacion FROM Inventario.Stock st WITH (NOLOCK) WHERE st.idArticulo = a.idArticulo AND st.idBodega = dt.idBodega FOR JSON PATH
             ) as consolidacion
            ,a.llevaInventario
            ,a.precioCosto
            ,dt.fechaEmision
	FROM Ventas.Aprob_Document_Detailt dt WITH (NOLOCK)
	INNER JOIN dbo.Articulo             a WITH (NOLOCK) ON a.code_unique      = dt.codArticulo
	INNER JOIN dbo.Medida               m WITH (NOLOCK) ON m.codigo           = dt.codMedida
	INNER JOIN dbo.TipoIva              t WITH (NOLOCK) ON t.codigoPorcentaje = dt.codigoPorcentaje
	WHERE dt.uniqueId = @uniqueId AND dt.estado = 1 ORDER BY ad_d.idAprob_Document_Detailt ASC 

	SELECT tipoDoc  = CASE WHEN codDocumento = 'PR' THEN 'Proforma' 
			               WHEN codDocumento = 'NE' THEN 'NotaEntrega' 
			               ELSE '' END 
		  ,serieComprobante = serie
	FROM Ventas.Aprob_Document_Hist WHERE uniqueId = @uniqueId
	
	SELECT 
		ia.idInfoAdicionalDoc,
		ia.nombre,
		ia.valor,
		ia.estado
	FROM InfoAdicionalDoc ia
	WHERE ia.idComprobante = @id AND ia.idTipoDocumento = @idTipoDocumento
	
	SELECT h.idDocumento, h.idHistoryInfoAdicional, selected = CAST(1 as BIT), i.* FROM Ventas.HistoryInfoAdicional h WITH(NOLOCK)
	INNER JOIN Compra.InfoAdicional i WITH(NOLOCK) ON i.idInfoAdicional = h.idInfoAdicional
	WHERE h.codDoc='APR' AND h.idDocumento = @id

END

