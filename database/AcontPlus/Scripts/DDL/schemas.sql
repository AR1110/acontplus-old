USE AcontPlus
GO
IF NOT EXISTS (SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'Sistema')
    EXEC('CREATE SCHEMA Sistema');
GO
IF NOT EXISTS (SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'Reporte')
    EXEC('CREATE SCHEMA Reporte');
GO
IF NOT EXISTS (SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'ReporteLogistica')
    EXEC('CREATE SCHEMA ReporteLogistica');
GO
IF NOT EXISTS (SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'ReporteFact')
    EXEC('CREATE SCHEMA ReporteFact');
GO
IF NOT EXISTS (SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'Recepcion')
    EXEC('CREATE SCHEMA Recepcion');
GO
IF NOT EXISTS (SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'Dashboard')
    EXEC('CREATE SCHEMA Dashboard');
GO
IF NOT EXISTS (SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'Contabilidad')
    EXEC('CREATE SCHEMA Contabilidad');
GO
IF NOT EXISTS (SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'Compras')
    EXEC('CREATE SCHEMA Compras');
GO
IF NOT EXISTS (SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'FactElect')
    EXEC('CREATE SCHEMA FactElect');
GO
IF NOT EXISTS (SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'Restaurant')
    EXEC('CREATE SCHEMA Restaurant');
GO
IF NOT EXISTS (SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'ReporteCompras')
    EXEC('CREATE SCHEMA ReporteCompras');
GO