use Acontplus
go


--alter table Customer.Customer add CONSTRAINT fk_idType_Customer Foreign key(IdTypeId) references dbo.TipoIdentificacion(idTipoIdentificacion)

--update cc  set 
--       cc.IdTypeId = cc.idTipoIdentificacion
--from Customer.Customer cc

--select top 10 * from Customer.Customer

--alter table customer.customer drop constraint FK__Customer__idTipo__01AB8225

--alter table Customer.Customer drop column idTipoIdentificacion