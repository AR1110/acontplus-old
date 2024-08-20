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
	DECLARE @uniqueId VARCHAR(300)

	DECLARE @idTipoDocumento INT 
    DECLARE @idEntidad INT 
	
	SELECT TOP 1 @uniqueId = uniqueId,  @idEntidad = idEntidad   FROM Ventas.Aprob_Document WITH (NOLOCK) WHERE idAprob_Document = @id

	SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'APR'

	SELECT d.idAprob_Document
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
	      ,totalSinImpuestos
	      ,totalDescuento
	      ,propina
	      ,importeTotal	  
          ,d.idUsuario
	FROM Ventas.Aprob_Document d WITH (NOLOCK)
	INNER JOIN Cliente        cl WITH (NOLOCK) ON cl.idCliente = d.idCliente
	WHERE d.idAprob_Document = @id

	SELECT cl.idCliente
          ,cl.FormaPagoSriId       as idFormaPagoSri
		  ,cl.nombreComercial
		  ,cl.nombreFiscal
		  ,cl.numeroIdentificacion
		  ,direccion = ISNULL(cl.direccion,'')
	      ,tipoIdentificacion = ti.codigoSri 
          ,cl.idTipoIdentificacion
	FROM Ventas.Aprob_Document    ad
	INNER JOIN Cliente            cl WITH(NOLOCK) ON cl.idCliente            = ad.idCliente
	 LEFT JOIN TipoIdentificacion ti WITH(NOLOCK) ON ti.idTipoIdentificacion = cl.idTipoIdentificacion
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
	WHERE dt.uniqueId = @uniqueId 
      AND dt.estado = 1 
    ORDER BY dt.idAprob_Document_Detailt ASC 

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
	
    SELECT idFormaPagoSri, descripcion, codigo FROM dbo.FormaPagoSri WHERE estado = 1
   
    SELECT CAST(idFormaPagoSri   AS INT) as idFormaPagoSri
	FROM Config.v_Sistema_Ventas gs
    WHERE gs.idEntidad = @idEntidad

END

