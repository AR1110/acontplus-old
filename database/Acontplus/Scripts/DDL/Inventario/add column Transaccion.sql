use [Acontplus]
go 


--Trasaccion Conversion

--alter table Inventario.Transaccion add conversion numeric(18,2)

--update tr set
--	   tr.conversion = ISNULL((SELECT TOP 1 af.conversion FROM dbo.ArticuloFraccionado af with (nolock) where af.idArticulo = tr.idArticulo and af.idMedida = tr.idMedida),1) 
--from Inventario.Transaccion tr
--inner join dbo.Articulo ar on ar.idArticulo = tr.idArticulo

--alter table Inventario.Transaccion alter column conversion numeric(18,5) not null


--alter table Inventario.Transaccion add precioCostoFraccionado NUMERIC(18,5)

--update tr set
--	   tr.precioCostoFraccionado = ISNULL((SELECT TOP 1 af.precioCostoFraccionado FROM dbo.ArticuloFraccionado af with (nolock) where af.idArticulo = tr.idArticulo and af.idMedida = tr.idMedida),tr.precioCosto)
--from Inventario.Transaccion tr
--inner join dbo.Articulo ar on ar.idArticulo = tr.idArticulo

--alter table Inventario.Transaccion alter column precioCostoFraccionado numeric(18,5) not null

--select tr.idArticulo
--      ,tr.idMedida
--	  ,tr.conversion
--	  ,tr.precioCostoFraccionado
--from Inventario.Transaccion tr with (nolock)

--> Customer proveedor

--INSERT INTO [Customer].[Customer]
--           ([IDType]
--           ,[IDCard]
--           ,[BusinessName]
--           ,[TradeName]
--           ,[CreatedAt])

--select ti.codigoSri,pr.numeroIdentificacion,isnull(nombreComercial,nombreFiscal),nombreFiscal,GETDATE() from Proveedor pr 
--inner join TipoIdentificacion ti on ti.idTipoIdentificacion = pr.idTipoIdentificacion
--where pr.numeroIdentificacion not in 
--(
--   SELECT IDCard FROM Customer.Customer
--)
--group by ti.codigoSri,pr.numeroIdentificacion,nombreComercial,nombreFiscal


--update cc set
--       cc.Email      = (select top 1 pr.correo from Proveedor pr where pr.numeroIdentificacion = cc.IDCard order by idProveedor desc)
--      ,cc.Telephone  = (select top 1 pr.telefono from Proveedor pr where pr.numeroIdentificacion = cc.IDCard order by idProveedor desc)
--      ,cc.Address    = (select top 1 pr.direccion from Proveedor pr where pr.numeroIdentificacion = cc.IDCard order by idProveedor desc)
--      ,cc.SriValidation    = (select top 1 pr.validationSri from Proveedor pr where pr.numeroIdentificacion = cc.IDCard order by idProveedor desc)
--from Customer.Customer cc
--WHERE IDCard  in (
--    select numeroIdentificacion from dbo.Proveedor where CustomerId is null
--)

--UPDATE p set 
--       p.CustomerId = (select top 1 Id from Customer.Customer c where c.IDCard = p.numeroIdentificacion )
--from Proveedor p where CustomerId IS NULL 

--> CUSTORMER CLIENTE


--SELECT numeroIdentificacion, nombreFiscal, cl.nombreComercial, e.ruc as rucEmpresa, e.razonSocial,cl.fechaRegistro,cl.estado
--FROM Cliente cl
--inner join Entidad e on e.idEntidad = cl.idEntidad
--WHERE CustomerId is null
--order by e.ruc

--INSERT INTO [Customer].[Customer]
--           ([IDType]
--           ,[IDCard]
--           ,[BusinessName]
--           ,[TradeName]
--           ,[CreatedAt])
--select ti.codigoSri,cl.numeroIdentificacion,isnull(nombreComercial,nombreFiscal),nombreFiscal,GETDATE()
--from Cliente cl 
--inner join TipoIdentificacion ti on ti.idTipoIdentificacion = cl.idTipoIdentificacion
--where cl.numeroIdentificacion not in 
--(
--   SELECT IDCard FROM Customer.Customer
--)
--and numeroIdentificacion NOT IN  ('2200495289001','1310925210001','1792261200001')
--group by ti.codigoSri,cl.numeroIdentificacion,nombreComercial,nombreFiscal

