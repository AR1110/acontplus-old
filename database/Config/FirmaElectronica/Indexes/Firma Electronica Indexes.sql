						IF EXISTS (SELECT name FROM sys.indexes  
            WHERE name = N'idx_Firma_Electronica_Entidad') 
			begin
    DROP INDEX idx_Firma_Electronica_Entidad ON dbo.FirmaElectronica;  
	end
GO
CREATE NONCLUSTERED INDEX idx_Firma_Electronica_Entidad
ON dbo.FirmaElectronica (idEntidad)
INCLUDE (contrasenia,nombreArchivo,firma)
GO