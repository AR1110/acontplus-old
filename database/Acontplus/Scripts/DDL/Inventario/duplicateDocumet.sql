--use [Acontplus]
--go

--declare @table as table
--(
--	idTipoDocumento INT NOT NULL
--   ,idTipoTransaccion INT NOT NULL
--   ,idDocumento INT NOT NULL
--   ,total INT NOT NULL
--)

--declare @tableDuplicate as table
--(
--	idTransaccion int  not null unique
--    ,idTipoDocumento INT NOT NULL
--    ,idTipoTransaccion INT NOT NULL
--    ,idDocumento INT NOT NULL
--)

--declare @tableDelete as table
--(
--	idTransaccion int  not null unique
--)

--INSERT INTO @table (idTipoDocumento,idTipoTransaccion,idDocumento,total)
--select idTipoDocumento,idTipoTransaccion,idDocumento,COUNT(*) as total 
--from Inventario.Transaccion 
--group by idTipoDocumento,idTipoTransaccion,idDocumento
--HAVING COUNT(*) > 1
--order by total desc

--update tt
--    set idEntidad = (select TOP 1 (select idEntidad from Entidad e WHERE e.ruc = dr.identificacionReceptor) from Recepcion.DocumentoRecibido dr where dr.idDocumento = tt.idDocumento)
--       ,idUsuario = (select TOP 1 idUsuario from Recepcion.DocumentoRecibido dr where dr.idDocumento = tt.idDocumento)
--FROM Inventario.Transaccion tt
--where idTipoTransaccion in (select idTipoTransaccion from @table)
--  and idTipoDocumento in (select idTipoDocumento from @table)
--  and idDocumento in (select idDocumento from @table)


--SELECT idTransaccion
--	  ,idEntidad
--	  ,(select TOP 1 (select idEntidad from Entidad e WHERE e.ruc = dr.identificacionReceptor) from Recepcion.DocumentoRecibido dr where dr.idDocumento = tt.idDocumento)
--	  ,idUsuario
--	  ,(select TOP 1 idUsuario from Recepcion.DocumentoRecibido dr where dr.idDocumento = tt.idDocumento)
--FROM Inventario.Transaccion tt
--where idTipoTransaccion in (select idTipoTransaccion from @table)
--  and idTipoDocumento in (select idTipoDocumento from @table)
--  and idDocumento in (select idDocumento from @table)
--order by idTransaccion


--INSERT INTO @tableDuplicate (idTransaccion,idTipoDocumento,idTipoTransaccion,idDocumento)
--SELECT MIN(idTransaccion)
--      ,idTipoDocumento
--      ,idTipoTransaccion
--      ,idDocumento
--FROM Inventario.Transaccion tt
--where idTipoTransaccion in (select idTipoTransaccion from @table)
--  and idTipoDocumento in (select idTipoDocumento from @table)
--  and idDocumento in (select idDocumento from @table)
--GROUP BY idTipoDocumento
--      ,idTipoTransaccion
--      ,idDocumento

--insert into @tableDelete (idTransaccion)
--SELECT tt.idTransaccion
--FROM Inventario.Transaccion tt
--where idTipoTransaccion in (select idTipoTransaccion from @table)
--  and idTipoDocumento in (select idTipoDocumento from @table)
--  and idDocumento in (select idDocumento from @table)
--  and idTransaccion not in (select idTransaccion from @tableDuplicate)
--order by idTransaccion



--delete from Inventario.Transaccion where idTransaccion in (
-- select idTransaccion 
--FROM Inventario.Transaccion tt
--where idTransaccion in (select idTransaccion from @tableDelete)
--  )


--select * from Inventario.TipoDocumento 

--select * from Inventario.TipoTransaccion

--select * from Recepcion.DocumentoRecibido where idDocumento = 9360

--select * from Entidad where ruc = '1500787682001'

--select * from App.UsuarioRol where ruc = '1500787682001'

--EXEC sp_rename 'Inventario.TransaccionDetalle.idTransaccion', 'idTransaccionDetalle', 'COLUMN';

--ALTER TABLE Inventario.TransaccionDetalle ADD idTransaccion BIGINT

--ALTER TABLE Inventario.TransaccionDetalle ADD CONSTRAINT FK_Transaccion_TransDet  FOREIGN KEY (idTransaccion) REFERENCES Inventario.Transaccion(idTransaccion);

--select (
--         select top 1 tt.idTransaccion from Inventario.Transaccion tt
--         where tt.idDocumento = td.idDocumento
--           and tt.idTipoDocumento = td.idTipoDocumento
--           and tt.idTipoTransaccion = td.idTipoTransaccion
--       ) as idTransaccion
--from Inventario.TransaccionDetalle td WITH (NOLOCK)

