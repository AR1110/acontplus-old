use [Acontplus]
go 

--ALTER TABLE dbo.ComprobanteIngreso ADD idCliente INT 

--ALTER TABLE ComprobanteIngreso
--ADD CONSTRAINT fk_cliente_comprobanteIngreso
--FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente);

--update ci   
--set ci.idCliente = (select top 1 cl.idCliente from Cliente cl where cl.idCliente = ci.idPersona)
--from ComprobanteIngreso ci
--where ci.codTipoPersona = 'CL'


--update ci   
--set ci.idCliente = (select top 1 cl.idCliente from Cliente cl where cl.numeroIdentificacion = ci.nroIdentificacion and cl.idEntidad = ci.idEntidad)
--from ComprobanteIngreso ci
--where ci.codTipoPersona = 'CL'
--AND ci.idCliente is null

--update ci   
--set ci.idCliente = (select top 1 cl.idCliente from Cliente cl where cl.numeroIdentificacion = ci.nroIdentificacion and cl.idEntidad = ci.idEntidad)
--from ComprobanteIngreso ci
--where ci.codTipoPersona = 'E'
--AND ci.idCliente is null

--INSERT INTO Cliente (idTipoIdentificacion,numeroIdentificacion,nombreFiscal,nombreComercial,idEntidad,idUsuario)
--select case when nroIdentificacion = '9999999999999' then (select top 1 ti.idTipoIdentificacion from TipoIdentificacion ti where ti.codigoSri = '07')
--            when LEN(nroIdentificacion) = 10         then (select top 1 ti.idTipoIdentificacion from TipoIdentificacion ti where ti.codigoSri = '05')
--            when LEN(nroIdentificacion) = 13         then (select top 1 ti.idTipoIdentificacion from TipoIdentificacion ti where ti.codigoSri = '04')
--                                                     ELSE (select top 1 ti.idTipoIdentificacion from TipoIdentificacion ti where ti.codigoSri = '06')
--       end as idTipoIdentificacion
--,nroIdentificacion,nombreFiscal,nombreFiscal,idEntidad
--,ISNULL((SELECT TOP 1 ur.idUsuario FROM App.UsuarioRol ur WHERE ur.idEntidad = ci.idEntidad),1)
--from dbo.ComprobanteIngreso ci
--where idCliente is null and codTipoPersona = 'CL'
--group by nroIdentificacion,nombreFiscal,idEntidad,idUsuario

--INSERT INTO Cliente (idTipoIdentificacion,numeroIdentificacion,nombreFiscal,nombreComercial,idEntidad,idUsuario)
--select case when nroIdentificacion = '9999999999999' then (select top 1 ti.idTipoIdentificacion from TipoIdentificacion ti where ti.codigoSri = '07')
--            when LEN(nroIdentificacion) = 10         then (select top 1 ti.idTipoIdentificacion from TipoIdentificacion ti where ti.codigoSri = '05')
--            when LEN(nroIdentificacion) = 13         then (select top 1 ti.idTipoIdentificacion from TipoIdentificacion ti where ti.codigoSri = '04')
--                                                     ELSE (select top 1 ti.idTipoIdentificacion from TipoIdentificacion ti where ti.codigoSri = '06')
--       end as idTipoIdentificacion
--,nroIdentificacion,nombreFiscal,nombreFiscal,idEntidad
--,ISNULL((SELECT TOP 1 ur.idUsuario FROM App.UsuarioRol ur WHERE ur.idEntidad = ci.idEntidad),1)
--from dbo.ComprobanteIngreso ci
--where idCliente is null and codTipoPersona = 'E'
--group by nroIdentificacion,nombreFiscal,idEntidad


--ALTER TABLE dbo.ComprobanteIngreso ALTER COLUMN idCliente INT NOT NULL

--Normalizacion

--ALTER TABLE ComprobanteIngreso DROP COLUMN idPersona

--ALTER TABLE ComprobanteIngreso DROP CONSTRAINT FK__Comproban__idTip__42D7CD5D

--ALTER TABLE ComprobanteIngreso DROP COLUMN idTipoPersona

--ALTER TABLE ComprobanteIngreso DROP COLUMN idSucursal

--ALTER TABLE ComprobanteIngreso DROP COLUMN codTipoPersona

--ALTER TABLE ComprobanteIngreso DROP COLUMN nroIdentificacion

--ALTER TABLE ComprobanteIngreso DROP COLUMN nombreFiscal

--ALTER TABLE ComprobanteIngreso DROP CONSTRAINT FK__Comproban__idTip__481C70BE

--ALTER TABLE ComprobanteIngreso DROP COLUMN idTipoDocumento

--ALTER TABLE dbo.ComprobanteIngreso  ADD idEstablecimiento INT CONSTRAINT fk_ComprobanteIngreso_Establecimiento FOREIGN KEY(idEstablecimiento) REFERENCES Sri.Establecimiento(idEstablecimiento)

