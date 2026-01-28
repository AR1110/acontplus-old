USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2025-05-23
-- Description: sp for update steps if config is manual
-- =============================================
CREATE OR ALTER PROCEDURE Config.CompanyDemoStep_Complete_Steps
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Variables para control
    DECLARE @TotalPasos INT;
    DECLARE @EmpresasProcesadas INT = 0;
    DECLARE @PasosInsertados INT = 0;
    DECLARE @Error NVARCHAR(4000);
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Obtener total de pasos de demo
        SELECT @TotalPasos = COUNT(*) FROM Config.DemoStep;
        
        PRINT 'Total de pasos de demo requeridos: ' + CAST(@TotalPasos AS VARCHAR);
        PRINT 'Iniciando proceso para empresas con suscripci�n no-demo...';
        
        -- Verificar si existen empresas elegibles para el proceso
        IF EXISTS (
            SELECT 1 
            FROM Sales.Suscripcion s 
            INNER JOIN Sales.SuscripcionDetalle sd ON s.Id = sd.SuscripcionId
            INNER JOIN Config.LicenciaDetalle ld ON sd.LicenciaDetalleId = ld.Id
            INNER JOIN Config.Licencia l ON ld.LicenciaId = l.Id
            INNER JOIN Config.LicenseType lt ON l.LicenseTypeId = lt.Id
            WHERE lt.Code <> 'D' -- No demo
            AND EXISTS (
                -- Solo empresas que ya tienen al menos un registro en CompanyDemoStep
                SELECT 1 FROM Config.CompanyDemoStep cds 
                WHERE cds.CompanyId = s.CompanyId
            )
            AND (
                -- Pero que no tienen todos los pasos completos
                SELECT COUNT(*) FROM Config.CompanyDemoStep cds 
                WHERE cds.CompanyId = s.CompanyId
            ) < @TotalPasos
        )
        BEGIN
            PRINT 'Se encontraron empresas que necesitan completar pasos de demo.';
            
            -- Mostrar empresas que ser�n procesadas
            SELECT DISTINCT 
                s.CompanyId,
                pasos_actuales.PasosCompletados as PasosActuales,
                @TotalPasos as PasosRequeridos,
                (@TotalPasos - pasos_actuales.PasosCompletados) as PasosFaltantes
            FROM Sales.Suscripcion s 
            INNER JOIN Sales.SuscripcionDetalle sd ON s.Id = sd.SuscripcionId
            INNER JOIN Config.LicenciaDetalle ld ON sd.LicenciaDetalleId = ld.Id
            INNER JOIN Config.Licencia l ON ld.LicenciaId = l.Id
            INNER JOIN Config.LicenseType lt ON l.LicenseTypeId = lt.Id
            INNER JOIN (
                -- Solo empresas que tienen al menos un paso registrado
                SELECT CompanyId, COUNT(*) as PasosCompletados
                FROM Config.CompanyDemoStep 
                GROUP BY CompanyId
            ) pasos_actuales ON s.CompanyId = pasos_actuales.CompanyId
            WHERE lt.Code <> 'D'
            AND pasos_actuales.PasosCompletados < @TotalPasos
            ORDER BY s.CompanyId;
            
            -- Insertar pasos faltantes para empresas elegibles
            INSERT INTO Config.CompanyDemoStep (DemoStepId, CompanyId, Uuid)
            SELECT ds.Id,
                   empresas_elegibles.CompanyId,
                   empresas_elegibles.Uuid
            FROM Config.DemoStep ds
            CROSS JOIN (
                -- Solo empresas con suscripci�n no-demo que ya tienen registros en CompanyDemoStep
                SELECT DISTINCT s.CompanyId, c.Uuid
                FROM Sales.Suscripcion s 
                INNER JOIN Sales.SuscripcionDetalle sd ON s.Id = sd.SuscripcionId
                INNER JOIN Config.LicenciaDetalle ld ON sd.LicenciaDetalleId = ld.Id
                INNER JOIN Config.Licencia l ON ld.LicenciaId = l.Id
                INNER JOIN Config.LicenseType lt ON l.LicenseTypeId = lt.Id
				INNER JOIN Config.Company c ON s.CompanyId = c.Id
                WHERE lt.Code <> 'D'
                AND EXISTS (
                    SELECT 1 FROM Config.CompanyDemoStep cds 
                    WHERE cds.CompanyId = s.CompanyId
                )
                AND (
                    SELECT COUNT(*) FROM Config.CompanyDemoStep cds 
                    WHERE cds.CompanyId = s.CompanyId
                ) < @TotalPasos
            ) empresas_elegibles
            WHERE NOT EXISTS (
                -- CORREGIDO: Usar DemoStepId en lugar de Id
                SELECT 1 
                FROM Config.CompanyDemoStep cds 
                WHERE cds.DemoStepId = ds.Id 
                AND cds.CompanyId = empresas_elegibles.CompanyId
            );
            
            -- Obtener n�mero de pasos insertados
            SET @PasosInsertados = @@ROWCOUNT;
            
            -- Contar empresas procesadas
            SELECT @EmpresasProcesadas = COUNT(DISTINCT CompanyId)
            FROM Config.CompanyDemoStep cds
            WHERE EXISTS (
                SELECT 1 
                FROM Sales.Suscripcion s 
                INNER JOIN Sales.SuscripcionDetalle sd ON s.Id = sd.SuscripcionId
                INNER JOIN Config.LicenciaDetalle ld ON sd.LicenciaDetalleId = ld.Id
                INNER JOIN Config.Licencia l ON ld.LicenciaId = l.Id
                INNER JOIN Config.LicenseType lt ON l.LicenseTypeId = lt.Id
                WHERE lt.Code <> 'D' 
                AND s.CompanyId = cds.CompanyId
            );
            
            PRINT 'Proceso completado exitosamente.';
            PRINT 'Empresas procesadas: ' + CAST(@EmpresasProcesadas AS VARCHAR);
            PRINT 'Pasos insertados: ' + CAST(@PasosInsertados AS VARCHAR);
            
        END
        ELSE
        BEGIN
            PRINT 'No se encontraron empresas elegibles para el proceso.';
            PRINT 'Criterios: Suscripci�n no-demo + Registros existentes en CompanyDemoStep + Pasos incompletos';
        END
        
        -- Verificaci�n final - HABILITADA Y CORREGIDA
        PRINT 'Estado final de empresas con suscripci�n no-demo:';
        
        --SELECT 
        --    s.CompanyId,
        --    COUNT(cds.DemoStepId) as PasosCompletados,
        --    @TotalPasos as TotalPasosRequeridos,
        --    CASE 
        --        WHEN COUNT(cds.DemoStepId) = @TotalPasos THEN 'COMPLETO' 
        --        ELSE 'INCOMPLETO (' + CAST((@TotalPasos - COUNT(cds.DemoStepId)) AS VARCHAR) + ' faltantes)'
        --    END as Estado
        --FROM (
        --    SELECT DISTINCT s2.CompanyId
        --    FROM Sales.Suscripcion s2 
        --    INNER JOIN Sales.SuscripcionDetalle sd2 ON s2.Id = sd2.SuscripcionId
        --    INNER JOIN Config.LicenciaDetalle ld2 ON sd2.LicenciaDetalleId = ld2.Id
        --    INNER JOIN Config.Licencia l2 ON ld2.LicenciaId = l2.Id
        --    INNER JOIN Config.LicenseType lt2 ON l2.LicenseTypeId = lt2.Id
        --    WHERE lt2.Code <> 'D'
        --    AND EXISTS (
        --        SELECT 1 FROM Config.CompanyDemoStep cds2 
        --        WHERE cds2.CompanyId = s2.CompanyId
        --    )
        --) s
        --LEFT JOIN Config.CompanyDemoStep cds ON s.CompanyId = cds.CompanyId
        --GROUP BY s.CompanyId
        --ORDER BY s.CompanyId;
        
        COMMIT TRANSACTION;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SET @Error = ERROR_MESSAGE();
        PRINT 'Error durante el proceso: ' + @Error;
        
        -- Re-lanzar el error
        THROW;
        
    END CATCH
    
END

-- Uso del stored procedure:
-- EXEC Config.CompanyDemoStep_Complete_Steps;
-- Uso del stored procedure:
-- EXEC Config.CompanyDemoStep_Complet_Steps;