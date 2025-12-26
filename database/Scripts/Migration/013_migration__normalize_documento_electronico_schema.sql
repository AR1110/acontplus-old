USE Acontplus
GO

DROP VIEW IF EXISTS FACTELECT.v_DocElectronico
GO
DROP VIEW IF EXISTS Compra.v_Liquidacion
GO
DROP VIEW IF EXISTS Ventas.v_Factura
GO
DROP VIEW IF EXISTS Ventas.v_NotaCredito
GO

DROP VIEW IF EXISTS Logistica.v_GuiaRemision
GO

DROP VIEW IF EXISTS dbo.v_CuentaPorPagar
GO





IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'ambiente' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN ambiente;
END
GO

IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'numEstab' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN numEstab;
END
GO

IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'ptoEmision' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN ptoEmision;
END
GO

IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'codigoAutorizacion' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN codigoAutorizacion;
END
GO

IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'xmlSri' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN xmlSri;
END
GO

IF EXISTS (SELECT * FROM sys.default_constraints 
           WHERE object_id = OBJECT_ID('DF__Documento__estat__239F1926'))
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP CONSTRAINT DF__Documento__estat__239F1926;
END
GO

IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'estatusEmail' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN estatusEmail;
END
GO

IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'estado' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN estado;
END
GO


IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'identificador' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN identificador;
END
GO


IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'mensaje' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN mensaje;
END
GO

IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'idContribuyente' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN idContribuyente;
END
GO

IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'idSucursal' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN idSucursal;
END
GO

IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'ruc' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN ruc;
END
GO

IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'numeroIdentificacion' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN numeroIdentificacion;
END
GO

IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'codEstab' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN codEstab;
END
GO

-- Check if the column 'customerId' exists in the table 'DocumentoElectronico'
IF NOT EXISTS (SELECT * FROM sys.columns 
               WHERE name = 'customerId' 
               AND object_id = OBJECT_ID('dbo.DocumentoElectronico'))
BEGIN
    -- Add the column 'customerId' to the table 'DocumentoElectronico'
    ALTER TABLE dbo.DocumentoElectronico ADD customerId INT;
END
GO

-- Check if the foreign key constraint 'fk_cc_de' already exists
IF NOT EXISTS (SELECT * 
               FROM sys.foreign_keys 
               WHERE name = 'fk_cc_de' 
               AND parent_object_id = OBJECT_ID('dbo.DocumentoElectronico'))
BEGIN
    -- Add the foreign key constraint to the 'customerId' column
    ALTER TABLE dbo.DocumentoElectronico
    ADD CONSTRAINT fk_cc_de FOREIGN KEY (customerId) REFERENCES Customer.Customer(Id);
END
GO
 

-- Check if the foreign key constraint 'fk_user_de' already exists
IF NOT EXISTS (SELECT * 
               FROM sys.foreign_keys 
               WHERE name = 'fk_user_de' 
               AND parent_object_id = OBJECT_ID('dbo.DocumentoElectronico'))
BEGIN
    -- Add the foreign key constraint to the 'idUsuario' column
    ALTER TABLE dbo.DocumentoElectronico
    ADD CONSTRAINT fk_user_de FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(idUsuario);
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns 
               WHERE name = 'idEstadoServicio' 
               AND object_id = OBJECT_ID('dbo.DocumentoElectronico'))
BEGIN
    ALTER TABLE dbo.DocumentoElectronico ADD idEstadoServicio INT;
END
GO

IF NOT EXISTS (SELECT * 
               FROM sys.foreign_keys 
               WHERE name = 'fk_es_de' 
               AND parent_object_id = OBJECT_ID('dbo.DocumentoElectronico'))
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    ADD CONSTRAINT fk_es_de FOREIGN KEY (idEstadoServicio) REFERENCES FactElect.EstadoServicio(idEstadoServicio);
END
GO

IF NOT EXISTS (SELECT * 
               FROM sys.foreign_keys 
               WHERE name = 'fk_customer_cc' 
               AND parent_object_id = OBJECT_ID('dbo.Cliente'))
BEGIN
    ALTER TABLE dbo.Cliente
    ADD CONSTRAINT fk_customer_cc FOREIGN KEY (customerId) REFERENCES Customer.Customer(Id);
END
GO

IF NOT EXISTS (SELECT * 
               FROM sys.foreign_keys 
               WHERE name = 'fk_customer_cp' 
               AND parent_object_id = OBJECT_ID('dbo.Proveedor'))
BEGIN
    ALTER TABLE dbo.Proveedor
    ADD CONSTRAINT fk_customer_cp FOREIGN KEY (customerId) REFERENCES Customer.Customer(Id);
END
GO

IF EXISTS (SELECT * 
               FROM sys.default_constraints 
               WHERE name = 'DF__Documento__codEs__09B7BDC0' 
               AND parent_object_id = OBJECT_ID('dbo.DocumentoElectronico'))
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP CONSTRAINT DF__Documento__codEs__09B7BDC0
END
GO

IF EXISTS (SELECT * 
               FROM sys.foreign_keys 
               WHERE name = 'FK__PuntoEmis__ambie__7CD787F8' 
               AND parent_object_id = OBJECT_ID('dbo.PuntoEmision'))
BEGIN
    ALTER TABLE dbo.PuntoEmision
    DROP CONSTRAINT FK__PuntoEmis__ambie__7CD787F8
END
GO

IF EXISTS (SELECT * 
               FROM sys.default_constraints 
               WHERE name = 'DF__Documento__isAut__0AABE1F9' 
               AND parent_object_id = OBJECT_ID('dbo.DocumentoElectronico'))
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP CONSTRAINT DF__Documento__isAut__0AABE1F9
END
GO

UPDATE DocumentoElectronico SET isAutomatic = 0 WHERE isAutomatic IS NULL
GO

ALTER TABLE dbo.DocumentoElectronico ALTER COLUMN isAutomatic INT NOT NULL
GO

UPDATE de  SET idEstadoServicio = es.idEstadoServicio
FROM dbo.DocumentoElectronico de WITH (NOLOCK)
INNER JOIN FactElect.EstadoServicio es ON de.codEstado = es.codigo
GO

ALTER TABLE dbo.DocumentoElectronico ALTER COLUMN idEstadoServicio INT NOT NULL
GO

ALTER TABLE dbo.DocumentoElectronico ALTER COLUMN codEstado INT NULL
GO 

ALTER TABLE dbo.DocumentoElectronico ALTER COLUMN customerId INT NOT NULL

IF EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE Name = N'codEstado' 
    AND Object_ID = Object_ID(N'dbo.DocumentoElectronico')
)
BEGIN
    ALTER TABLE dbo.DocumentoElectronico
    DROP COLUMN codEstado;
END
GO

 select top 100 dc.* from dbo.DocumentoElectronico  dc
 	INNER JOIN FactElect.EstadoServicio es WITH(NOLOCK) ON dc.idEstadoServicio = es.idEstadoServicio
 where es.codigo = 2 
and xmlAcontPlus is not  null
AND
dc.isAutomatic = 1
 order by iddocumentoelectronico desc