--update cc set
--       cc.Email      = (select top 1 cl.correo from Cliente cl where cl.numeroIdentificacion = cc.IDCard order by idCliente desc)
--      ,cc.Telephone  = (select top 1 cl.telefono from Cliente cl where cl.numeroIdentificacion = cc.IDCard order by idCliente desc)
--      ,cc.Address    = (select top 1 cl.direccion from Cliente cl where cl.numeroIdentificacion = cc.IDCard order by idCliente desc)
--      ,cc.SriValidation    = (select top 1 cl.validationSri from Cliente cl where cl.numeroIdentificacion = cc.IDCard order by idCliente desc)
--from Customer.Customer cc
--WHERE IDCard  in (
--    select numeroIdentificacion from dbo.Cliente where CustomerId is null
--)

--update cl
--   set cl.CustomerId = (select top 1 c.Id from Customer.Customer c where c.IDCard = cl.numeroIdentificacion )
--from Cliente cl WHERE CustomerId is null


--> TRANSACCION CUSTOMER ID SALIDAS

--ALTER TABLE Inventario.Transaccion ADD CustomerId INT

--ALTER TABLE Inventario.Transaccion ADD CONSTRAINT FK_Customer_Transaccion  FOREIGN KEY (CustomerId) REFERENCES Customer.Customer(Id);

--select tr.idDocumento
--      ,td.codigo
--      ,tr.CustomerId
--from Inventario.Transaccion           tr WITH (NOLOCK)
--inner join Inventario.TipoTransaccion tt WITH (NOLOCK) on tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--WHERE tt.codigo = 'S'
--  AND td.codigo in ('FE','NE') 

--  update tr set
--    tr.CustomerId =  case td.codigo WHEN 'FE' THEN (select top 1 cl.CustomerId 
--                                      from Factura f 
--                                      inner join Cliente cl on cl.idCliente = f.idCliente
--                                      where f.idFactura = tr.idDocumento)
--                      WHEN 'NE' THEN (select top 1 cl.CustomerId 
--                                      from NotaEntrega ne 
--                                      inner join Cliente cl on cl.idCliente = ne.idCliente
--                                      where ne.idNotaEntrega = tr.idDocumento)
--                     end 
--  from Inventario.Transaccion           tr WITH (NOLOCK)
--inner join Inventario.TipoTransaccion tt WITH (NOLOCK) on tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--WHERE tt.codigo = 'S'
--  AND td.codigo in ('FE','NE') 


--> Transaccion Customer Entradas

--select tr.idDocumento
--      ,td.codigo
--      ,tr.CustomerId
--from Inventario.Transaccion           tr WITH (NOLOCK)
--inner join Inventario.TipoTransaccion tt WITH (NOLOCK) on tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--WHERE tt.codigo = 'E'
--  AND td.codigo in ('FE','FF','IV','LC') 


--    update tr set
--    tr.CustomerId =  case td.codigo WHEN 'FE' THEN (SELECT top 1 (SELECT TOP 1 c.Id FROM Customer.Customer c WHERE c.IDCard = dr.rucEmisor) 
--                                      FROM Recepcion.DocumentoRecibido dr WHERE dr.idDocumento = tr.idDocumento )

--                      WHEN 'FF' THEN (select top 1 pr.CustomerId 
--                                      from dbo.FacturaCompra fc 
--                                      inner join Proveedor pr on pr.idProveedor = fc.idProveedor
--                                      where fc.idFacturaCompra = tr.idDocumento)

--                      WHEN 'IV' THEN (select top 1 pr.CustomerId 
--                                      from Compra.Documento_Ingreso di 
--                                      inner join Proveedor pr on pr.idProveedor = di.idProveedor
--                                      where di.idDocumentoIngreso = tr.idDocumento)

--                      WHEN 'LC' THEN (select top 1 pr.CustomerId 
--                                      from LiquidacionCompra lc 
--                                      inner join Proveedor pr on pr.idProveedor = lc.idProveedor
--                                      where lc.idLiquidacionCompra = tr.idDocumento)
--                     end
--  from Inventario.Transaccion           tr WITH (NOLOCK)
--inner join Inventario.TipoTransaccion tt WITH (NOLOCK) on tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--WHERE tt.codigo = 'E'
--  --AND td.codigo in ('FE')  
--  AND td.codigo in ('FE','FF','IV','LC') 


--> Serie Comprobante  -- Salidas