--UPDATE ci
--set  ci.idEstablecimiento = (select top 1 e.idEstablecimiento from sri.establecimiento e where e.codEstab = ci.codEstab)
--from ComprobanteIngreso ci 

--ALTER TABLE ComprobanteIngreso ALTER COLUMN idEstablecimiento INT NOT NULL

--ALTER TABLE ComprobanteIngreso DROP CONSTRAINT FK__Comproban__codEs__420BC7E5

--ALTER TABLE ComprobanteIngreso DROP COLUMN codEstab

--ALTER TABLE dbo.ComprobanteIngreso ADD CustomerId INT 

--ALTER TABLE ComprobanteIngreso
--ADD CONSTRAINT fk_customer_comprobanteIngreso
--FOREIGN KEY (CustomerId) REFERENCES Customer.Customer(Id);
 
-- update ci set
--      ci.CustomerId = (select TOP 1 CustomerId from Cliente cl where cl.idCliente = ci.idCliente)
--from ComprobanteIngreso ci

--SELECT top 100 * from ComprobanteIngreso 

--ALTER TABLE dbo.ComprobanteIngreso ALTER COLUMN CustomerId INT NOT NULL

--ALTER TABLE ComprobanteIngreso DROP CONSTRAINT fk_cliente_comprobanteIngreso

--ALTER TABLE ComprobanteIngreso DROP COLUMN idCliente

--ALTER TABLE dbo.Cobro ADD idCuentaPorCobrar INT CONSTRAINT fk_idCuentaPorCobrar_Cobro
--FOREIGN KEY (idCuentaPorCobrar) REFERENCES Contabilidad.CuentaPorCobrar(idCuentaPorCobrar);

--> Anticipos

--update c    
--    set c.idCuentaPorCobrar = (select top 1 cc.idCuentaPorCobrar from Contabilidad.CuentaPorCobrar cc where cc.codDoc = 'A' and cc.idDocumento = c.idComprobante )
--FROM Cobro c
--inner join TipoDocumento td on td.idTipoDocumento = c.idTipoDocumento
--INNER JOIN ComprobanteIngreso ci on ci.idComprobanteIngreso = c.idComprobanteIngreso
--where td.codigo in ('A') 

--DEVOLUCIONES

--update c    
--    set c.idCuentaPorCobrar = (SELECT top 1 (SELECT top 1 cc.idCuentaPorCobrar FROM Contabilidad.CuentaPorCobrar cc where cc.codDoc = '04' and cc.idDocumento = de.idDocumento)
--        FROM dbo.DocumentoElectronico de where de.codDoc = '04' and de.idDocumentoElectronico = c.idComprobante ) 
--FROM Cobro c
--inner join TipoDocumento td on td.idTipoDocumento = c.idTipoDocumento
--INNER JOIN ComprobanteIngreso ci on ci.idComprobanteIngreso = c.idComprobanteIngreso
--where td.codigo in ('NC')

--update c    
--    set c.idCuentaPorCobrar = (select top 1 (SELECT top 1 cc.idCuentaPorCobrar FROM Contabilidad.CuentaPorCobrar cc where cc.codDoc = '04' and cc.idDocumento = nc.idNotaCredito) 
--       from dbo.NotaCredito nc where nc.idNotaCredito = c.idComprobante)
--FROM Cobro c
--inner join TipoDocumento td on td.idTipoDocumento = c.idTipoDocumento
--INNER JOIN ComprobanteIngreso ci on ci.idComprobanteIngreso = c.idComprobanteIngreso
--where td.codigo in ('NC')
--and idCuentaPorCobrar is null

--> Retenciones
--update c    
--    set c.idCuentaPorCobrar = (select TOP 1 (select top 1 cc.idCuentaPorCobrar 
--                      from Contabilidad.CuentaPorCobrar cc
--                      where cc.codDoc = '07' 
--                      and cc.idDocumento = dr.idDocumento) from FactElect.DocRelacionado rd
--       inner join Recepcion.DocumentoRecibido dr on dr.idDocumento = rd.idDocumentoRecibido
--       where dr.codDoc = '07' AND rd.idDocRelacionado = c.idComprobante)
--FROM Cobro c
--inner join TipoDocumento td on td.idTipoDocumento = c.idTipoDocumento
--INNER JOIN ComprobanteIngreso ci on ci.idComprobanteIngreso = c.idComprobanteIngreso
--where td.codigo in ('RC')

SELECT c.*
FROM Cobro c
INNER JOIN ComprobanteIngreso ci on ci.idComprobanteIngreso = c.idComprobanteIngreso
where c.idCuentaPorCobrar >0


--ALTER TABLE Cobro DROP CONSTRAINT FK__Cobro__idTipDocu__1B9E04AB

--ALTER TABLE Cobro DROP COLUMN idTipoDocumento

--ALTER TABLE Cobro DROP COLUMN idComprobante

