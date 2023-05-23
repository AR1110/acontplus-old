use [AcontPlus]
GO 


ALTER TABLE CuotaXCobrar drop column saldo

ALTER TABLE CuotaXCobrar add saldo as (cuota + mora) - abono

s