--update td
--   set td.idTransaccion = (
--                             select top 1 tt.idTransaccion from Inventario.Transaccion tt
--                             where tt.idDocumento = td.idDocumento
--                               and tt.idTipoDocumento = td.idTipoDocumento
--                               and tt.idTipoTransaccion = td.idTipoTransaccion
--                           )
--from Inventario.TransaccionDetalle td WITH (NOLOCK)

--select COUNT(*) from Inventario.TransaccionDetalle where idTransaccion is null

--ALTER TABLE Inventario.TransaccionDetalle alter column idTransaccion BIGINT not null

--ALTER TABLE Inventario.Transaccion drop column uniqueId 

--alter table Inventario.Transaccion add uniqueId AS CAST(idDocumento AS varchar) + '-' + 
--               CAST(idTipoDocumento AS varchar) + '-' +
--               CAST( idTipoTransaccion AS varchar) 

--ALTER TABLE Inventario.Transaccion ADD CONSTRAINT U_Code_Transa UNIQUE(uniqueId)

--SELECT * FROM Inventario.Transaccion

--ALTER TABLE Inventario.TransaccionDetalle DROP CONSTRAINT [fk_inv_type_trans]
--ALTER TABLE Inventario.TransaccionDetalle DROP COLUMN [idTipoTransaccion]

--ALTER TABLE Inventario.TransaccionDetalle DROP CONSTRAINT [fk_inv_tipo_doc]
--ALTER TABLE Inventario.TransaccionDetalle DROP COLUMN [idTipoDocumento]

--ALTER TABLE Inventario.TransaccionDetalle DROP CONSTRAINT [FK_Customer_Transaccion]
--ALTER TABLE Inventario.TransaccionDetalle DROP COLUMN [CustomerId]

--ALTER TABLE Inventario.TransaccionDetalle DROP COLUMN [idDocumento]
--ALTER TABLE Inventario.TransaccionDetalle DROP COLUMN [fechaRegistro]
--ALTER TABLE Inventario.TransaccionDetalle DROP COLUMN [idUsuario]
--ALTER TABLE Inventario.TransaccionDetalle DROP COLUMN [serieComprobante]
--select top 50 * from Inventario.Transaccion 

--SELECT top 50 * FROM Inventario.TransaccionDetalle td


--delete from Inventario.TransaccionDetalle where idTransaccionDetalle in (

--select td.idTransaccionDetalle
--from Inventario.Transaccion tt
--inner join Inventario.TransaccionDetalle td on td.idTransaccion = tt.idTransaccion
--inner join dbo.Articulo ar on ar.idArticulo = td.idArticulo
--where ar.idEntidad != tt.idEntidad 
--)

