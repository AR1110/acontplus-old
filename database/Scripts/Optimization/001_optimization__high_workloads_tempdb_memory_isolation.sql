-- =====================================================
-- SCRIPT CONSOLIDADO DE MANTENIMIENTO - ACONTPLUS
-- =====================================================

USE master;
GO

-- Variables de control
DECLARE @DatabaseName NVARCHAR(128) = 'AcontPlus';
DECLARE @Execute BIT = 1; -- Cambiar a 0 para solo mostrar información
DECLARE @EnableRollback BIT = 0; -- Cambiar a 1 para ejecutar rollback
DECLARE @Version NVARCHAR(128) = CAST(SERVERPROPERTY('ProductVersion') AS NVARCHAR(128));
DECLARE @MajorVersion INT = CAST(SUBSTRING(@Version, 1, CHARINDEX('.', @Version) - 1) AS INT);

PRINT '=== SCRIPT CONSOLIDADO DE OPTIMIZACIONES SQL SERVER ===';
PRINT 'Base de datos: ' + @DatabaseName;
PRINT 'Versión SQL Server: ' + @Version + ' (Major: ' + CAST(@MajorVersion AS VARCHAR) + ')';
PRINT 'Modo ejecución: ' + CASE WHEN @Execute = 1 THEN 'APLICAR CAMBIOS' ELSE 'SOLO INFORMACIÓN' END;
PRINT 'Rollback: ' + CASE WHEN @EnableRollback = 1 THEN 'ACTIVADO' ELSE 'DESACTIVADO' END;
PRINT 'Timestamp: ' + CONVERT(VARCHAR, GETDATE(), 120);
PRINT REPLICATE('=', 70);
--GO

-- =====================================================
-- SECCIÓN 1: ESTADO ACTUAL
-- =====================================================
PRINT '';
PRINT '--- ESTADO ACTUAL DE LA BASE DE DATOS ---';
DECLARE @SQL NVARCHAR(MAX) = N'SELECT 
    ''Estado Actual'' AS Seccion,
    name AS Base_Datos,
    state_desc AS Estado,
    user_access_desc AS Modo_Acceso,
    is_accelerated_database_recovery_on AS ADR_Actual,
    snapshot_isolation_state_desc AS Snapshot_Isolation_Estado,
    is_read_committed_snapshot_on AS Read_Committed_Snapshot_Actual
FROM sys.databases
WHERE name = @DatabaseName;';
EXEC sp_executesql @SQL, N'@DatabaseName NVARCHAR(128)', @DatabaseName;

-- Conexiones activas
PRINT '';
PRINT '--- CONEXIONES ACTIVAS ---';
SELECT 
    COUNT(*) AS Total_Conexiones,
    CASE 
        WHEN COUNT(*) = 0 THEN 'SEGURO PROCEDER'
        WHEN COUNT(*) <= 5 THEN 'PROCEDER CON PRECAUCIÓN'
        ELSE 'ALTA ACTIVIDAD - CONSIDERAR VENTANA DE MANTENIMIENTO'
    END AS Recomendacion
FROM sys.dm_exec_sessions 
WHERE database_id = DB_ID(@DatabaseName)
AND session_id <> @@SPID;

IF EXISTS (SELECT 1 FROM sys.dm_exec_sessions WHERE database_id = DB_ID(@DatabaseName) AND session_id <> @@SPID)
BEGIN
    SELECT 
        session_id AS SPID,
        login_name AS Usuario,
        host_name AS Host,
        program_name AS Programa,
        status AS Estado,
        last_request_start_time AS Ultima_Actividad
    FROM sys.dm_exec_sessions 
    WHERE database_id = DB_ID(@DatabaseName)
    AND session_id <> @@SPID;
END

-- Estado actual de TempDB
PRINT '';
PRINT '--- ESTADO ACTUAL DE TEMPDB ---';
SELECT 
    'TempDB Antes' AS Momento,
    name AS Archivo,
    CAST(size * 8.0 / 1024 AS DECIMAL(10,2)) AS Tamaño_MB,
    CAST(FILEPROPERTY(name, 'SpaceUsed') * 8.0 / 1024 AS DECIMAL(10,2)) AS Usado_MB,
    CAST(FILEPROPERTY(name, 'SpaceUsed') * 100.0 / size AS DECIMAL(5,2)) AS Porcentaje_Uso
FROM sys.master_files 
WHERE database_id = DB_ID('tempdb')
ORDER BY file_id;

