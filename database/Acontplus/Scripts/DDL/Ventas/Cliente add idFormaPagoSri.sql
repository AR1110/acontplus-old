use [Acontplus]
go

ALTER TABLE dbo.Cliente ADD FormaPagoSriId INT 

ALTER TABLE dbo.Cliente ADD CONSTRAINT FK_Cliente_FormaPagoSri FOREIGN KEY(FormaPagoSriId) REFERENCES FormaPagoSri(idFormaPagoSri)

select * from FormaPagoSri


select top 1 * from cliente 
