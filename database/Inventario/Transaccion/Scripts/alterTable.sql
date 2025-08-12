USE [Acontplus]
GO 

--ALTER TABLE Inventario.TransaccionDetalle ADD valorImpuesto NUMERIC(18,5)

--ALTER TABLE Inventario.TransaccionDetalle ADD saldo numeric(18,5)
--SELECT top 10 * FROM Inventario.TransaccionDetalle

--insert into Inventario.TipoDocumento (codigo,codigoSri,orden,descripcion)
--select 'ND','05',1,'Nota de Débito'


--ALTER TABLE Inventario.TransaccionDetalle ADD AjusteId BIGINT CONSTRAINT fk_ajuste_kardex_transacion FOREIGN KEY REFERENCES Inventario.Transaccion(idTransaccion)
-- Id Ajuste


SELECT 
    sd.idBodega,
    sd.idArticulo,
    tt.idTransaccion,
    tt.fechaEmision
INTO #TempCI
FROM Inventario.Transaccion              tt WITH (NOLOCK)
INNER JOIN Inventario.TipoDocumento      td WITH (NOLOCK) ON td.idTipoDocumento = tt.idTipoDocumento
INNER JOIN Inventario.TransaccionDetalle sd WITH (NOLOCK) ON sd.idTransaccion   = tt.idTransaccion
WHERE td.codigo = 'CI'
  AND sd.estado = 1

-- Crear índice en la tabla temporal
CREATE INDEX IX_TempCI ON #TempCI (idBodega, idArticulo, fechaEmision DESC)

-- Actualizar usando la tabla temporal
UPDATE dt 
SET dt.AjusteId = CASE  WHEN td.codigo = 'CI' THEN tr.idTransaccion 
                                              ELSE t.idTransaccion
END
FROM Inventario.TransaccionDetalle    dt 
INNER JOIN Inventario.Transaccion     tr WITH (NOLOCK) ON tr.idTransaccion = dt.idTransaccion
INNER JOIN Inventario.TipoTransaccion tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
INNER JOIN Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento = tr.idTipoDocumento
OUTER APPLY (
    SELECT TOP 1 tc.idTransaccion
    FROM #TempCI tc
    WHERE tc.idBodega      = dt.idBodega 
      AND tc.idArticulo    = dt.idArticulo
      AND tc.fechaEmision <= tr.fechaEmision
    ORDER BY tc.fechaEmision DESC
) t

DROP TABLE #TempCI;


--> saldo

--alter table Inventario.TransaccionDetalle add saldo numeric(18,5) 

--update Inventario.TransaccionDetalle set cantidadTransaccion = 0 where estado in (0,2)


WITH CTE_Salidas AS (
        SELECT t4.idTransaccionDetalle
               ,-1 * t4.cantidadTransaccion as cantidadTransaccionNegativa
        FROM inventario.Transaccion              t1 with (nolock)
        inner join inventario.tipoDocumento      t2 with (nolock) on t2.idTipoDocumento   = t1.idTipoDocumento
        inner join inventario.TipoTransaccion    t3 with (nolock) on t3.idTipoTransaccion = t1.idTipoTransaccion
        inner join inventario.Transacciondetalle t4 with (nolock) on t4.idTransaccion     = t1.idTransaccion
        where t3.codigo = 'S'
        and t4.estado = 1
)
UPDATE td 
SET td.cantidadTransaccion = sa.cantidadTransaccionNegativa 
FROM Inventario.TransaccionDetalle td WITH (NOLOCK)
INNER JOIN CTE_Salidas             sa WITH (NOLOCK) ON sa.idTransaccionDetalle = td.idTransaccionDetalle;


WITH CTE_Saldos AS (
    SELECT idTransaccionDetalle
          ,SUM(td.cantidadTransaccion) OVER (PARTITION BY idArticulo, idBodega, td.ajusteId ORDER BY ts.fechaEmision, idTransaccionDetalle ASC) AS nuevoSaldo
    FROM Inventario.Transaccion              ts WITH (NOLOCK)
    INNER JOIN inventario.TipoTransaccion    tt WITH (NOLOCK) ON tt.idTipoTransaccion = ts.idTipoTransaccion
    INNER JOIN Inventario.TransaccionDetalle td WITH (NOLOCK) ON td.idTransaccion     = ts.idTransaccion
)
UPDATE td 
SET td.saldo = sa.nuevoSaldo 
FROM Inventario.TransaccionDetalle td WITH (NOLOCK)
INNER JOIN CTE_Saldos              sa WITH (NOLOCK) ON sa.idTransaccionDetalle = td.idTransaccionDetalle;


alter table Inventario.TransaccionDetalle alter column saldo numeric(18,5) not null

alter table Inventario.TransaccionDetalle add default 1 for saldo 

