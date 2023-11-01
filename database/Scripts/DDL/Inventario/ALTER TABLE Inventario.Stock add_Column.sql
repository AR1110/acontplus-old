USE [Acontplus]
GO 


--ALTER TABLE Inventario.Stock ADD fechaConsolidacion DATETIME NULL

--ALTER TABLE Inventario.Stock ADD ConsolidacionId BIGINT 

--ALTER TABLE Inventario.Stock ADD estado BIT DEFAULT 1  

--ALTER TABLE Inventario.Stock ADD consolidacion NUMERIC(18,5) 

--ALTER TABLE Inventario.Stock ADD CONSTRAINT FK_Consolidacion_Id FOREIGN KEY (ConsolidacionId) REFERENCES dbo.ConsolidacionInventario(idConsolidacionInventario)

--ALTER TABLE Inventario.Stock ADD fechaUltimoCosto DATETIME NULL

--ALTER TABLE Inventario.Stock ADD ultimoCosto NUMERIC(18,5) 

SELECT *

FROM Inventario.Stock s

--update s set
--	s.fechaConsolidacion = (
--							SELECT TOP 1 t.fechaRegistro
--							FROM Inventario.v_Articulo_Transaccion t WITH (NOLOCK)
--							WHERE t.codTransaccion = 'A' AND t.idArticulo = s.idArticulo  AND t.idBodega = s.idBodega AND estado = 1
--							ORDER BY t.fechaRegistro DESC
--						  )
--from Inventario.Stock s


--update s set
--	s.consolidacion = (
--							SELECT TOP 1 t.cantidadEntrada
--							FROM Inventario.v_Articulo_Transaccion t WITH (NOLOCK)
--							WHERE t.codTransaccion = 'A' AND t.idArticulo = s.idArticulo  AND t.idBodega = s.idBodega AND estado = 1
--							ORDER BY t.fechaRegistro DESC
--						  )
--from Inventario.Stock s


--update s set
--	s.ConsolidacionId = (
--							SELECT TOP 1 t.idDocumento
--							FROM Inventario.v_Articulo_Transaccion t WITH (NOLOCK)
--							WHERE t.codTransaccion = 'A' AND t.idArticulo = s.idArticulo  AND t.idBodega = s.idBodega AND estado = 1
--							ORDER BY t.fechaRegistro DESC
--						  )
--from Inventario.Stock s

--update s set
--	s.estado = (
--							SELECT TOP 1 b.estado FROM dbo.Bodega b WHERE b.idBodega = s.idBodega
--						  )
--from Inventario.Stock s

--update s set
--	s.estado = (
--							SELECT TOP 1 b.estado FROM dbo.Bodega b WHERE b.idBodega = s.idBodega
--						  )
--from Inventario.Stock s

--update s set
--	s.fechaUltimoCosto = (
							
--                            SELECT TOP 1 t.fechaRegistro
--							FROM Inventario.v_Articulo_Transaccion t WITH (NOLOCK)
--							WHERE t.codTransaccion = 'E' AND t.codDoc IN ('FE','FF','IV','LC') AND t.idArticulo = s.idArticulo  AND t.idBodega = s.idBodega AND estado = 1
--							ORDER BY t.fechaRegistro DESC
--						  )
--from Inventario.Stock s

--update s set
--	s.ultimoCosto = (
--							SELECT TOP 1 t.precioUnitario
--							FROM Inventario.v_Articulo_Transaccion t WITH (NOLOCK)
--							WHERE t.codTransaccion = 'E' AND t.codDoc IN ('FE','FF','IV','LC') AND t.idArticulo = s.idArticulo  AND t.idBodega = s.idBodega AND estado = 1
--							ORDER BY t.fechaRegistro DESC
--						  )
--from Inventario.Stock s