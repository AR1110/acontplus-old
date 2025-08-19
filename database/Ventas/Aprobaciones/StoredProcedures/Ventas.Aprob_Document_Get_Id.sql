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

	DECLARE @idTipoDocumento INT ,@idEntidad INT 

	SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'APR'

    SELECT TOP 1 @idEntidad = es.idEntidad 
    FROM Ventas.Aprob_Document     ad WITH (NOLOCK)
    INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON ad.idPuntoEmision    = pe.idPuntoEmision
    INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento

	SELECT ad.idAprob_Document
	      ,ad.idUsuario
          ,ISNULL(cl.idTiempoCredito, 0) as idTiempoCredito
	      ,ad.idPuntoEmision
	      ,ad.serieComprobante
	      ,ad.fechaEmision	 
	      ,ad.observacion
	      ,ad.totalSinImpuestos
	      ,ad.totalDescuento
	      ,ad.propina
	      ,ad.importeTotal
          ,cu.IDCard                     as identificacionComprador
          ,pe.ptoEmi
          ,ISNULL(td.codigoSri,'NE')     as codDoc
          ,og.codigo                     as docOrigen
          ,es.estab
	FROM Ventas.Aprob_Document     ad WITH (NOLOCK)
	INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente         = ad.idCliente
    INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision    = ad.idPuntoEmision
    INNER JOIN dbo.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = ad.idTipoDocumento
    INNER JOIN dbo.TipoDocumento   og WITH (NOLOCK) ON og.idTipoDocumento   = ad.idTipoDocOrigen
    INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.Id                = cl.CustomerId
    INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
	WHERE ad.idAprob_Document = @id

	SELECT cl.idCliente
          ,cl.FormaPagoSriId       as idFormaPagoSri
		  ,cu.BusinessName         as nombreFiscal
		  ,cu.TradeName            as nombreComercial
		  ,cu.IDCard               as numeroIdentificacion
          ,cu.IdTypeId             as idTipoIdentificacion
		  ,ISNULL(cl.direccion,'') as direccion
	      ,ti.codigoSri            as tipoIdentificacion
	FROM Ventas.Aprob_Document    ad
	INNER JOIN Cliente            cl WITH (NOLOCK) ON cl.idCliente            = ad.idCliente
	INNER JOIN Customer.Customer  cu WITH (NOLOCK) ON cu.Id                   = cl.CustomerId
    INNER JOIN TipoIdentificacion ti WITH (NOLOCK) ON ti.idTipoIdentificacion = cu.IdTypeId
	WHERE ad.idAprob_Document = @id

	SELECT dt.idAprob_Document_Detailt
	      ,dt.idArticulo
	      ,dt.idMedida
	      ,dt.idTipoIva
	      ,dt.idTarifa
	      ,dt.idBodega
          ,t.idImpuesto
	      ,a.codigo
	      ,dt.descripcion
	      ,dt.cantidad
	      ,dt.precioUnitario
          ,dt.descuento
	      ,dt.precioTotalSinImpuesto
          ,dt.codigoPorcentaje
          ,dt.tarifa
          ,dt.valorImpuesto
	      ,a.datosAdicionales 
           ,ISNULL
              ((
                    SELECT af.idMedida
                          ,IIF(af.gestionVenta = 1,1,3) as orden
                          ,af.conversion
                          ,af.precioCostoFraccionado
                          ,ar.precioCosto
			              ,me.descripcion               as descripcion
			              ,(
                                SELECT pv.idTarifa
                                      ,pv.precioVenta
                                      ,pv.precioConIva
                                      ,UPPER(ta.descripcion) as tarifa
                                      ,ta.ventaPorMayor
					            FROM dbo.ArticuloFraccionadoPvP  pv WITH (NOLOCK)
					            INNER JOIN dbo.Tarifa            ta WITH (NOLOCK) ON ta.idTarifa = pv.idTarifa
					            WHERE pv.idArticuloFraccionado = af.idArticuloFraccionado
					            ORDER BY ta.predeterminada DESC 
                                FOR JSON PATH

                          ) as tarifas
			        FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			        INNER JOIN dbo.Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida
                    INNER JOIN dbo.Articulo      ar WITH (NOLOCK) ON ar.idArticulo = af.idArticulo
			        WHERE af.idArticulo = dt.idArticulo 
                    FOR JSON PATH
                
                ),'[]') as fraccionado

               ,ISNULL
                ((
                    SELECT sc.idMedida
                          ,2              as orden
                          ,1              as conversion
			              ,sc.precioCosto as precioCostoFraccionado
                          ,sc.precioCosto
                          ,me.descripcion
			              ,(
                                SELECT ap.idTarifa
                                      ,ap.precioVenta
                                      ,ap.precioConIva
                                      ,UPPER(ta.descripcion) as tarifa
                                      ,ta.ventaPorMayor 
					            FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
					            INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
					            WHERE ap.idArticulo = sc.idArticulo
					            ORDER BY ta.predeterminada DESC 
                                FOR JSON PATH

                           ) as tarifas
			        FROM dbo.Articulo     sc WITH (NOLOCK)
			        INNER JOIN dbo.Medida me WITH (NOLOCK) ON me.idMedida = sc.idMedida
			        WHERE sc.idArticulo = dt.idArticulo 
                    FOR JSON PATH

                ),'[]') as principal
                ,(
                   SELECT idArticulo,idBodega,fechaConsolidacion FROM Inventario.Stock st WITH (NOLOCK) WHERE st.idArticulo = a.idArticulo AND st.idBodega = dt.idBodega FOR JSON PATH
                 ) as consolidacion
                ,a.llevaInventario
                ,a.precioCosto
                ,dt.fechaEmision
                ,dt.nota
	FROM Ventas.Aprob_Document_Detailt dt WITH (NOLOCK)
	INNER JOIN dbo.Articulo             a WITH (NOLOCK) ON a.idArticulo = dt.idArticulo
	INNER JOIN dbo.Medida               m WITH (NOLOCK) ON m.idMedida   = dt.idMedida
	INNER JOIN dbo.TipoIva              t WITH (NOLOCK) ON t.idTipoIva  = dt.idTipoIva
	WHERE dt.idAprob_Document = @id
      AND dt.estado = 1 
    ORDER BY dt.idAprob_Document_Detailt ASC 

	SELECT CASE WHEN ah.idProForma    > 0 THEN 'Proforma' 
			    WHEN ah.idNotaEntrega > 0 THEN 'Nota Entrega' 
			                              ELSE '' 
           END as tipoDoc

		  ,CASE WHEN ah.idProForma    > 0 THEN pr.serieComprobante
			    WHEN ah.idNotaEntrega > 0 THEN ne.serieComprobante 
			                              ELSE '' 
           END as serieComprobante
	FROM Ventas.Aprob_Document_Hist ah WITH (NOLOCK)
    LEFT JOIN dbo.Proforma          pr WITH (NOLOCK) ON pr.idProforma    = ah.idProforma
    LEFT JOIN dbo.NotaEntrega       ne WITH (NOLOCK) ON ne.idNotaEntrega = ah.idNotaEntrega
    WHERE idAprob_Document = @id
	
	SELECT 
		ia.idInfoAdicionalDoc,
		ia.nombre,
		ia.valor,
		ia.estado
	FROM InfoAdicionalDoc ia
	WHERE ia.idComprobante = @id AND ia.idTipoDocumento = @idTipoDocumento
	
    SELECT idFormaPagoSri, descripcion, codigo FROM dbo.FormaPagoSri WHERE estado = 1
   
    SELECT CAST(idFormaPagoSri   AS INT) as idFormaPagoSri
	FROM Config.v_Sistema_Ventas gs
    WHERE gs.idEntidad = @idEntidad

END

