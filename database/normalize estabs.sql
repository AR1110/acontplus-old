USE Acontplus
GO

IF NOT EXISTS (
    SELECT 1 
    FROM sys.default_constraints 
    WHERE name = 'df_error_sistema_token' 
        AND parent_object_id = OBJECT_ID('dbo.ErroresSistema'))
BEGIN
    ALTER TABLE dbo.ErroresSistema 
    ADD CONSTRAINT df_error_sistema_token 
    DEFAULT NEWID() FOR token
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.default_constraints
    WHERE name = 'df_error_sistema_date' 
        AND parent_object_id = OBJECT_ID('dbo.ErroresSistema'))
BEGIN
    ALTER TABLE dbo.ErroresSistema 
    ADD CONSTRAINT df_error_sistema_date
    DEFAULT GETDATE() FOR errorDate
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'aplicacionId'
        AND Object_ID = Object_ID(N'dbo.TipoDocumento')
)
BEGIN
    ALTER TABLE dbo.TipoDocumento ADD aplicacionId INT NULL
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'fromMobile'
        AND Object_ID = Object_ID(N'Sri.Establecimiento')
)
BEGIN
    ALTER TABLE Sri.Establecimiento ADD fromMobile BIT NULL
END;
GO

----------------------ESTAB ASIGN -----------------------------

IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'idEstablecimiento'
        AND Object_ID = Object_ID(N'Config.Estab_Asig')
)
BEGIN
    ALTER TABLE Config.Estab_Asig ADD idEstablecimiento INT NULL
END;
GO 

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'fk_estab_config_estab_asign'
        AND parent_object_id = OBJECT_ID('Config.Estab_Asig')
)
BEGIN 
    ALTER TABLE Config.Estab_Asig ADD CONSTRAINT fk_estab_config_estab_asign FOREIGN KEY (idEstablecimiento) REFERENCES Sri.Establecimiento(idEstablecimiento)
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'idUsuario'
        AND Object_ID = Object_ID(N'Config.Estab_Asig')
)
BEGIN
    ALTER TABLE Config.Estab_Asig ADD idUsuario INT NULL
END;
GO 

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'fk_user_config_estab_asign'
        AND parent_object_id = OBJECT_ID('Config.Estab_Asig')
)
BEGIN 
    ALTER TABLE Config.Estab_Asig 
    ADD CONSTRAINT fk_user_config_estab_asign 
    FOREIGN KEY (idUsuario)
    REFERENCES dbo.Usuario(idUsuario)
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'fromMobile'
        AND Object_ID = Object_ID(N'Config.Estab_Asig')
)
BEGIN
    ALTER TABLE Config.Estab_Asig ADD fromMobile BIT NULL
END;
GO

----------------------PTO EMI ASIGN------------------

IF NOT EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE name = N'idEstab_Asig'
        AND OBJECT_ID = OBJECT_ID('Config.PtoEmi_Asig'))
BEGIN
    ALTER TABLE Config.PtoEmi_Asig ADD idEstab_Asig INT NULL
END
GO

IF NOT EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE name = N'fk_config_estab_asign_pto_asign'
        AND parent_object_id = OBJECT_ID('Config.PtoEmi_Asig'))
BEGIN
    ALTER TABLE Config.PtoEmi_Asig 
    ADD CONSTRAINT fk_config_estab_asign_pto_asign 
    FOREIGN KEY (idEstab_Asig) 
    REFERENCES Config.Estab_Asig(idEstab_Asig)
END
GO

IF NOT EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE name = N'idUsuario'
        AND OBJECT_ID = OBJECT_ID('Config.PtoEmi_Asig'))
BEGIN
    ALTER TABLE Config.PtoEmi_Asig ADD idUsuario INT NULL
END
GO

IF NOT EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE name = N'fk_user_config_ptoEmi_asign'
        AND parent_object_id = OBJECT_ID('Config.PtoEmi_Asig'))
BEGIN
    ALTER TABLE Config.PtoEmi_Asig
    ADD CONSTRAINT fk_user_config_ptoEmi_asign
    FOREIGN KEY (idUsuario)
    REFERENCES dbo.Usuario(idUsuario)
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'fromMobile'
        AND Object_ID = Object_ID(N'Config.PtoEmi_Asig')
)
BEGIN
    ALTER TABLE Config.PtoEmi_Asig ADD fromMobile BIT NULL
END;
GO

-----------------BODEGA ASIG----------------------------

IF NOT EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE name = N'idEstab_Asig'
        AND OBJECT_ID = OBJECT_ID('Config.Bodeg_Asig'))
BEGIN
    ALTER TABLE Config.Bodeg_Asig ADD idEstab_Asig INT NULL
END
GO

IF NOT EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE name = N'fk_config_estab_asign_bodega_asign'
        AND parent_object_id = OBJECT_ID('Config.Bodeg_Asig'))
BEGIN
    ALTER TABLE Config.Bodeg_Asig 
    ADD CONSTRAINT fk_config_estab_asign_bodega_asign 
    FOREIGN KEY (idEstab_Asig) 
    REFERENCES Config.Estab_Asig(idEstab_Asig)
END
GO

IF NOT EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE name = N'idUsuario'
        AND OBJECT_ID = OBJECT_ID('Config.Bodeg_Asig'))
BEGIN
    ALTER TABLE Config.Bodeg_Asig ADD idUsuario INT NULL
END
GO

IF NOT EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE name = N'fk_user_config_bodega_asign'
        AND parent_object_id = OBJECT_ID('Config.Bodeg_Asig'))
BEGIN
    ALTER TABLE Config.Bodeg_Asig
    ADD CONSTRAINT fk_user_config_bodega_asign
    FOREIGN KEY (idUsuario)
    REFERENCES dbo.Usuario(idUsuario)
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'fromMobile'
        AND Object_ID = Object_ID(N'Config.Bodeg_Asig')
)
BEGIN
    ALTER TABLE Config.Bodeg_Asig ADD fromMobile BIT NULL
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'idEstablecimiento'
        AND Object_ID = Object_ID(N'dbo.Bodega')
)
BEGIN
    ALTER TABLE dbo.Bodega ADD idEstablecimiento INT NULL
END;
GO

IF NOT EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE name = N'fk_estab_bodega'
        AND parent_object_id = OBJECT_ID('dbo.Bodega'))
BEGIN
    ALTER TABLE dbo.Bodega
    ADD CONSTRAINT fk_estab_bodega
    FOREIGN KEY (idEstablecimiento)
    REFERENCES Sri.Establecimiento(idEstablecimiento)
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'fromMobile'
        AND Object_ID = Object_ID(N'dbo.Bodega')
)
BEGIN
    ALTER TABLE dbo.Bodega ADD fromMobile BIT NULL
END;
GO


IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'fromMobile'
        AND Object_ID = Object_ID(N'dbo.ConfiguracionDocumento')
)
BEGIN
    ALTER TABLE dbo.ConfiguracionDocumento ADD fromMobile BIT NULL
END;
GO


IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE Name = N'fromMobile'
        AND Object_ID = Object_ID(N'dbo.FirmaElectronica')
)
BEGIN
    ALTER TABLE dbo.FirmaElectronica ADD fromMobile BIT NULL
END;
GO
