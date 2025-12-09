USE [Acontplus]
GO 
--> NUEVO DOCUMENTO PARA EL REGISTRO DE ANULACION DE DOCUMENTOS DE INVENTARIO.

--insert into Inventario.TipoDocumento 
--(codigo,descripcion,estado,orden)
--select 'OP','Orden de Producción',1,11

--insert into Inventario.TipoDocumento (codigo,descripcion,estado,orden)
--select 'AD','Anulacion',1,12

--insert into dbo.TipoDocumento(codigo,descripcion,fechaRegistro,aplicacionId,secuencial)
--select 'AD','Anulacion',GETDATE(),1,0

--insert into Inventario.TipoDocumento (codigo,descripcion,estado,orden)
--select 'AJ','Ajuste',1,13

--insert into dbo.TipoDocumento(codigo,descripcion,fechaRegistro,aplicacionId,secuencial)
--select 'AJ','Ajuste',GETDATE(),1,0

--insert into configuracionDocumento (idPuntoEmision,idTipoDocumento,ultimaSecuencia,fechaRegistro )
--SELECT idPuntoEmision,idTipoDocumento,1,getdate()
--FROM dbo.PuntoEmision pe
--cross join dbo.TipoDocumento td
--where pe.estado = 1
--and td.codigo = 'AD'

--insert into configuracionDocumento (idPuntoEmision,idTipoDocumento,ultimaSecuencia,fechaRegistro )
--SELECT idPuntoEmision,idTipoDocumento,1,getdate()
--FROM dbo.PuntoEmision pe
--cross join dbo.TipoDocumento td
--where pe.estado = 1
--and td.codigo = 'AJ'

--> CREACION DE IDTRANSACCIONORIGINAL PARA LOS PROCESO DE ANULACION Y AJUSTES

--alter table Inventario.Transaccion ADD idTransaccionOriginal BIGINT CONSTRAINT fk_TransaccionOriginal_transacion FOREIGN KEY REFERENCES Inventario.Transaccion(IdTransaccion)

--alter table Inventario.Transaccion add default 0 for idDocumento

--alter table Inventario.Transaccion drop constraint U_Code_Transa

--alter table Inventario.Transaccion drop column uniqueId

--> ||| LAS TRANSACCIONES SERAN DATOS UNICOS, SU MOVIMIENTO SERA EN LOS DETALLES DE CADA UNO, PROCESO PARA ACTUALIZAR Y BORRA EL DOBLE REGISTRO DE LAS TRANFERENCIAS 

--UPDATE dt SET 
--       dt.idTransaccion  = 
--       (
--            SELECT TOP 1 sb.idTransaccion
--            FROM Inventario.Transaccion sb
--            inner join Inventario.tipotransaccion ss on ss.idTipoTransaccion = sb.idTipoTransaccion
--            INNER JOIN Inventario.TipoDocumento   td on td.idTipoDocumento = sb.idTipoDocumento
--            where sb.idDocumento = tr.idDocumento
--              and ss.codigo = 'E'
--              and td.codigo = 'TB'
--       )

--FROM  inventario.transacciondetalle dt 
--inner join inventario.transaccion    tr on tr.idTransaccion   = dt.idtransaccion
--inner join  inventario.tipoDocumento td on td.idTipoDocumento = tr.idTipoDocumento
--where td.codigo = 'TB'

--delete from Inventario.Transaccion where idTransaccion in
--(
--    select tr.idTransaccion from Inventario.Transaccion tr
--    inner join Inventario.TipoTransaccion tt on tt.idTipoTransaccion = tr.idTipoTransaccion
--    inner join Inventario.TipoDocumento   td on td.idTipoDocumento = tr.idTipoDocumento
--    where tt.codigo = 'S' AND td.codigo = 'TB'
--)


