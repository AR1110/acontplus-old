use [Acontplus]
go 

--alter table MovimientoCaja add idEstablecimiento INT

--ALTER TABLE MovimientoCaja ADD  FK_MovimientoCaja_Establecimiento FOREIGN KEY (idEstablecimiento) REFERENCES Sri.Establecimiento(idEstablecimiento);

--update mc
--set mc.idEstablecimiento = (select top 1 es.idEstablecimiento from Sri.Establecimiento es where es.codEstab = mc.codEstab)
--from MovimientoCaja mc

--alter table MovimientoCaja alter column idEstablecimiento INT NOT NULL

--ALTER TABLE MovimientoCaja DROP CONSTRAINT FK__Movimient__codEs__42FFEC1E

--ALTER TABLE MovimientoCaja DROP COLUMN  codEstab

--ALTER TABLE MovimientoCaja DROP CONSTRAINT FK__Movimient__idEnt__3AED5E29

--ALTER TABLE MovimientoCaja DROP COLUMN idEntidadFinanciera


--ALTER TABLE MovimientoCaja DROP CONSTRAINT FK__Movimient__idSuc__3A42875C

--ALTER TABLE MovimientoCaja DROP COLUMN idSucursal

--ALTER TABLE MovimientoCaja ADD idComprobanteIngreso BIGINT CONSTRAINT FK_MovimientoCaja_ComprobanteIngreso FOREIGN KEY (idComprobanteIngreso) REFERENCES dbo.ComprobanteIngreso(idComprobanteIngreso)


--select (SELECT cd.idComprobanteIngreso FROM CobroDocumento cd where cd.idComprobante = mc.idMovimientoCaja and cd.idTipoDocumento = mc.idTipoDocumento)
--from MovimientoCaja mc
--inner join TipoDocumento td on td.idTipoDocumento = mc.idTipoDocumento
--where td.codigo = 'IC'

--UPDATE mc
--    set mc.idComprobanteIngreso = (SELECT cd.idComprobanteIngreso FROM CobroDocumento cd where cd.idComprobante = mc.idMovimientoCaja and cd.idTipoDocumento = mc.idTipoDocumento)
--from MovimientoCaja mc
--inner join TipoDocumento td on td.idTipoDocumento = mc.idTipoDocumento
--where td.codigo = 'IC'

--UPDATE mc
--    set mc.idComprobanteIngreso = (SELECT cd.idComprobanteIngreso FROM Cobro cd where cd.idComprobante = mc.idMovimientoCaja and cd.idTipoDocumento = mc.idTipoDocumento)
--from MovimientoCaja mc
--inner join TipoDocumento td on td.idTipoDocumento = mc.idTipoDocumento
--where td.codigo = 'IC'
--and mc.idComprobanteIngreso is null

--ALTER TABLE MovimientoCaja ADD idComprobanteEgreso BIGINT CONSTRAINT FK_MovimientoCaja_ComprobanteEgreso FOREIGN KEY (idComprobanteEgreso) REFERENCES dbo.ComprobanteEgreso(idComprobanteEgreso)--

--select (SELECT pd.idComprobanteEgreso FROM PagoDocumento pd where pd.idComprobante = mc.idMovimientoCaja and pd.idTipoDocumento = mc.idTipoDocumento)
--from MovimientoCaja mc
--inner join TipoDocumento td on td.idTipoDocumento = mc.idTipoDocumento
--where td.codigo = 'EC'


--update mc 
--set mc.idComprobanteEgreso = (SELECT pd.idComprobanteEgreso FROM PagoDocumento pd where pd.idComprobante = mc.idMovimientoCaja and pd.idTipoDocumento = mc.idTipoDocumento)
--from MovimientoCaja mc
--inner join TipoDocumento td on td.idTipoDocumento = mc.idTipoDocumento
--where td.codigo = 'EC'

--ALTER TABLE MovimientoCaja DROP CONSTRAINT FK__Movimient__idEmp__40EF84EB

--ALTER TABLE MovimientoCaja DROP COLUMN idEmpleado

select * from MovimientoCaja