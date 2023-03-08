USE [AcontPlus]

GO

DECLARE @totalSalidas AS DECIMAL(15,5)
DECLARE @totalEntradas AS DECIMAL(15,5)
DECLARE @stockInicial DECIMAL(15,5)
DECLARE @idArticulo AS DECIMAL(15,5) = 225

DECLARE @entradas AS TABLE (
	idEntrada INT IDENTITY(1,1)
   ,idArticulo INT
   ,idMedida INT 
   ,idBodega INT
   ,cantidad DECIMAL(15,5)
   ,precioUnitario DECIMAL(15,5)
   ,precioCosto DECIMAL(15,5)
)


DECLARE @salidas AS TABLE (
	idSalida INT IDENTITY(1,1)
   ,idArticulo INT
   ,idMedida INT 
   ,idBodega INT
   ,cantidad DECIMAL(15,5)
   ,precioUnitario DECIMAL(15,5)
   ,precioCosto DECIMAL(15,5)
)

DECLARE @ariculo AS TABLE(
	 idArticulo INT 
	,entrada DECIMAL(15,5)
	,salida DECIMAL(15,5)
	,stock AS CAST(entrada - salida AS DECIMAL(15,5))
)

SELECT TOP 1 @stockInicial = stock FROM dbo.Articulo WHERE idArticulo = @idArticulo 

INSERT INTO @salidas(idArticulo,idMedida,idBodega,cantidad,precioUnitario,precioCosto)
SELECT idArticulo,idMedida,idBodega,cantidad,precioVenta,precioCosto  FROM FacturaDetalle where idArticulo = @idArticulo 

INSERT INTO @entradas(idArticulo,idMedida,idBodega,cantidad,precioUnitario,precioCosto)
SELECT idArticulo,idMedida,idBodega,cantidad,precioCosto,precioCosto  FROM FacturaCompraDetalle where idArticulo = @idArticulo 

select @totalEntradas = SUM(cantidad) from @entradas
select @totalSalidas = SUM(cantidad) from @salidas


insert into @ariculo (idArticulo,entrada,salida)
select @idArticulo,@totalEntradas,@totalSalidas


select * from @ariculo