--ALTER TABLE Inventario.TransaccionDetalle ADD AjusteId BIGINT CONSTRAINT fk_ajuste_kardex_transacion FOREIGN KEY REFERENCES Inventario.Transaccion(idTransaccion)
-- Id Ajuste
-- Versión optimizada usando CTEs en lugar de tablas temporales
WITH InventarioCI AS (
    SELECT 
        sd.idBodega,
        sd.idArticulo,
        tt.idTransaccion,
        tt.fechaEmision,
        tt.fechaRegistro
    FROM Inventario.Transaccion tt WITH (NOLOCK)
    INNER JOIN Inventario.TipoDocumento td WITH (NOLOCK) 
        ON td.idTipoDocumento = tt.idTipoDocumento
    INNER JOIN Inventario.TransaccionDetalle sd WITH (NOLOCK) 
        ON sd.idTransaccion = tt.idTransaccion
    WHERE td.codigo = 'CI'
      AND sd.estado = 1
),
TransaccionesConFecha AS (
    SELECT 
        dt.idTransaccionDetalle,
        dt.idBodega,
        dt.idArticulo,
        tr.fechaRegistro,
        td.codigo,
        dt.idTransaccion
    FROM Inventario.TransaccionDetalle dt WITH (NOLOCK)
    INNER JOIN Inventario.Transaccion tr WITH (NOLOCK) 
        ON tr.idTransaccion = dt.idTransaccion
    INNER JOIN Inventario.TipoDocumento td WITH (NOLOCK) 
        ON td.idTipoDocumento = tr.idTipoDocumento
    WHERE dt.estado = 1
),
CIConRanking AS (
    SELECT 
        ci.*,
        tcf.idTransaccionDetalle,
        tcf.codigo AS tipoTransaccion,
        tcf.idTransaccion AS idTransaccionOriginal,
        ROW_NUMBER() OVER (
            PARTITION BY tcf.idTransaccionDetalle 
            ORDER BY ci.fechaEmision DESC
        ) as rn
    FROM TransaccionesConFecha tcf
    LEFT JOIN InventarioCI ci 
        ON ci.idBodega = tcf.idBodega 
        AND ci.idArticulo = tcf.idArticulo
        AND ci.fechaEmision <= tcf.fechaRegistro
)
UPDATE dt 
SET dt.AjusteId = CASE 
    WHEN cr.tipoTransaccion = 'CI' THEN cr.idTransaccionOriginal
    ELSE cr.idTransaccion
END
FROM Inventario.TransaccionDetalle dt
INNER JOIN CIConRanking cr ON cr.idTransaccionDetalle = dt.idTransaccionDetalle
WHERE cr.rn = 1 OR cr.rn IS NULL;


----> saldo

----alter table Inventario.TransaccionDetalle add saldo numeric(18,5) 


----WITH CTE_Salidas AS (
----        SELECT t4.idTransaccionDetalle
----               ,-1 * t4.cantidadTransaccion as cantidadTransaccionNegativa
----               ,t2.codigo as codDoc 
----        FROM inventario.Transaccion              t1 with (nolock)
----        inner join inventario.tipoDocumento      t2 with (nolock) on t2.idTipoDocumento   = t1.idTipoDocumento
----        inner join inventario.TipoTransaccion    t3 with (nolock) on t3.idTipoTransaccion = t1.idTipoTransaccion
----        inner join inventario.Transacciondetalle t4 with (nolock) on t4.idTransaccion     = t1.idTransaccion
----        where t3.codigo = 'S'
----        and t4.estado = 1
----)
----UPDATE td 
----SET td.cantidadTransaccion = sa.cantidadTransaccionNegativa 
----from Inventario.TransaccionDetalle td WITH (NOLOCK)
----INNER JOIN CTE_Salidas        sa WITH (NOLOCK) ON sa.idTransaccionDetalle = td.idTransaccionDetalle
----where codDoc != 'NC' AND td.cantidadTransaccion > 0
----;


--update td set td.cantidadTransaccion = (td.cantidad * td.conversion) * - 1  
--from Inventario.transacciondetalle td
--inner join inventario.transaccion tr on tr.idtransaccion = td.idtransaccion
--inner join Inventario.TipoDocumento  dt on dt.idTipoDocumento = tr.idTipoDocumento
--inner join Inventario.TipoTransaccion tt on tt.idTipoTransaccion = tr.idTipoTransaccion
--where tt.codigo = 'S'
--AND dt.codigo in ('FE','NE','BI','TB')
--AND td.cantidadTransaccion > 0
--and td.estado = 1