-- =====================================================
-- SECCIÓN 2: ROLLBACK
-- =====================================================
IF @EnableRollback = 1
BEGIN
    PRINT '';
    PRINT REPLICATE('=', 70);
    PRINT '=== EJECUTANDO ROLLBACK DE CONFIGURACIONES ===';
    PRINT REPLICATE('=', 70);
    
    IF @Execute = 1
    BEGIN
        BEGIN TRY
            EXEC('ALTER DATABASE [' + @DatabaseName + '] SET SINGLE_USER WITH ROLLBACK IMMEDIATE');
            EXEC('ALTER DATABASE [' + @DatabaseName + '] SET ACCELERATED_DATABASE_RECOVERY = OFF');
            EXEC('ALTER DATABASE [' + @DatabaseName + '] SET READ_COMMITTED_SNAPSHOT = OFF');
            EXEC('ALTER DATABASE [' + @DatabaseName + '] SET ALLOW_SNAPSHOT_ISOLATION = OFF');

            IF @MajorVersion >= 16
            BEGIN
                BEGIN TRY
                    EXEC('ALTER DATABASE [' + @DatabaseName + '] SET OPTIMIZED_LOCKING = OFF');
                END TRY
                BEGIN CATCH
                    PRINT 'WARNING: OPTIMIZED_LOCKING OFF falló: ' + ERROR_MESSAGE();
                END CATCH
            END

            EXEC('ALTER DATABASE [' + @DatabaseName + '] SET MULTI_USER');
            PRINT 'SUCCESS: Rollback completado';
        END TRY
        BEGIN CATCH
            PRINT 'ERROR en rollback: ' + ERROR_MESSAGE();
            BEGIN TRY
                EXEC('ALTER DATABASE [' + @DatabaseName + '] SET MULTI_USER');
            END TRY
            BEGIN CATCH
                PRINT 'ERROR CRÍTICO: No se pudo restaurar MULTI USER';
            END CATCH
        END CATCH
    END
    ELSE
    BEGIN
        PRINT 'MODO INFORMACIÓN: Rollback no ejecutado';
    END
    GOTO EndScript;
END

-- =====================================================
-- SECCIÓN 3: IMPLEMENTACIÓN
-- =====================================================
PRINT '';
PRINT REPLICATE('=', 70);
PRINT '=== IMPLEMENTANDO OPTIMIZACIONES ===';
PRINT REPLICATE('=', 70);

IF @Execute = 1
BEGIN
    BEGIN TRY
        EXEC('ALTER DATABASE [' + @DatabaseName + '] SET SINGLE_USER WITH ROLLBACK IMMEDIATE');
        EXEC('ALTER DATABASE [' + @DatabaseName + '] SET ACCELERATED_DATABASE_RECOVERY = ON');
        EXEC('ALTER DATABASE [' + @DatabaseName + '] SET ALLOW_SNAPSHOT_ISOLATION ON');
        EXEC('ALTER DATABASE [' + @DatabaseName + '] SET READ_COMMITTED_SNAPSHOT ON');

        IF @MajorVersion >= 17
        BEGIN
            BEGIN TRY
                EXEC('ALTER DATABASE [' + @DatabaseName + '] SET OPTIMIZED_LOCKING = ON');
                PRINT 'SUCCESS: OPTIMIZED_LOCKING habilitado';
            END TRY
            BEGIN CATCH
                PRINT 'WARNING: No se pudo habilitar OPTIMIZED_LOCKING: ' + ERROR_MESSAGE();
            END CATCH
        END
        ELSE
        BEGIN
            PRINT 'INFO: OPTIMIZED_LOCKING no disponible en versión actual';
        END

        EXEC('ALTER DATABASE [' + @DatabaseName + '] SET MULTI_USER');
        PRINT 'SUCCESS: Optimización completada';
    END TRY
    BEGIN CATCH
        PRINT 'ERROR en implementación: ' + ERROR_MESSAGE();
        BEGIN TRY
            EXEC('ALTER DATABASE [' + @DatabaseName + '] SET MULTI_USER');
        END TRY
        BEGIN CATCH
            PRINT 'ERROR CRÍTICO: MULTI USER falló';
        END CATCH
    END CATCH
END
ELSE
BEGIN
    PRINT 'MODO INFORMACIÓN: Optimizaciones no ejecutadas (@Execute = 0)';
END

-- =====================================================
-- SECCIÓN 4: VERIFICACIÓN FINAL
-- =====================================================
EndScript:

PRINT '';
PRINT REPLICATE('=', 70);
PRINT '=== VERIFICACIÓN FINAL ===';
PRINT REPLICATE('=', 70);

EXEC sp_executesql @SQL, N'@DatabaseName NVARCHAR(128)', @DatabaseName;

-- Estado final de TempDB
PRINT '';
PRINT '--- ESTADO FINAL DE TEMPDB ---';
SELECT 
    'TempDB Después' AS Momento,
    name AS Archivo,
    CAST(size * 8.0 / 1024 AS DECIMAL(10,2)) AS Tamaño_MB,
    CAST(FILEPROPERTY(name, 'SpaceUsed') * 8.0 / 1024 AS DECIMAL(10,2)) AS Usado_MB,
    CAST(FILEPROPERTY(name, 'SpaceUsed') * 100.0 / size AS DECIMAL(5,2)) AS Porcentaje_Uso
FROM sys.master_files 
WHERE database_id = DB_ID('tempdb')
ORDER BY file_id;

-- Uso de memoria
PRINT '';
PRINT '--- USO DE MEMORIA POST-IMPLEMENTACIÓN ---';
WITH Memoria AS (
    SELECT 
        counter_name,
        cntr_value / 1024.0 AS MB
    FROM sys.dm_os_performance_counters 
    WHERE counter_name IN ('Total Server Memory (KB)', 'Target Server Memory (KB)')
)
SELECT 
    counter_name AS Tipo,
    CAST(MB AS DECIMAL(10,2)) AS MB_Usados
FROM Memoria;

PRINT '';
PRINT REPLICATE('=', 70);
PRINT '=== SCRIPT COMPLETADO ===';
PRINT 'Timestamp final: ' + CONVERT(VARCHAR, GETDATE(), 120);
PRINT REPLICATE('=', 70);
