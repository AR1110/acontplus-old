use [Acontplus]
go 


--ALTER TABLE Contabilidad.CuentaPorCobrar ALTER COLUMN idTiempoCredito INT NULL

--ALTER TABLE Contabilidad.CuentaPorCobrar ALTER COLUMN fechaVencimiento DATETIME2 NULL

--ALTER TABLE Contabilidad.CuentaPorCobrar ALTER COLUMN idPuntoEmision INT NULL

--ALTER TABLE Contabilidad.CuentaPorCobrar ADD DEFAULT 1 FOR estado

--INSERT INTO Contabilidad.CuentaPorCobrar
--                   (idPuntoEmision,idCliente,codDoc,fechaEmision, idEstadoPago,idDocumento,secuencial ,serieComprobante,importeTotal, idEntidad, idUsuario,fechaRegistro)
--select nc.idPuntoEmision
--      ,nc.idCliente
--      ,'04'
--      ,nc.fechaEmision
--      ,(select TOP 1 ep.idEstadoPago from EstadoPago ep where codigo = 'PE')
--      ,nc.idNotaCredito
--      ,nc.nroDocumento 
--      ,es.estab + '-' + pe.ptoEmi + '-' + [Helper].[F_Auto_Sequential](nroDocumento)
--      ,nc.total
--      ,nc.idEntidad
--      ,nc.idUsuario
--      ,nc.fechaRegistro 
--from NotaCredito nc
--inner join puntoEmision pe on pe.idPuntoEmision = nc.idPuntoEmision
--inner join Sri.Establecimiento es on es.codEstab = pe.codEstab


--INSERT INTO Contabilidad.CuentaPorCobrar
--                   (idCliente,codDoc,fechaEmision,idEstadoPago,idDocumento,secuencial ,serieComprobante,importeTotal,idEntidad,idUsuario,fechaRegistro)
--SELECT isnull((SELECT TOP 1 cl.idCliente FROM Cliente cl where cl.CustomerId = ci.CustomerId and cl.idEntidad = ci.idEntidad),182)
--      ,'A' as codDoc
--      ,a.fechaEmision
--      ,case ci.estado when 0 then (select TOP 1 ep.idEstadoPago from EstadoPago ep where codigo = 'A')
--                             else (select TOP 1 ep.idEstadoPago from EstadoPago ep where codigo = 'PE')
--       end 
--      ,a.idAnticipo
--      ,a.nroDoc
--      ,'A' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(a.nroDoc)
--      ,a.valor
--      ,a.idEntidad
--      ,a.idUsarioRegister
--      ,a.fechaEmision
--FROM dbo.Anticipo a 
--INNER JOIN ComprobanteIngreso ci ON ci.idComprobanteIngreso = a.idComprobanteIngreso
--INNER JOIN Sri.Establecimiento es on es.idEstablecimiento = ci.idEstablecimiento


--select * from Contabilidad.CuentaPorCobrar where codDoc = 'A'

--> Retenciones Recibidas

--INSERT INTO Contabilidad.CuentaPorCobrar
--                   (idCliente,codDoc,fechaEmision,idEstadoPago,idDocumento,secuencial ,serieComprobante,importeTotal,idEntidad,idUsuario,fechaRegistro)


--SELECT (select top 1 cl.idCliente from Cliente cl where cl.idEntidad = en.idEntidad and cl.numeroIdentificacion = dt.rucEmisor) as idcliente
--      ,dt.codDoc
--      ,CONVERT(datetime2,fechaEmision,103) as fechaEmision
--      ,(select TOP 1 ep.idEstadoPago from EstadoPago ep where codigo = 'PE') as idEstadoPago
--      ,dt.idDocumento
--      ,CAST(RIGHT(serieComprobante, CHARINDEX('-', REVERSE(serieComprobante)) - 1)as int) as secuencial
--      ,dt.serieComprobante
--      ,iSNULL
--                ((
--                    SELECT SUM(di.TaxValue) FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) WHERE di.DocumentoRecibidoId = dt.idDocumento
--                ),0)
--      ,en.idEntidad
--      ,dt.idUsuario
--      ,dt.fechaRegistro
--FROM Recepcion.DocumentoRecibido dt
--inner join Sri.Establecimiento es on es.idEstablecimiento = dt.idEstablecimiento
--inner join dbo.Entidad en on en.ruc = es.ruc
--WHERE codDoc = '07'
--and xmlCompressed IS NOT NULL



--INSERT INTO Cliente 
--(numeroIdentificacion,idTipoIdentificacion,idEntidad,idUsuario,nombreFiscal,nombreComercial,direccion)

--select rucEmisor
--      ,(select top 1 idTipoIdentificacion from TipoIdentificacion where codigoSri = '04')
--      ,idEntidad 
--      ,(select top 1 idUsuario from App.UsuarioRol where idEntidad = dt.idEntidad)
--      ,(SELECT TOP 1 BusinessName FROM Customer.Customer WHERE IDCard = rucEmisor)
--      ,(SELECT TOP 1 TradeName FROM Customer.Customer WHERE IDCard = rucEmisor)
--      ,(SELECT TOP 1 [Address] FROM Customer.Customer WHERE IDCard = rucEmisor)
   
