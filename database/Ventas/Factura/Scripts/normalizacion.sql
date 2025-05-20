USE ACONTPLUS 
go


--> Factura

--ALTER TABLE Ventas.HistoryInfoAdicional ADD idFacturaDetalle BIGINT CONSTRAINT fk_infoAdicional_Detalle_Factura FOREIGN KEY(idFacturaDetalle) REFERENCES dbo.FacturaDetalle(idFacturaDetalle)


--UPDATe ha set idFacturaDetalle = (
--                             SELECT TOP 1 fd.idFacturaDetalle FROM FacturaDetalle fd
--                             where fd.idFactura = ha.idDocumento
--                               and fd.idArticulo = ia.idArticulo 
--                               and fd.estado = 1
--                           ) 
       
--FROM Ventas.HistoryInfoAdicional ha
--INNER JOIN Compra.InfoAdicional  ia with (nolock) on ia.idInfoAdicional = ha.idInfoAdicional
--WHERE codDoc = 'FE'


--> NOTA ENTREGA

--ALTER TABLE Ventas.HistoryInfoAdicional ADD idNotaEntregaDetalle BIGINT CONSTRAINT fk_infoAdicional_Detalle_Nota FOREIGN KEY(idNotaEntregaDetalle) REFERENCES dbo.NotaEntregaDetalle(idNotaEntregaDetalle)


--UPDATe ha set idNotaEntregaDetalle =  (
--                                     SELECT TOP 1 nd.idNotaEntregaDetalle FROM NotaEntregaDetalle nd
--                                     where nd.idNotaEntrega = ha.idDocumento
--                                       and nd.idArticulo = ia.idArticulo 
--                                       and nd.estado = 1
--                                   ) 
       
--FROM Ventas.HistoryInfoAdicional ha
--INNER JOIN Compra.InfoAdicional  ia with (nolock) on ia.idInfoAdicional = ha.idInfoAdicional
--WHERE codDoc = 'NE'

--ALTER TABLE Ventas.HistoryInfoAdicional DROP COLUMN estab

--ALTER TABLE Ventas.HistoryInfoAdicional DROP COLUMN ptoEmi

--ALTER TABLE Ventas.HistoryInfoAdicional DROP COLUMN secuencial

--ALTER TABLE Ventas.HistoryInfoAdicional DROP COLUMN idDocumento

--ALTER TABLE Ventas.HistoryInfoAdicional DROP COLUMN codDoc

--SELECT * FROM Ventas.HistoryInfoAdicional  where idFacturaDetalle > 0

--ALTER TABLE InfoAdicionalDoc DROP COLUMN idArticuloInfoAdicional

--ALTER TABLE InfoAdicionalDoc DROP CONSTRAINT FK__InfoAdici__idArt__1D5C2FEB


--SELECT * FROM Compra.InfoAdicional

--> InfoAdicional

--ALTER TABLE InfoAdicionalDoc ADD idInfoAdicional INT CONSTRAINT fk_InfoAdicional_Compra FOREIGN KEY (idInfoAdicional) REFERENCES  Compra.InfoAdicional(idInfoAdicional)

--UPDATE FacturaDetalle set uuid = NEWID()

--ALTER TABLE FacturaDetalle ALTER COLUMN uuid UNIQUEIDENTIFIER NOT NULL

--ALTER TABLE FacturaDetalle ADD DEFAULT NEWID() FOR uuid


--UPDATE NotaEntregaDetalle set uuid = NEWID()

--ALTER TABLE NotaEntregaDetalle ALTER COLUMN uuid UNIQUEIDENTIFIER NOT NULL

--ALTER TABLE NotaEntregaDetalle ADD DEFAULT NEWID() FOR uuid

--ALTER TABLE Ventas.HistoryInfoAdicional ADD estado BIT 

--> UPDATE ESTADO
--> Anulado 6 


--update ia set ia.estado = CASE WHEN fd.estado = 0 then 0 
--                               WHEN es.codigo = 6 THEN 0
--                                                  else 1 end  
--FROM Ventas.HistoryInfoAdicional ia
--inner join dbo.FacturaDetalle fd on fd.idFacturaDetalle = ia.idFacturaDetalle
--inner join dbo.Factura        fa on fa.idFactura        = fd.idFactura
--inner join dbo.DocumentoElectronico de on de.idDocumentoElectronico = fa.idDocumentoElectronico
--inner join FactElect.EstadoServicio es on es.idEstadoServicio = de.idEstadoServicio

--update ia set estado = CASE WHEN nd.estado = 0   then 0 
--                        WHEN ep.codigo = 'A' then 0
--                                             else 1 end 
--FROM Ventas.HistoryInfoAdicional ia
--inner join dbo.NotaEntregaDetalle nd on nd.idNotaEntregaDetalle = ia.idNotaEntregaDetalle
--inner join dbo.NotaEntrega        ne on ne.idNotaEntrega        = nd.idNotaEntrega
--inner join Contabilidad.CuentaPorCobrar cc on cc.idDocumento = ne.idNotaEntrega AND cc.codDoc = 'NE'
--inner join dbo.EstadoPago               ep on ep.idEstadoPago = cc.idEstadoPago


--SELECT CASE WHEN nd.estado = 0   then 0 
--            WHEN ep.codigo = 'A' then 0
--                                 else 1 end , ep.descripcion
--FROM Ventas.HistoryInfoAdicional ia
--inner join dbo.NotaEntregaDetalle nd on nd.idNotaEntregaDetalle = ia.idNotaEntregaDetalle
--inner join dbo.NotaEntrega        ne on ne.idNotaEntrega        = nd.idNotaEntrega
--inner join Contabilidad.CuentaPorCobrar cc on cc.idDocumento = ne.idNotaEntrega AND cc.codDoc = 'NE'
--inner join dbo.EstadoPago               ep on ep.idEstadoPago = cc.idEstadoPago


--ALTER TABLE Ventas.HistoryInfoAdicional ALTER COLUMN estado BIT NOT NULL

--ALTER TABLE Ventas.HistoryInfoAdicional ADD DEFAULT 1 FOR estado


--> INFOADICIONAL

--update dt set idInfoAdicional =  (
--			                        SELECT ia.idInfoAdicional
--			                        FROM Ventas.HistoryInfoAdicional ia
--			                        inner join dbo.FacturaDetalle fd on fd.idFacturaDetalle = ia.idFacturaDetalle
--			                        inner join dbo.Factura        fa on fa.idFactura        = fd.idFactura
--			                        where fa.idFactura = dt.idComprobante
--	                           )
--FROM InfoAdicionalDoc dt WITH (NOLOCK)
--INNER JOIN TipoDocumento td with (nolock) on td.idTipoDocumento = dt.idTipoDocumento
--where td.codigoSri = '01'

--update dt set idInfoAdicional =  (
--			                        SELECT top 1  ia.idInfoAdicional
--			                        FROM Ventas.HistoryInfoAdicional ia
--			                        inner join dbo.NotaEntregaDetalle nd on nd.idNotaEntregaDetalle = ia.idNotaEntregaDetalle
--			                        inner join dbo.NotaEntrega        ne on ne.idNotaEntrega        = nd.idNotaEntrega
--			                        WHERE ne.idNotaEntrega = dt.idComprobante 
--	                           )
--FROM InfoAdicionalDoc dt WITH (NOLOCK)
--INNER JOIN TipoDocumento td with (nolock) on td.idTipoDocumento = dt.idTipoDocumento
--where td.codigo = 'NE'

select * from Ventas.HistoryInfoAdicional

-->