--> TRENFERENCIA BODEGA 
--UPDATE tr
--   SET tr.estado =  (SELECT  IIF(ep.codigo= 'AC',1,0)
--        FROM dbo.TransferenciaBodega tb 
--        INNER JOIN dbo.EstadoPago ep ON ep.idEstadoPago = tb.idEstadoDocumento
--        WHERE tb.idTransferenciaBodega = tr.idDocumento)
--FROM Inventario.Transaccion           tr WITH (ROWLOCK) 
--inner join Inventario.TipoTransaccion tt WITH (ROWLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (ROWLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--where td.codigo in ('TB')


--> CONSOLIDACION INVENTARIO 
--UPDATE tr
--   SET tr.estado =  (
--                        SELECT  IIF(ep.codigo= 'AC',1,0)
--                        FROM dbo.ConsolidacionInventario ci 
--                        INNER JOIN dbo.EstadoPago        ep ON ep.idEstadoPago = ci.idEstadoDocumento
--                        WHERE ci.idConsolidacionInventario                     = tr.idDocumento
--                    )
--FROM Inventario.Transaccion           tr WITH (ROWLOCK) 
--inner join Inventario.TipoTransaccion tt WITH (ROWLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (ROWLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--where td.codigo in ('CI')


-->FATURA SALIDAS
--UPDATE tr
--   SET tr.estado =  (
--                        SELECT  IIF(ep.codigo= 'A',0,1)
--                        FROM Contabilidad.CuentaPorCobrar cc
--                        inner join dbo.EstadoPago ep ON ep.idEstadoPago = cc.idEstadoPago
--                        where cc.codDoc = '01'
--                         AND cc.idDocumento = tr.idDocumento
--                    )
--FROM Inventario.Transaccion           tr WITH (ROWLOCK) 
--inner join Inventario.TipoTransaccion tt WITH (ROWLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (ROWLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--where td.codigo in ('FE')
--  and tt.codigo = 'S'

--NOTA ENTREGA SALIDAS
--UPDATE tr
--   SET tr.estado =  (
--                        SELECT CASE ep.codigo WHEN 'A' THEN 0 
--                              WHEN 'TRA' THEN 2
--                              ELSE 1
--                               END 
--                        FROM Contabilidad.CuentaPorCobrar cc
--                        inner join dbo.EstadoPago ep ON ep.idEstadoPago = cc.idEstadoPago
--                        where cc.codDoc = 'NE'
--                         AND cc.idDocumento = tr.idDocumento
--                    )
--FROM Inventario.Transaccion           tr WITH (ROWLOCK) 
--inner join Inventario.TipoTransaccion tt WITH (ROWLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (ROWLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--where td.codigo in ('NE')
--  and tt.codigo = 'S'


--> NOTA CREDITO SALIDAS
--UPDATE tr
--   SET tr.estado =  (
--                        SELECT CASE ep.codigo WHEN 'A' THEN 0 
--                               ELSE 1
--                               END 
--                        FROM dbo.NotaCredito nc
--                        inner join dbo.EstadoPago ep ON ep.idEstadoPago = nc.idEstadoDocumento
--                        where nc.idNotaCredito = tr.idDocumento
--                    )
--FROM Inventario.Transaccion           tr WITH (ROWLOCK) 
--inner join Inventario.TipoTransaccion tt WITH (ROWLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (ROWLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--where td.codigo in ('NC')
--  and tt.codigo = 'S'

--> Factura Fisica Entrada
--UPDATE tr
--   SET tr.estado =  (
--                        SELECT TOP 1 IIF(ep.codigo = 'A',0,1)
--                        FROM Contabilidad.CuentaPorPagar cc
--                        inner join dbo.EstadoPago ep ON ep.idEstadoPago = cc.idEstadoPago
--                        where cc.idDocumento = tr.idDocumento
--                        and cc.codDoc = 'FC'
--                    )
--FROM Inventario.Transaccion           tr WITH (ROWLOCK) 
--inner join Inventario.TipoTransaccion tt WITH (ROWLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (ROWLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--where td.codigo in ('FF')
--  and tt.codigo = 'E'

--> COMPRA NO HABITUAL - ENTRADA
--UPDATE tr
--   SET tr.estado =  (
--                        SELECT TOP 1 IIF(ep.codigo = 'A',0,1)
--                        FROM Contabilidad.CuentaPorPagar cc
--                        inner join dbo.EstadoPago ep ON ep.idEstadoPago = cc.idEstadoPago
--                        where cc.idDocumento = tr.idDocumento
--                        and cc.codDoc = 'DH'
--                    )
--FROM Inventario.Transaccion           tr WITH (ROWLOCK) 
--inner join Inventario.TipoTransaccion tt WITH (ROWLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (ROWLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--where td.codigo in ('IV')
--  and tt.codigo = 'E'

--> LIQUIDACION COMPRA - ENTRADA
--UPDATE tr
--   SET tr.estado =  (
--                        SELECT TOP 1 IIF(ep.codigo = 'A',0,1)
--                        FROM Contabilidad.CuentaPorPagar cc
--                        inner join dbo.EstadoPago ep ON ep.idEstadoPago = cc.idEstadoPago
--                        where cc.idDocumento = tr.idDocumento
--                        and cc.codDoc = '03'
--                    )
--FROM Inventario.Transaccion           tr WITH (ROWLOCK) 
--inner join Inventario.TipoTransaccion tt WITH (ROWLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (ROWLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--where td.codigo in ('LC')
--  and tt.codigo = 'E'

--> FACTURAELECTRONICA ENTRADA
--UPDATE tr
--   SET tr.estado =  ISNULL((
--                        SELECT TOP 1 ISNULL(IIF(ep.codigo = 'A',0,1),0)
--                        FROM Contabilidad.CuentaPorPagar cc
--                        inner join dbo.EstadoPago ep ON ep.idEstadoPago = cc.idEstadoPago
--                        where cc.idDocumento = tr.idDocumento
--                          and cc.codDoc = '01'
--                    ),0)
--FROM Inventario.Transaccion           tr WITH (ROWLOCK) 
--inner join Inventario.TipoTransaccion tt WITH (ROWLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (ROWLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--where td.codigo in ('FE')
--  and tt.codigo = 'E'