--select td.*  
--from Inventario.transacciondetalle td
--inner join inventario.transaccion tr on tr.idtransaccion = td.idtransaccion
--inner join Inventario.TipoDocumento  dt on dt.idTipoDocumento = tr.idTipoDocumento
--inner join Inventario.TipoTransaccion tt on tt.idTipoTransaccion = tr.idTipoTransaccion
--where tt.codigo = 'S'
--AND dt.codigo in ('FE','NE','BI','TB')
--AND td.cantidadTransaccion > 0
--and td.estado = 1


WITH CTE_Saldos AS (
    SELECT idTransaccionDetalle
          ,SUM(td.cantidadTransaccion) OVER (PARTITION BY td.idArticulo, td.idBodega, td.ajusteId ORDER BY ts.fechaRegistro, td.idTransaccionDetalle ASC) AS nuevoSaldo
    FROM Inventario.Transaccion              ts WITH (NOLOCK)
    INNER JOIN Inventario.TransaccionDetalle td WITH (NOLOCK) ON td.idTransaccion     = ts.idTransaccion
    where td.estado = 1
      AND td.idArticulo in
      (
        select idArticulo from Inventario.TransaccionDetalle where idTransaccion = 1648358 
      )

)
update td set td.saldo = sa.nuevoSaldo
from Inventario.TransaccionDetalle td WITH (NOLOCK)
INNER JOIN CTE_Saldos              sa WITH (NOLOCK) ON sa.idTransaccionDetalle = td.idTransaccionDetalle;


--update Inventario.TransaccionDetalle set saldo = 0 where saldo is null and estado in (0,2)

--alter table Inventario.TransaccionDetalle alter column saldo numeric(18,5) not null

--alter table Inventario.TransaccionDetalle add default 1 for saldo

--> MODIFICAION EN STOK PARA EL CALCULO DE LA ULTIMA TRNSACCION
--alter table Inventario.Stock add idTransaccionDetalle BIGINT CONSTRAINT FK_Stock_TransaccionDetalle FOREIGN KEY REFERENCES Inventario.TransaccionDetalle(idTransaccionDetalle)

--UPDATE st 
--SET st.idTransaccionDetalle = subq.idTransaccionDetalle
--FROM Inventario.Stock st
--INNER JOIN (
--    SELECT td.idArticulo,
--           td.idBodega,
--           td.idTransaccionDetalle,
--           ROW_NUMBER() OVER (
--               PARTITION BY td.idArticulo, td.idBodega 
--               ORDER BY tr.fechaRegistro DESC, td.idTransaccionDetalle DESC
--           ) as rn
--    FROM Inventario.Transaccion              tr
--    INNER JOIN Inventario.TransaccionDetalle td ON td.idTransaccion = tr.idTransaccion
--    INNER JOIN Inventario.TipoTransaccion    tt ON tt.idTipoTransaccion = tr.idTipoTransaccion
--    WHERE tt.codigo = 'A'
--      AND td.estado = 1
--) subq ON subq.idArticulo = st.idArticulo 
--      AND subq.idBodega = st.idBodega
--      AND subq.rn = 1;



--ALTER TABLE Inventario.Transaccion ADD fechaRegistro DATETIME2 DEFAULT GETDATE()

--UPDATE Inventario.Transaccion set fechaRegistro = fechaEmision

--ALTER TABLE Inventario.Transaccion ALTER COLUMN fechaRegistro DATETIME2 NOT NULL


--update td set td.cantidadTransaccion = (td.cantidad * td.conversion) * iif(tp.codigo = 'S',-1,1)
--from inventario.TransaccionDetalle td
--inner join inventario.transaccion tr on tr.idTransaccion = td.idTransaccion
--inner join inventario.TipoTransaccion tp on tp.idTipoTransaccion = tr.idTipoTransaccion
--where td.estado = 0


