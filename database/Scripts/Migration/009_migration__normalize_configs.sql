USE Acontplus
GO
--FIRST CHECK DELETES
IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'fromMobile'
        AND Object_ID = Object_ID(N'dbo.TiempoCredito')
)
BEGIN
    ALTER TABLE dbo.TiempoCredito ADD fromMobile BIT NULL
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'fromMobile'
        AND Object_ID = Object_ID(N'dbo.SubEntidadFinanciera')
)
BEGIN
    ALTER TABLE dbo.SubEntidadFinanciera ADD fromMobile BIT NULL
END;
GO

--DELETE FROM dbo.Turno WHERE idEntidad NOT IN (SELECT idEntidad FROM Entidad)
--GO

IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_NAME = 'fk_turno_entidad'
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        AND TABLE_NAME = 'Turno'
)
BEGIN
    ALTER TABLE dbo.Turno
    ADD CONSTRAINT fk_turno_entidad
    FOREIGN KEY (idEntidad)
    REFERENCES dbo.Entidad(idEntidad)
END
GO
--UPDATE c SET c.idEntidad = ci.idEntidad FROM Contabilidad.Historial_Cobro chc
--INNER JOIN dbo.Cobro cb ON chc.idCobro = cb.idCobro
--INNER JOIN dbo.ComprobanteIngreso ci ON cb.idComprobanteIngreso = ci.idComprobanteIngreso
--INNER JOIN dbo.ControlCaja cc ON ci.idControlCaja = cc.idControlCaja
--INNER JOIN dbo.Caja c ON cc.idCaja = c.idCaja 
--WHERE c.idEntidad NOT IN (SELECT idEntidad FROM Entidad)
--GO


--DELETE chc FROM dbo.CobroDetalle chc
--INNER JOIN dbo.Cobro cb ON chc.idCobro = cb.idCobro
--INNER JOIN dbo.ComprobanteIngreso ci ON cb.idComprobanteIngreso = ci.idComprobanteIngreso
--INNER JOIN dbo.ControlCaja cc ON ci.idControlCaja = cc.idControlCaja
--INNER JOIN dbo.Caja c ON cc.idCaja = c.idCaja 
--WHERE c.idEntidad NOT IN (SELECT idEntidad FROM Entidad)
--GO


--DELETE cb FROM dbo.Cobro cb
--INNER JOIN dbo.ComprobanteIngreso ci ON cb.idComprobanteIngreso = ci.idComprobanteIngreso
--INNER JOIN dbo.ControlCaja cc ON ci.idControlCaja = cc.idControlCaja
--INNER JOIN dbo.Caja c ON cc.idCaja = c.idCaja 
--WHERE c.idEntidad NOT IN (SELECT idEntidad FROM Entidad)
--GO

--DELETE cb FROM dbo.CobroDocumento cb
--INNER JOIN dbo.ComprobanteIngreso ci ON cb.idComprobanteIngreso = ci.idComprobanteIngreso
--INNER JOIN dbo.ControlCaja cc ON ci.idControlCaja = cc.idControlCaja
--INNER JOIN dbo.Caja c ON cc.idCaja = c.idCaja 
--WHERE c.idEntidad NOT IN (SELECT idEntidad FROM Entidad)
--GO


--DELETE ci FROM dbo.ComprobanteIngreso ci
--INNER JOIN dbo.ControlCaja cc ON ci.idControlCaja = cc.idControlCaja
--INNER JOIN dbo.Caja c ON cc.idCaja = c.idCaja 
--WHERE c.idEntidad NOT IN (SELECT idEntidad FROM Entidad)
--GO

--DELETE cc FROM dbo.ControlCaja cc INNER JOIN dbo.Caja c ON cc.idCaja = c.idCaja WHERE c.idEntidad NOT IN (SELECT idEntidad FROM Entidad)
--GO

--DELETE FROM dbo.Caja WHERE idEntidad NOT IN (SELECT idEntidad FROM Entidad)
GO
IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_NAME = 'fk_caja_entidad'
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        AND TABLE_NAME = 'Caja'
)
BEGIN
    ALTER TABLE dbo.Caja
    ADD CONSTRAINT fk_caja_entidad
    FOREIGN KEY (idEntidad)
    REFERENCES dbo.Entidad(idEntidad)
END
GO