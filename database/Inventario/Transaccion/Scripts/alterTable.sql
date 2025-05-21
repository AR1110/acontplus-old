USE [Acontplus]
GO 

--ALTER TABLE Inventario.TransaccionDetalle ADD valorImpuesto NUMERIC(18,5)


--ALTER TABLE Inventario.TransaccionDetalle ADD saldo numeric(18,5)
--SELECT top 10 * FROM Inventario.TransaccionDetalle

declare @table 

;WITH CTE_Saldos AS (
    SELECT ts.idTransaccion
          ,idArticulo
          ,idBodega
          ,ts.fechaEmision
          ,idTransaccionDetalle
          ,SUM(IIF(tt.codigo = 'S', -1, 1) * IIF(td.estado = 1, td.cantidadTransaccion, 0)) 
             OVER (PARTITION BY idArticulo, idBodega ORDER BY ts.fechaEmision, idTransaccionDetalle ASC) AS nuevoSaldo
    FROM Inventario.Transaccion              ts with (nolock)
    inner join inventario.TipoTransaccion    tt with (nolock) on tt.idTipoTransaccion = ts.idTipoTransaccion
    inner join Inventario.TransaccionDetalle td with (nolock) on td.idTransaccion     = ts.idTransaccion 
)update td set 
        td.saldo = sa.nuevoSaldo
from Inventario.TransaccionDetalle td with (nolock)
inner join CTE_Saldos              sa with (nolock) on sa.idTransaccionDetalle = td.idTransaccionDetalle