--from (
--SELECT (select top 1 cl.idCliente from Cliente cl where cl.idEntidad = en.idEntidad and cl.numeroIdentificacion = dt.rucEmisor) as idcliente
--      ,dt.codDoc
--      ,CONVERT(datetime2,fechaEmision,103) as fechaEmision
--      ,(select TOP 1 ep.idEstadoPago from EstadoPago ep where codigo = 'PE') as idEstadoPago
--      ,dt.idDocumento
--      ,CAST(RIGHT(serieComprobante, CHARINDEX('-', REVERSE(serieComprobante)) - 1)as int) as secuencial
--      ,dt.serieComprobante
--      ,0 as importeTotal
--      ,en.idEntidad
--      ,dt.idUsuario
--      ,dt.fechaRegistro
--      ,dt.rucEmisor
--FROM Recepcion.DocumentoRecibido dt
--inner join Sri.Establecimiento es on es.idEstablecimiento = dt.idEstablecimiento
--inner join dbo.Entidad en on en.ruc = es.ruc
--WHERE codDoc = '07'
--and xmlCompressed IS NOT NULL
--) as dt 
--where dt.idcliente is null
--GROUP BY rucEmisor,idEntidad

--select * from Cliente where numeroIdentificacion = '1718344896001'

--INSERT INTO Customer.Customer (IDType,IDCard,BusinessName,TradeName,Email,Telephone,[Address],SriValidation)
--SELECT '04','1718344896001','MANOSALVAS BUITRON GABRIELA FERNANDA','MANOSALVAS BUITRON GABRIELA FERNANDA',NULL,NULL,'PICHINCHA - QUITO - TURUBAMBA - AV. SIMON BOLIVAR S-N Y LEONIDAS DUBLES',1

--INSERT INTO Customer.Customer (IDType,IDCard,BusinessName,TradeName,Email,Telephone,[Address],SriValidation)
--SELECT '04','1791260376001','FANLO BARBA MARIA MACARENA','TELEAMAZONAS',NULL,NULL,'PICHINCHA - QUITO - RUMIPAMBA - JOSE VILLALENGUA OE4-22 Y AVENIDA AMERICA	',1

--INSERT INTO Customer.Customer (IDType,IDCard,BusinessName,TradeName,Email,Telephone,[Address],SriValidation)
--SELECT '04','1790018032001','ESPINOSA ESPINOSA PABLO ESTEVAN','ESPINOSA PAEZ S.A',NULL,NULL,'PICHINCHA / QUITO / ITCHIMBIA / RAFAEL LEON LARREA N24-147 Y VIZCAYA',1

--> Actualacion de estados 

--> NOTA CREDITO

--SELECT * FROM (

--select (select top 1 CASE es.codigo WHEN 6 THEN (select descripcion from EstadoPago where codigo = 'A') 
--                                           else (select descripcion from EstadoPago where codigo = 'PE') 
--                     END 
--        from DocumentoElectronico de
--        inner join FactElect.EstadoServicio es on es.idEstadoServicio = de.idEstadoServicio
--        where de.codDoc = '04' 
--        and de.idDocumento = cc.idDocumento) as estadoDoc
--        ,cc.*
--from Contabilidad.CuentaPorCobrar cc where codDoc = '04'
--) as dt 
--where dt.estadoDoc is null

--update cc
--    set cc.idEstadoPago = ISNULL((select top 1 CASE es.codigo WHEN 6 THEN (select idEstadoPago from EstadoPago where codigo = 'A') 
--                                           else (select idEstadoPago from EstadoPago where codigo = 'PE') 
--                                         END 
--                            from DocumentoElectronico de
--                            inner join FactElect.EstadoServicio es on es.idEstadoServicio = de.idEstadoServicio
--                            where de.codDoc = '04' 
--                            and de.idDocumento = cc.idDocumento),cc.idEstadoPago)
--from Contabilidad.CuentaPorCobrar cc
--where codDoc = '04'


--select * from EstadoPago where codigo = 'A'

--SELECT * FROM FactElect.EstadoServicio WHERE idEstadoServicio = 5

--UPDATE cc set
--    cc.idEstadoPago = (select idEstadoPago from EstadoPago where codigo = 'APL')
--FROM Contabilidad.CuentaPorCobrar cc
--inner join dbo.cobro              co on co.idCuentaPorCobrar    = cc.idCuentaPorCobrar
--inner join dbo.ComprobanteIngreso ci on ci.idComprobanteIngreso = co.idComprobanteIngreso
--where cc.codDoc = '04'
--and ci.estado = 1

--select * from EstadoPago where codigo = 'APL'

--> Anticipos

--UPDATE Contabilidad.CuentaPorCobrar set idEstadoPago = 1 where codDoc = 'A'

--UPDATE cc set
--       cc.idEstadoPago = CASE ci.estado when 1 then (select idEstadoPago from EstadoPago where codigo = 'APL')
--                                        when 0 then (select idEstadoPago from EstadoPago where codigo = 'A')
--                                               ELSE (select idEstadoPago from EstadoPago where codigo = 'PE')
--                         END 
--FROM Contabilidad.CuentaPorCobrar cc
--inner join dbo.cobro              co on co.idCuentaPorCobrar    = cc.idCuentaPorCobrar
--inner join dbo.ComprobanteIngreso ci on ci.idComprobanteIngreso = co.idComprobanteIngreso
--where cc.codDoc = 'A'

--> Retenciones

--UPDATE cc set
--    cc.idEstadoPago = 11
--FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK)
--inner join dbo.cobro              co WITH (NOLOCK) on co.idCuentaPorCobrar    = cc.idCuentaPorCobrar
--inner join dbo.ComprobanteIngreso ci WITH (NOLOCK) on ci.idComprobanteIngreso = co.idComprobanteIngreso
--where cc.codDoc = '07'
--and ci.estado = 1



--> Drop
--DROP PROCEDURE IF EXISTS [Contabilidad].[CuentaPorCobrar_Insert];

--DROP PROCEDURE IF EXISTS [Contabilidad].[CuentaPorCobrar_Update];

--DROP PROCEDURE IF EXISTS [Contabilidad].[CuentaPorCobrar_Update_Status];


--alter table Contabilidad.CuentaPorCobrar add UpdatedAt DATETIME2