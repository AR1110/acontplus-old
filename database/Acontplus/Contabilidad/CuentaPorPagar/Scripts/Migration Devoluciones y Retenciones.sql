USE [Acontplus]
GO 

set language spanish;

-->CodDoc = '07'
--INSERT INTO Contabilidad.CuentaPorPagar
--			      (codDoc,fechaEmision, idEstablecimiento, idProveedor, idEstadoPago, uniqueId, serieComprobante, importeTotal, idEntidad, idUsuario,idDocumento)

--select codDoc
--    ,CONVERT (datetime2, fechaEmision, 103)  as fechaEmision
--	,dr.idEstablecimiento
--	,(SELECT TOP 1 pr.idProveedor FROM Proveedor pr where pr.numeroIdentificacion = dr.rucEmisor and pr.idEntidad = en.idEntidad ) as idProveedor
--	,(SELECT TOP 1 ep.idEstadoPago FROM dbo.EstadoPago ep where ep.codigo = 'PE')												   as idEstadoPago
--	,dr.claveAcceso
--	,dr.serieComprobante
--	,ISNULL
--                      ((
--                        SELECT SUM(di.TaxValue + di.TaxBase) FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) WHERE di.DocumentoRecibidoId = dr.idDocumento

--                      ),0)
--	,en.idEntidad
--	,dr.idUsuario
--	,dr.idDocumento
--from Recepcion.DocumentoRecibido dr
--inner join Sri.Establecimiento es on es.idEstablecimiento = dr.idEstablecimiento
--inner join dbo.Entidad         en on en.ruc			      = es.ruc
--where codDoc = '04'
--  and xmlCompressed is not null

--INSERT INTO Contabilidad.CuentaPorPagar
--			      (codDoc,fechaEmision, idEstablecimiento, idProveedor, idEstadoPago, uniqueId, serieComprobante, importeTotal, idEntidad, idUsuario,idDocumento)
--SELECT codDoc
--      ,fechaEmision
--      ,(SELECT top 1 es.idEstablecimiento FROM Sri.Establecimiento es where es.codEstab = rt.codEstab) as idEstablecimiento
--      ,rt.idProveedor
--      ,(SELECT TOP 1 ep.idEstadoPago FROM dbo.EstadoPago ep where ep.codigo = 'PE')					   as idEstadoPago
--      ,rt.claveAcceso
--      ,rt.estab + '-' + rt.ptoEmi + '-' + Helper.F_Auto_Sequential(rt.secuencial)                      as serieComprobante
--      ,ISNULL((SELECT SUM(ats.valorRetenido) FROM FactElect.RetencionAtsRet ats WHERE ats.idRetencionAts = rt.idRetencionAts),0)
--      ,en.idEntidad
--      ,rt.idUsuario
--      ,rt.idRetencionAts
--FROM FactElect.RetencionAts rt
--inner join Sri.Establecimiento es on es.codEstab = rt.codEstab
--inner join dbo.Entidad         en on en.ruc		 = es.ruc

--INSERT INTO Contabilidad.CuentaPorPagar
--			      (codDoc,fechaEmision, idEstablecimiento, idProveedor, idEstadoPago, uniqueId, serieComprobante, importeTotal, idEntidad, idUsuario,idDocumento)
--SELECT '07' as codDoc
--      ,fechaEmision
--      ,es.idEstablecimiento
--      ,rc.idProveedor
--      ,(SELECT TOP 1 ep.idEstadoPago FROM dbo.EstadoPago ep where ep.codigo = 'PE') as idEstadoPago
--      ,rc.claveAcceso
--      ,es.estab + '-' + pe.ptoEmi + '-' + Helper.F_Auto_Sequential(rc.nroDocumento) as serieComprobante
--      ,rc.total
--      ,rc.idEntidad
--      ,rc.idUsuario
--      ,rc.idRetencionCompra
--FROM dbo.RetencionCompra rc
--inner join PuntoEmision pe on pe.idPuntoEmision = rc.idPuntoEmision
--inner join sri.Establecimiento es on es.codEstab = pe.codEstab


--select * from EstadoPago where codigo = 'APL'


--UPDATE Contabilidad.CuentaPorPagar SET idEstadoPago = (select top 1 idEstadoPago from EstadoPago where codigo = 'APL')
--where uniqueId in (

--select claveAcceso from dbo.DocumentoElectronico WHERE idDocumentoElectronico in (

--SELECT idComprobante
--FROM Pago pa WITH (NOLOCK)
--inner join ComprobanteEgreso ce on ce.idComprobanteEgreso = pa.idComprobanteEgreso
--INNER JOIN TipoDocumento td on td.idTipoDocumento = PA.idTipoDocumento
--where td.codigoSri in ('07')
--and ce.estado = 1
--)
--)


