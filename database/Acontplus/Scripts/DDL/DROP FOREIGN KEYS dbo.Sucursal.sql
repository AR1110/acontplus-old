USE Acontplus
GO
EXEC sp_fkeys @pktable_name = 'Sucursal', @pktable_owner = 'dbo'
GO
IF EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE object_id = OBJECT_ID(N'FK__Anticipo__idSucu__30B91D22') 
    AND parent_object_id = OBJECT_ID(N'dbo.Anticipo')
)
ALTER TABLE dbo.Anticipo DROP CONSTRAINT FK__Anticipo__idSucu__30B91D22
GO
IF EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE object_id = OBJECT_ID(N'FK__Comproban__idSuc__7E97B1A9') 
    AND parent_object_id = OBJECT_ID(N'dbo.ComprobanteEgreso')
)
ALTER TABLE dbo.ComprobanteEgreso DROP CONSTRAINT FK__Comproban__idSuc__7E97B1A9

GO
IF EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE object_id = OBJECT_ID(N'FK__FormaPago__idSuc__48C5B0DD') 
    AND parent_object_id = OBJECT_ID(N'dbo.FormaPagoFactura')
)
ALTER TABLE dbo.FormaPagoFactura DROP CONSTRAINT FK__FormaPago__idSuc__48C5B0DD
GO
IF EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE object_id = OBJECT_ID(N'FK__Movimient__idSuc__3A42875C') 
    AND parent_object_id = OBJECT_ID(N'dbo.MovimientoCaja')
)
ALTER TABLE dbo.MovimientoCaja DROP CONSTRAINT FK__Movimient__idSuc__3A42875C
GO
IF EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE object_id = OBJECT_ID(N'FK__NotaCredi__idSuc__5FDE205F') 
    AND parent_object_id = OBJECT_ID(N'dbo.NotaCreditoProveedor')
)
ALTER TABLE dbo.NotaCreditoProveedor DROP CONSTRAINT FK__NotaCredi__idSuc__5FDE205F
GO
IF EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE object_id = OBJECT_ID(N'FK__NotaVenta__idSuc__74EE4BDE') 
    AND parent_object_id = OBJECT_ID(N'dbo.NotaVenta')
)
ALTER TABLE dbo.NotaVenta DROP CONSTRAINT FK__NotaVenta__idSuc__74EE4BDE
GO
IF EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE object_id = OBJECT_ID(N'FK__Retencion__idSuc__51700577') 
    AND parent_object_id = OBJECT_ID(N'dbo.RetencionVenta')
)
ALTER TABLE dbo.RetencionVenta DROP CONSTRAINT FK__Retencion__idSuc__51700577
GO
IF EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE object_id = OBJECT_ID(N'FK__Rol__idSucursal__26CFC035') 
    AND parent_object_id = OBJECT_ID(N'dbo.Rol')
)
ALTER TABLE dbo.Rol DROP CONSTRAINT FK__Rol__idSucursal__26CFC035

GO
IF EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE object_id = OBJECT_ID(N'FactElect.FK__Comproban__idSuc__2653FC6E') 
    AND parent_object_id = OBJECT_ID(N'FactElect.Comprobante_Sri_Config')
)
ALTER TABLE FactElect.Comprobante_Sri_Config DROP CONSTRAINT FK__Comproban__idSuc__2653FC6E

GO
IF EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE object_id = OBJECT_ID(N'Restaurant.FK__ConfigPri__idSuc__00ED6D95') 
    AND parent_object_id = OBJECT_ID(N'Restaurant.ConfigPrinter')
)
ALTER TABLE Restaurant.ConfigPrinter DROP CONSTRAINT FK__ConfigPri__idSuc__00ED6D95

GO
IF EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE object_id = OBJECT_ID(N'Restaurant.FK__ConfigTpv__idSuc__0AEFA004') 
    AND parent_object_id = OBJECT_ID(N'Restaurant.ConfigTpv')
)
ALTER TABLE Restaurant.ConfigTpv DROP CONSTRAINT FK__ConfigTpv__idSuc__0AEFA004
GO
DROP TABLE IF EXISTS dbo.Sucursal

GO
