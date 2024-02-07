use [Acontplus]
go 

DECLARE @tbDetalle AS TABLE(

    idCobroDetalle INT UNIQUE NOT NULL
   ,saldo NUMERIC(18,5) NOT NULL
)

--ALTER TABLE dbo.CobroDetalle ADD saldo NUMERIC(18,5)

--update cd set
--    cd.saldo = cc.cuota
--from CobroDetalle cd
--inner join Cobro co ON co.idCobro = cd.idCobro
--inner join Contabilidad.CuotaPorCobrar cc ON cc.idCuotaPorCobrar = cd.idCuotaPorCobrar
--inner join ComprobanteIngreso ci on ci.idComprobanteIngreso = co.idComprobanteIngreso

--INSERT INTO @tbDetalle (idCobroDetalle,saldo)
--select cd.idCobroDetalle
--      ,cd.saldo - SUM( IIF(co.cobro = 1,cd.abono,0)) over(partition by cd.idCuotaPorCobrar ORDER BY cd.idCobroDetalle  ROWS UNBOUNDED PRECEDING)
--from CobroDetalle cd
--inner join Cobro co ON co.idCobro = cd.idCobro
--inner join ComprobanteIngreso ci on ci.idComprobanteIngreso = co.idComprobanteIngreso
--where ci.estado = 1
--GROUP BY cd.idCobro,cd.idCuotaPorCobrar,cd.saldo,cd.abono,cd.idCobroDetalle,co.cobro
--ORDER BY cd.idCuotaPorCobrar,cd.idCobro

--update cd set
--    cd.saldo = td.saldo
--from CobroDetalle cd 
--inner join @tbDetalle td on td.idCobroDetalle = cd.idCobroDetalle

--update CobroDetalle set saldo = abono + cuota

--select cd.idCobroDetalle,idCuotaPorCobrar,cd.saldo,cd.abono ,cd.saldo - cd.abono
--from CobroDetalle cd
--inner join Cobro co ON co.idCobro = cd.idCobro
--inner join ComprobanteIngreso ci on ci.idComprobanteIngreso = co.idComprobanteIngreso
--where ci.estado = 1
--ORDER BY cd.idCuotaPorCobrar,cd.idCobro

--ALTER TABLE dbo.CobroDetalle ALTER COLUMN saldo NUMERIC(18,5) NOT NULL

--> Historial de documentos 

--ALTER TABLE Contabilidad.Historial_Cobro ADD saldo NUMERIC(18,5)

--update hc set 
--    hc.saldo = cc.importeTotal
--from Contabilidad.Historial_Cobro hc
--INNER JOIN Contabilidad.CuentaPorCobrar cc ON cc.idCuentaPorCobrar = hc.idCuentaPorCobrar
--inner join dbo.ComprobanteIngreso ci ON ci.idComprobanteIngreso = hc.idComprobanteIngreso

--ALTER TABLE Contabilidad.Historial_Cobro ALTER COLUMN saldo NUMERIC(18,5) NOT NULL

DECLARE @tbHistorial AS TABLE(
    idHistorialCobro INT UNIQUE NOT NULL
   ,saldo NUMERIC(18,5) NOT NULL
)

--INSERT INTO @tbHistorial (idHistorialCobro,saldo)
--select hc.idHistorialCobro
--      ,hc.saldo - SUM(hc.abono) over(partition by hc.idCuentaPorCobrar ORDER BY hc.idHistorialCobro  ROWS UNBOUNDED PRECEDING) as saldo
--from Contabilidad.Historial_Cobro hc
--INNER JOIN Contabilidad.CuentaPorCobrar cc ON cc.idCuentaPorCobrar = hc.idCuentaPorCobrar
--inner join dbo.ComprobanteIngreso ci ON ci.idComprobanteIngreso = hc.idComprobanteIngreso
--WHERE ci.estado = 1
--GROUP BY hc.idComprobanteIngreso,hc.idHistorialCobro,hc.idCuentaPorCobrar,hc.saldo,hc.abono
--ORDER BY hc.idCuentaPorCobrar,hc.idComprobanteIngreso 

--update hc set   
--    hc.saldo = th.saldo
--from Contabilidad.Historial_Cobro hc 
--INNER JOIN @tbHistorial th on th.idHistorialCobro = hc.idHistorialCobro

--update Contabilidad.Historial_Cobro set saldo = abono + saldo

--select hc.idCuentaPorCobrar,hc.saldo as importeTotal , hc.abono , hc.saldo - hc.abono as saldo 
--from Contabilidad.Historial_Cobro hc
--INNER JOIN Contabilidad.CuentaPorCobrar cc ON cc.idCuentaPorCobrar = hc.idCuentaPorCobrar
--inner join dbo.ComprobanteIngreso ci ON ci.idComprobanteIngreso = hc.idComprobanteIngreso
--WHERE ci.estado = 1
--ORDER BY hc.idCuentaPorCobrar,hc.idComprobanteIngreso  

--select * from Contabilidad.CuentaPorCobrar where idCuentaPorCobrar = 25

--select top 10 * from Contabilidad.CuentaPorCobrar 