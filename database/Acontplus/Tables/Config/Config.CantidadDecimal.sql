--select * from dbo.ConfigPorcentaje

--alter table dbo.ConfigPorcentaje add nroTotalDetalleVenta INT DEFAULT 2
--alter table dbo.ConfigPorcentaje add nroTotalDetalleCompra INT DEFAULT 2
--alter table dbo.ConfigPorcentaje add nroTotalCompra INT DEFAULT 2
--alter table dbo.ConfigPorcentaje add nroDescuentoCompra INT DEFAULT 2
--alter table dbo.ConfigPorcentaje add nroCantidadCompra INT DEFAULT 2
--alter table dbo.ConfigPorcentaje add nroIvaCompra INT DEFAULT 2


--ALTER TABLE TipoTransaccion ADD UNIQUE (codigo)

--INSERT INTO dbo.TipoTransaccion (descripcion,codigo,fechaRegistro)
--SELECT 'Almacen','AL',dbo.ufnGetDateEcuador()
select * from Config.cantidaddecimal
--select * from ConfigVentaDetalle

--INSERT INTO config.CantidadDecimal
--(idEntidad
--,idTipoTransaccion
--,nroPrecio
--,nroCantidad
--,nroIva
--,nroTotalSubTotal
--,nroDescuento
--  ,ruc
--  ,codTransaccion)
--SELECT 
--	 cp.idEntidad
--	,tt.idTipoTransaccion
--	,cp.nroPrecio
--	,cp.nroCantidad
--	,cp.nroIva
--	,cp.nroTotal
--	,cp.nroDescuento
--	,e.ruc
--	,tt.codigo
--FROM TipoTransaccion tt
--cross join ConfigPorcentaje cp 
--INNER JOIN dbo.Entidad e ON e.idEntidad = cp.idEntidad
--WHERE tt.codigo IN ('C','V','AL')
--ORDER BY cp.idEntidad,tt.descripcion

--UPDATE TipoTransaccion SET descripcion = 'Almacen' where idTipoTransaccion = 11

--CREATE TABLE Config.CantidadDecimal
--(
--	 idCantidadDecimal INT PRIMARY KEY IDENTITY(1,1)
--	,idEntidad INT FOREIGN KEY REFERENCES Entidad(idEntidad) NOT NULL
--	,idTipoTransaccion INT FOREIGN KEY REFERENCES TipoTransaccion(idTipoTransaccion) NOT NULL
--	,nroPrecio INT DEFAULT 2  
--	,nroCantidad INT DEFAULT 2
--	,nroIva INT DEFAULT 2
--	,nroDecuentoDetalle INT DEFAULT 2
--	,nroTotalDetalle INT DEFAULT 2
--	,nroTotalSubTotal INT DEFAULT 2
--	,nroDescuento INT DEFAULT 2
--	,nroIce INT DEFAULT 2
--  ,ruc NVARCHAR(50) 
--  ,codTransaccion NVARCHAR(10)
--	,estado BIT  DEFAULT 1 
--)

