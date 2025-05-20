USE Acontplus;
GO

-- Verificar si la restricción ya existe
--IF NOT EXISTS (
--    SELECT 1
--    FROM sys.default_constraints
--    WHERE parent_object_id = OBJECT_ID('dbo.SubentidadFinanciera') 
--      AND name = 'df_sef_fecha_registro'
--)
--BEGIN
--    -- Agregar la restricción por defecto
--    ALTER TABLE dbo.SubentidadFinanciera
--    ADD CONSTRAINT df_sef_fecha_registro
--    DEFAULT GETDATE() FOR fechaRegistro;
--END;
--GO


-- Verificar si la clave foránea ya existe
IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE parent_object_id = OBJECT_ID('dbo.SubentidadFinanciera') 
      AND name = 'fk_sef_entidad'
)
BEGIN
    -- Agregar la clave foránea
    ALTER TABLE dbo.SubentidadFinanciera
    ADD CONSTRAINT fk_sef_entidad
    FOREIGN KEY (idEntidad) REFERENCES dbo.Entidad(idEntidad);
END;
GO

-- Verificar si la clave foránea ya existe
IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE parent_object_id = OBJECT_ID('dbo.SubentidadFinanciera') 
      AND name = 'fk_sef_usuario'
)
BEGIN
    -- Agregar la clave foránea
    ALTER TABLE dbo.SubentidadFinanciera
    ADD CONSTRAINT fk_sef_usuario
    FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(idUsuario);
END;
GO

-- Verificar si la clave foránea ya existe
IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE parent_object_id = OBJECT_ID('dbo.ComprobanteIngreso') 
      AND name = 'fk_comp_ing_entidad'
)
BEGIN
    -- Agregar la clave foránea
    ALTER TABLE dbo.ComprobanteIngreso
    ADD CONSTRAINT fk_comp_ing_entidad
    FOREIGN KEY (idEntidad) REFERENCES dbo.Entidad(idEntidad);
END;
GO

 
--select idEntidad from dbo.ComprobanteIngreso where idEntidad not in (select idEntidad from Entidad) group by idEntidad

--update ci set ci.idEntidad = e.identidad from dbo.ComprobanteIngreso ci
--inner join sri.Establecimiento e on ci.idestablecimiento = e.idestablecimiento
--where ci.idEntidad not in (select idEntidad from Entidad)  

--select *  from dbo.SubEntidadFinanciera where idEntidad not in (select idEntidad from Entidad) --group by idEntidad

--update sef set sef.idEntidad = ci.idEntidad
----select * 
--from dbo.SubEntidadFinanciera sef
--INNER JOIN Cobro c  ON SEF.idSubEntidadFinanciera = C.idSubEntidadFinanciera
--inner join ComprobanteIngreso ci ON c.idComprobanteIngreso = CI.idComprobanteIngreso
--where c.IDSubEntidadFinanciera IN (
--select IDSubEntidadFinanciera from dbo.SubEntidadFinanciera where idEntidad not in (select idEntidad from Entidad)
--)

--select * from 
