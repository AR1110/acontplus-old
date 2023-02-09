
ALTER TABLE FacturaCompra ADD estab VARCHAR(4) NULL
ALTER TABLE FacturaCompraDetalle ALTER COLUMN idTipoIva INT NULL

ALTER TABLE FacturaCompraDetalle ALTER COLUMN precioCostoNeto DECIMAL(15,5) NULL

ALTER TABLE FacturaCompraDetalle ALTER COLUMN porcentajeDescuento DECIMAL(15,5) NULL

ALTER TABLE Proveedor ALTER COLUMN nombreComercial NVARCHAR(300) NULL
ALTER TABLE Proveedor ALTER COLUMN nombreFiscal NVARCHAR(300) NULL
ALTER TABLE Proveedor ALTER COLUMN direccion NVARCHAR(300) NULL


--select  * from FacturaCompra fc

--update fc set fc.estab = left(fc.puntoEmision, charindex('-', fc.puntoEmision) - 1) 

----select left(fc.puntoEmision, charindex('-', fc.puntoEmision) - 1), puntoEmision
--from FacturaCompra fc

--where LEN(RTRIM(LTRIM(puntoEmision))) > 3

----punto emision
--update fc set fc.puntoEmision = right(fc.puntoEmision, charindex('-', fc.puntoEmision) - 1) 

----select right(fc.puntoEmision, charindex('-', fc.puntoEmision) - 1), puntoEmision
--from FacturaCompra fc

--where LEN(RTRIM(LTRIM(puntoEmision))) > 3