--ALTER TABLE Inventario.Transaccion  ADD serieComprobante VARCHAR(30)

--select tr.idDocumento
--      ,td.codigo
--      ,tr.serieComprobante
--      ,case td.codigo WHEN 'FE' THEN (
--                                      SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, f.nroFactura), 9)
--			                          FROM dbo.Factura                   f WITH (NOLOCK)
--			                          INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON f.idPuntoEmision = pe.idPuntoEmision
--			                          INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON pe.codEstab = e.codEstab
--			                          WHERE f.idFactura = tr.idDocumento

--                                      )
--                      WHEN 'NE' THEN (
--                                        SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDocumento), 9)
--						                FROM dbo.NotaEntrega              ne WITH (NOLOCK)
--						                INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON ne.idPuntoEmision = pe.idPuntoEmision
--						                INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON pe.codEstab = e.codEstab
--						                WHERE ne.idNotaEntrega = tr.idDocumento
--                                     )

--                      WHEN 'TB' THEN (
--                                        SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, tb.nroDoc), 9)
--			                            FROM dbo.TransferenciaBodega      tb  WITH (NOLOCK)
--			                            INNER JOIN dbo.PuntoEmision       pe  WITH (NOLOCK) ON pe.idPuntoEmision = tb.idPuntoEmision
--			                            INNER JOIN Sri.Establecimiento    e   WITH (NOLOCK) ON pe.codEstab       = e.codEstab
--			                            WHERE tb.idTransferenciaBodega = tr.idDocumento
--                                     )
                      
--                     end 
--from Inventario.Transaccion           tr WITH (NOLOCK)
--inner join Inventario.TipoTransaccion tt WITH (NOLOCK) on tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--WHERE tt.codigo = 'S'
--  AND td.codigo in ('FE','NE','TB')   
  --AND td.codigo in ('TB') 


--  update tr set
--    tr.serieComprobante =  case td.codigo WHEN 'FE' THEN (
--                                      SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, f.nroFactura), 9)
--			                          FROM dbo.Factura                   f WITH (NOLOCK)
--			                          INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON f.idPuntoEmision = pe.idPuntoEmision
--			                          INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON pe.codEstab = e.codEstab
--			                          WHERE f.idFactura = tr.idDocumento

--                                      )
--                      WHEN 'NE' THEN (
--                                        SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDocumento), 9)
--						                FROM dbo.NotaEntrega              ne WITH (NOLOCK)
--						                INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON ne.idPuntoEmision = pe.idPuntoEmision
--						                INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON pe.codEstab = e.codEstab
--						                WHERE ne.idNotaEntrega = tr.idDocumento
--                                     )

--                      WHEN 'TB' THEN (
--                                        SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, tb.nroDoc), 9)
--			                            FROM dbo.TransferenciaBodega      tb  WITH (NOLOCK)
--			                            INNER JOIN dbo.PuntoEmision       pe  WITH (NOLOCK) ON pe.idPuntoEmision = tb.idPuntoEmision
--			                            INNER JOIN Sri.Establecimiento    e   WITH (NOLOCK) ON pe.codEstab       = e.codEstab
--			                            WHERE tb.idTransferenciaBodega = tr.idDocumento
--                                     )
                      
--                     end 
--  from Inventario.Transaccion           tr WITH (NOLOCK)
--inner join Inventario.TipoTransaccion tt WITH (NOLOCK) on tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--WHERE tt.codigo = 'S'
--  AND td.codigo in ('FE','NE','TB') 

--> Serie Comprobante  -- Entradas


--select tr.idDocumento
--      ,td.codigo
--      ,tr.serieComprobante
--      ,case td.codigo  WHEN 'FE' THEN (
--                                        SELECT TOP 1 serieComprobante
--						                FROM Recepcion.DocumentoRecibido dr  WITH (NOLOCK)
--						                WHERE dr.idDocumento = tr.idDocumento

--                                      )
--                       WHEN 'FF' THEN (
--                                        SELECT TOP 1  puntoEmision + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDocumento), 9)
--						                FROM dbo.FacturaCompra fc  WITH (NOLOCK)
--						                WHERE fc.idFacturaCompra = tr.idDocumento
--                                      )

--                       WHEN 'LC' THEN (
--                                        SELECT TOP 1 es.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDocumento), 9)
--						                FROM dbo.LiquidacionCompra     lc WITH (NOLOCK)
--						                INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision = lc.idPuntoEmision
--						                INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = pe.codEstab
--						                WHERE lc.idLiquidacionCompra = tr.idDocumento
--                                     )
                        
