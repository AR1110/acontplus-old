IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'idx_cuentaxcobrar_doc')
		BEGIN
			DROP INDEX idx_cuentaxcobrar_doc ON Contabilidad.CuentaPorCobrar;  
		END
	ELSE
		BEGIN
			CREATE NONCLUSTERED INDEX idx_cuentaxcobrar_doc
			ON Contabilidad.CuentaPorCobrar(codDoc, idDocumento)
		END
