use [Acontplus]
go


--alter table Proveedor alter column CustomerId INT NOT NULL

--alter table proveedor drop constraint df_prov_validation_sri

--alter table proveedor drop column validationSri 

--ALTER TABLE proveedor drop column numeroIdentificacion 

--alter table proveedor drop column nombreComercial 

--alter table proveedor drop column nombreFiscal

--alter table proveedor add UpdatedByUserId INT CONSTRAINT fk_User_ProveedorUpdate FOREIGN KEY (UpdatedByUserId) references dbo.Usuario(idUsuario)

--alter table proveedor add UpdatedAt DATETIME2 

SELECT top 10 * FROM dbo.Proveedor

--update pr set
--       pr.CustomerId = (select top 1 cu.Id from Customer.Customer cu where cu.IDCard = pr.numeroIdentificacion)
--from dbo.Proveedor pr
--where pr.CustomerId is null

--select top 1 * from Customer.Customer