--                      WHEN 'IV' THEN (
--                                        SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, secuencial), 9)
--						                FROM Compra.Documento_Ingreso di  WITH (NOLOCK)
--                                        INNER JOIN dbo.PuntoEmision   pe WITH (NOLOCK) ON di.idPuntoEmision = pe.idPuntoEmision
--						                INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON pe.codEstab = e.codEstab
--						                WHERE di.idDocumentoIngreso = tr.idDocumento
--                                     )

--                      WHEN 'TB' THEN (
--                                        SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, tb.nroDoc), 9)
--			                            FROM dbo.TransferenciaBodega      tb  WITH (NOLOCK)
--			                            INNER JOIN dbo.PuntoEmision       pe  WITH (NOLOCK) ON pe.idPuntoEmision = tb.idPuntoEmision
--			                            INNER JOIN Sri.Establecimiento    e   WITH (NOLOCK) ON pe.codEstab       = e.codEstab
--			                            WHERE tb.idTransferenciaBodega = tr.idDocumento
--                                     )
                      
--                     end 
--from Inventario.Transaccion           tr WITH (NOLOCK)
--inner join Inventario.TipoTransaccion tt WITH (NOLOCK) on tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--WHERE tt.codigo = 'E'
--  AND td.codigo in ('FE','FF','TB','LC','IV')   
--  --AND td.codigo in ('TB') 


--    update tr set
--    tr.serieComprobante =  case td.codigo  WHEN 'FE' THEN (
--                                        SELECT TOP 1 serieComprobante
--						                FROM Recepcion.DocumentoRecibido dr  WITH (NOLOCK)
--						                WHERE dr.idDocumento = tr.idDocumento

--                                      )
--                       WHEN 'FF' THEN (
--                                        SELECT TOP 1  puntoEmision + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDocumento), 9)
--						                FROM dbo.FacturaCompra fc  WITH (NOLOCK)
--						                WHERE fc.idFacturaCompra = tr.idDocumento
--                                      )

--                       WHEN 'LC' THEN (
--                                        SELECT TOP 1 es.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDocumento), 9)
--						                FROM dbo.LiquidacionCompra     lc WITH (NOLOCK)
--						                INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision = lc.idPuntoEmision
--						                INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = pe.codEstab
--						                WHERE lc.idLiquidacionCompra = tr.idDocumento
--                                     )
                        
--                      WHEN 'IV' THEN (
--                                        SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, secuencial), 9)
--						                FROM Compra.Documento_Ingreso di  WITH (NOLOCK)
--                                        INNER JOIN dbo.PuntoEmision   pe WITH (NOLOCK) ON di.idPuntoEmision = pe.idPuntoEmision
--						                INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON pe.codEstab = e.codEstab
--						                WHERE di.idDocumentoIngreso = tr.idDocumento
--                                     )

--                      WHEN 'TB' THEN (
--                                        SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, tb.nroDoc), 9)
--			                            FROM dbo.TransferenciaBodega      tb  WITH (NOLOCK)
--			                            INNER JOIN dbo.PuntoEmision       pe  WITH (NOLOCK) ON pe.idPuntoEmision = tb.idPuntoEmision
--			                            INNER JOIN Sri.Establecimiento    e   WITH (NOLOCK) ON pe.codEstab       = e.codEstab
--			                            WHERE tb.idTransferenciaBodega = tr.idDocumento
--                                     )
                      
--                     end 
--  from Inventario.Transaccion           tr WITH (NOLOCK)
--inner join Inventario.TipoTransaccion tt WITH (NOLOCK) on tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--WHERE tt.codigo = 'E'
--  AND td.codigo in ('FE','FF','TB','LC','IV')   

--> Ajustes



--select tr.idDocumento
--      ,td.codigo
--      ,tr.serieComprobante
--      ,case td.codigo  WHEN 'CI' THEN (
--                                        SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDoc), 9)
--					                    FROM dbo.ConsolidacionInventario  dr  WITH (NOLOCK)
--					                    INNER JOIN dbo.PuntoEmision       pe  WITH (NOLOCK) ON dr.idPuntoEmision = pe.idPuntoEmision
--					                    INNER JOIN Sri.Establecimiento e  WITH (NOLOCK) ON pe.codEstab = e.codEstab
--					                    WHERE dr.idConsolidacionInventario = tr.idDocumento

