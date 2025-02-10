use Acontplus
go


--alter table Customer.Customer add CONSTRAINT fk_idType_Customer Foreign key(IdTypeId) references dbo.TipoIdentificacion(idTipoIdentificacion)

--update cc  set 
--       cc.IdTypeId = (select top 1 ti.idTipoIdentificacion from TipoIdentificacion ti where ti.codigoSri = cc.IDType)
--from Customer.Customer cc

--select top 10 * from Customer.Customer