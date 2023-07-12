use [AcontPlus]
GO 

ALTER TABLE CuotaXCobrar ADD mora NUMERIC(18,5) DEFAULT 0


ALTER TABLE CuotaXCobrar drop column saldo

ALTER TABLE CuotaXCobrar add saldo as (cuota + mora) - abono