--                                      )
--      END 
--from Inventario.Transaccion           tr WITH (NOLOCK)
--inner join Inventario.TipoTransaccion tt WITH (NOLOCK) on tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--WHERE tt.codigo = 'A'
--  AND td.codigo in ('CI')   

-- update tr set
--    tr.serieComprobante =  case td.codigo  WHEN 'CI' THEN (
--                                        SELECT TOP 1 e.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDoc), 9)
--					                    FROM dbo.ConsolidacionInventario  dr  WITH (NOLOCK)
--					                    INNER JOIN dbo.PuntoEmision       pe  WITH (NOLOCK) ON dr.idPuntoEmision = pe.idPuntoEmision
--					                    INNER JOIN Sri.Establecimiento e  WITH (NOLOCK) ON pe.codEstab = e.codEstab
--					                    WHERE dr.idConsolidacionInventario = tr.idDocumento

--                                      )
--                            END 
--  from Inventario.Transaccion           tr WITH (NOLOCK)
--inner join Inventario.TipoTransaccion tt WITH (NOLOCK) on tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--WHERE tt.codigo = 'A'
--  AND td.codigo in ('CI') 

  --AND td.codigo in ('TB') 


  --> OTROS

--SELECT td.descripcion,tt.descripcion,CustomerId
--from Inventario.Transaccion           tr WITH (NOLOCK)
--inner join Inventario.TipoTransaccion tt WITH (NOLOCK) on tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--where tr.serieComprobante is null

--select case tt.codigo WHEN 'S' THEN (SELECT TOP 1 estab + '-' + ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDocumento), 9)
--						            FROM dbo.NotaCredito              nc WITH (NOLOCK)
--						            INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON nc.idPuntoEmision = pe.idPuntoEmision
--						            INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON pe.codEstab = e.codEstab
--						            WHERE nc.idNotaCredito = tr.idDocumento)
                      
--                      WHEN 'E' THEN (SELECT TOP 1 dr.serieComprobante
--							         FROM Recepcion.DocumentoRecibido dr  WITH (NOLOCK)
--							         WHERE dr.idDocumento = tr.idDocumento)
--                     end
--from Inventario.Transaccion           tr WITH (NOLOCK)
--inner join Inventario.TipoTransaccion tt WITH (NOLOCK) on tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--where tr.serieComprobante is null

--    update tr set
--    tr.CustomerId =  case tt.codigo WHEN 'S' THEN (select top 1 cl.CustomerId 
--                                      from NotaCredito nc
--                                      inner join Cliente cl on cl.idCliente = nc.idCliente
--                                      where nc.idNotaCredito = tr.idDocumento)
                      
--                      WHEN 'E' THEN ((SELECT top 1 (SELECT TOP 1 c.Id FROM Customer.Customer c WHERE c.IDCard = dr.rucEmisor) 
--                                     FROM Recepcion.DocumentoRecibido dr WHERE dr.idDocumento = tr.idDocumento ))
--                     end 
--  from Inventario.Transaccion           tr WITH (NOLOCK)
--inner join Inventario.TipoTransaccion tt WITH (NOLOCK) on tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--where tr.serieComprobante is null

--    update tr set
--        tr.serieComprobante =  case tt.codigo WHEN 'S' THEN (SELECT TOP 1 estab + '-' + ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, nroDocumento), 9)
--						            FROM dbo.NotaCredito              nc WITH (NOLOCK)
--						            INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON nc.idPuntoEmision = pe.idPuntoEmision
--						            INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON pe.codEstab = e.codEstab
--						            WHERE nc.idNotaCredito = tr.idDocumento)
                      
--                      WHEN 'E' THEN (SELECT TOP 1 dr.serieComprobante
--							         FROM Recepcion.DocumentoRecibido dr  WITH (NOLOCK)
--							         WHERE dr.idDocumento = tr.idDocumento)
--                     end
--  from Inventario.Transaccion           tr WITH (NOLOCK)
--inner join Inventario.TipoTransaccion tt WITH (NOLOCK) on tt.idTipoTransaccion = tr.idTipoTransaccion
--inner join Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
--where td.codigo = 'NC'

select * from Inventario.Transaccion

--ALTER TABLE Inventario.Transaccion  alter column serieComprobante VARCHAR(30) not null