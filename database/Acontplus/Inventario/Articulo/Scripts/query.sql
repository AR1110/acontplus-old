use [Acontplus]
go 

--ALTER TABLE Articulo ADD UpdateAt DATETIME2

--ALTER TABLE Articulo ADD UserUpdateId INT

--select * from Restaurant.[order]

--select * from Articulo where codigo = 'A00547'

----select * from Inventario.Stock where idArticulo = 362376


----select * from Factura where idfactura = 532642


----select * from FacturaDetalle where idfactura = 532642 and estado = 1 

----select * from v_InventarioTransaccion where idArticulo = 362376

alter table ArticuloPvP ALTER COLUMN precioVenta NUMERIC(18,6) NOT NULL
alter table ArticuloPvP ALTER COLUMN precioConIva NUMERIC(18,6) NOT NULL