--UPDATE Contabilidad.CuentaPorPagar SET idEstadoPago = (select top 1 idEstadoPago from EstadoPago where codigo = 'APL')
--where uniqueId in (

--select dr.claveAcceso FROM factelect.DocRelacionado d
--			    INNER JOIN Recepcion.DocumentoRecibido dr ON dr.idDocumento = d.idDocumentoRecibido WHERE d.idDocRelacionado in (

--SELECT idComprobante
--FROM Pago pa WITH (NOLOCK)
--inner join ComprobanteEgreso ce on ce.idComprobanteEgreso = pa.idComprobanteEgreso
--INNER JOIN TipoDocumento td on td.idTipoDocumento = PA.idTipoDocumento
--where td.codigoSri in ('04')
--and ce.estado = 1


--)
--)

--DELETE FROM  Contabilidad.CuentaPorPagar WHERE codDoc IN ('04','07')

--SELECT cp.idCuentaPorPagar as idComprobante
--      ,(SELECT TOP 1 idTipoDocumento FROM dbo.TipoDocumento td (NOLOCK) WHERE td.codigoSri = cp.codDoc) as idTipoDocumento
--      ,cp.serieComprobante                                                                              as nroDocumento
--      ,IIF(cp.codDoc = '04','Nota Credito','Comprobante Retención')                                     as tipoDocumento
--      ,importeTotal
--      ,CASE cp.codDoc WHEN '04' THEN (SELECT TOP 1 d.numDocSustento FROM factelect.DocRelacionado d WITH (NOLOCK) WHERE d.idDocumentoRecibido = cp.idDocumento )
--                      WHEN '07' THEN (SELECT TOP 1 rs.numAutDocSustento FROM FactElect.RetAtsDocSustento rs WITH (NOLOCK) WHERE rs.idRetencionAts = cp.idDocumento)
--       END                                                                                              as numAutDocSustento
--FROM Contabilidad.CuentaPorPagar cp WITH (NOLOCK)
--INNER JOIN dbo.EstadoPago        ep WITH (NOLOCK) ON ep.idEstadoPago = cp.idEstadoPago
--WHERE cp.codDoc IN ('04','07')
--  AND cp.idProveedor = 1267
--  AND ep.codigo = 'PE'
--  AND importeTotal > 0

--ALTER TABLE dbo.Pago ADD idCuentaPorPagar INT CONSTRAINT fk_Pago_idCuentaPorCobrar FOREIGN KEY(idCuentaPorPagar) REFERENCES Contabilidad.CuentaPorPagar(idCuentaPorPagar)

--UPDATE pa set 
--       pa.idCuentaPorPagar = case td.codigoSri when '07' THEN ISNULL((
--                                            SELECT (SELECT top 1 idCuentaPorPagar FROM Contabilidad.CuentaPorPagar cc WHERE cc.uniqueId = de.claveAcceso)
--                                            FROM dbo.DocumentoElectronico de
--                                            where de.idDocumentoElectronico = pa.idComprobante
--                                        )
--                                        ,
--                                          (
--                                           SELECT (SELECT top 1 idCuentaPorPagar FROM Contabilidad.CuentaPorPagar cc WHERE cc.uniqueId = rc.claveAcceso)
--                                           FROM RetencionCompra rc
--                                           WHERE rc.idRetencionCompra = pa.idComprobante
--                                          )
--                                        )
--                                        when '04' then (select (SELECT top 1 idCuentaPorPagar FROM Contabilidad.CuentaPorPagar cc WHERE cc.uniqueId = rd.claveAcceso)
--            from FactElect.DocRelacionado dr
--            inner join Recepcion.DocumentoRecibido rd on rd.idDocumento = dr.idDocumentoRecibido
--            where dr.idDocRelacionado = pa.idComprobante)
                                    
--       END
--FROM Pago pa
--inner join ComprobanteEgreso ce on ce.idComprobanteEgreso = pa.idComprobanteEgreso
--INNER JOIN TipoDocumento td on td.idTipoDocumento = pa.idTipoDocumento
--where td.codigoSri in ('07')

--SELECT   (
--            select (SELECT top 1 idCuentaPorPagar FROM Contabilidad.CuentaPorPagar cc WHERE cc.uniqueId = rd.claveAcceso)
--            from FactElect.DocRelacionado dr
--            inner join Recepcion.DocumentoRecibido rd on rd.idDocumento = dr.idDocumentoRecibido
--            where dr.idDocRelacionado = pa.idComprobante
--          )
--        ,idComprobante,td.codigoSri,idCuentaPorPagar
--FROM Pago pa WITH (NOLOCK)
--inner join ComprobanteEgreso ce on ce.idComprobanteEgreso = pa.idComprobanteEgreso
--INNER JOIN TipoDocumento td on td.idTipoDocumento = PA.idTipoDocumento
--where td.codigoSri in ('04')
--  and pa.idCuentaPorPagar is null

--ALTER TABLE Pago DROP CONSTRAINT [FK__Pago__idTipoDocu__0544AF38]

--ALTER TABLE pago drop column [idTipoDocumento]

--ALTER TABLE pago drop column [idComprobante]

--ALTER TABLE pago drop column [versionComp]

select * from Pago


