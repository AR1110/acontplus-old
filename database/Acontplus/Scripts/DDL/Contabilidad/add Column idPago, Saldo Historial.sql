use [Acontplus]
go 


--> DELETE PROCEDURE 
--DROP  PROCEDURE IF EXISTS GestFinanc.ComprobanteEgreso_Insert

--> NUEVA COLUMANS Y MIGRACIONES

--ALTER TABLE Contabilidad.Historial_Pago ADD idPago BIGINT NOT NULL 

--ALTER TABLE Contabilidad.Historial_Pago ADD saldo NUMERIC(18,5) NOT NULL 

--ALTER TABLE Contabilidad.Historial_Pago ADD CONSTRAINT FK_Histo_Pago FOREIGN KEY (idPago) REFERENCES dbo.Pago(idPago)

--SELECT * FROM Contabilidad.Historial_Pago

--INSERT INTO Contabilidad.Historial_Pago 
--      (
--		idCuentaPorPagar
--	   ,idPago
--	   ,idComprobanteEgreso
--	   ,abono
--	   ,saldo
--	  )

--SELECT cp.idCuentaPorPagar
--      ,pa.idPago
--	  ,ce.idComprobanteEgreso
--	  ,sum(pd.abono) as abono
--	  ,cp.importeTotal
--FROM dbo.PagoDetalle                    pd WITH (NOLOCK)
--INNER JOIN Contabilidad.CuotaPorPagar   cc WITH (NOLOCK) ON cc.idCuotaPorPagar      = pd.idCuotaPorPagar
--INNER JOIN Contabilidad.CuentaPorPagar  cp WITH (NOLOCK) ON cp.idCuentaPorPagar     = cc.idCuentaPorPagar
--INNER JOIN dbo.Pago                     pa WITH (NOLOCK) ON pa.idPago               = pd.idPago
--INNER JOIN dbo.ComprobanteEgreso        ce WITH (NOLOCK) ON ce.idComprobanteEgreso  = pa.idComprobanteEgreso
--INNER JOIN dbo.EntidadFinanciera        ef WITH (NOLOCK) ON ef.idEntidadFinanciera  = pa.idEntidadFinanciera
--GROUP BY cp.idCuentaPorPagar
--        ,pa.idPago
--	    ,ce.idComprobanteEgreso
--	    ,cp.importeTotal
--        ,pa.secuencial
--ORDER BY cp.idCuentaPorPagar,pa.secuencial ASC


--> NUEVA COLUMNA Y CALCULO DE LOS RESIDUOS POR PAGOS

--> Historial de documentos 

--DECLARE @tbHistorial AS TABLE(
--    idHistorialPago INT UNIQUE NOT NULL
--   ,saldo NUMERIC(18,5) NOT NULL
--)

--INSERT INTO @tbHistorial (idHistorialPago,saldo)
--select hp.idHistorialPago
--      ,hp.saldo - SUM(hp.abono) over(partition by hp.idCuentaPorPagar ORDER BY hp.idHistorialPago  ROWS UNBOUNDED PRECEDING) as saldo
--from Contabilidad.Historial_Pago hp
--INNER JOIN Contabilidad.CuentaPorPagar cp ON cp.idCuentaPorPagar = hp.idCuentaPorPagar
--inner join dbo.ComprobanteEgreso ce ON ce.idComprobanteEgreso = hp.idComprobanteEgreso
--WHERE ce.estado = 1 
--GROUP BY hp.idComprobanteEgreso,hp.idHistorialPago,hp.idCuentaPorPagar,hp.saldo,hp.abono
--ORDER BY hp.idCuentaPorPagar,hp.idComprobanteEgreso 

--update hp set   
--    hp.saldo = th.saldo
--from Contabilidad.Historial_Pago hp 
--INNER JOIN @tbHistorial th on th.idHistorialPago = hp.idHistorialPago

--update Contabilidad.Historial_Pago set saldo = abono + saldo

--select hc.idCuentaPorCobrar,hc.saldo as importeTotal , hc.abono , hc.saldo - hc.abono as saldo 
--from Contabilidad.Historial_Cobro hc
--INNER JOIN Contabilidad.CuentaPorCobrar cc ON cc.idCuentaPorCobrar = hc.idCuentaPorCobrar
--inner join dbo.ComprobanteIngreso ci ON ci.idComprobanteIngreso = hc.idComprobanteIngreso
--WHERE ci.estado = 1
--ORDER BY hc.idCuentaPorCobrar,hc.idComprobanteIngreso  

--> Histoial pago Detalles

--DECLARE @tbDetalle AS TABLE(

--    idPagoDetalle INT UNIQUE NOT NULL
--   ,saldo NUMERIC(18,5) NOT NULL
--)

------ALTER TABLE dbo.PagoDetalle ADD saldo NUMERIC(18,5)

----update pd set
----       pd.saldo = cp.cuota
----from pagoDetalle                       pd
----inner join pago                        pa ON pa.idPago              = pd.idPago
----inner join Contabilidad.CuotaPorPagar  cp ON cp.idCuotaPorPagar     = pd.idCuotaPorPagar
----inner join ComprobanteEgreso           ce on ce.idComprobanteEgreso = pa.idComprobanteEgreso

--INSERT INTO @tbDetalle (idPagoDetalle,saldo)
--select pd.idPagoDetalle
--      ,pd.saldo - SUM( IIF(pa.cobro = 1,pd.abono,0)) over(partition by pd.idCuotaPorPagar ORDER BY pd.idPagoDetalle  ROWS UNBOUNDED PRECEDING)
--from pagodetalle              pd
--inner join Pago               pa ON pa.idPago = pd.idPago
--inner join ComprobanteEgreso  ce on ce.idComprobanteEgreso = pa.idComprobanteEgreso
--where ce.estado = 1
--GROUP BY pa.idPago,pd.idCuotaPorPagar,pd.saldo,pd.abono,pd.idPagoDetalle,pa.cobro
--ORDER BY pd.idCuotaPorPagar,pa.idPago

--update pd set
--       pd.saldo = td.saldo
--from PagoDetalle pd 
--inner join @tbDetalle td on td.idPagoDetalle = pd.idPagoDetalle

--update PagoDetalle set saldo = abono + saldo

--select cd.idCobroDetalle,idCuotaPorCobrar,cd.saldo,cd.abono ,cd.saldo - cd.abono
--from CobroDetalle cd
--inner join Cobro co ON co.idCobro = cd.idCobro
--inner join ComprobanteIngreso ci on ci.idComprobanteIngreso = co.idComprobanteIngreso
--where ci.estado = 1
--ORDER BY cd.idCuotaPorCobrar,cd.idCobro

--ALTER TABLE dbo.CobroDetalle ALTER COLUMN saldo NUMERIC(18,5) NOT NULL

select * from PagoDetalle