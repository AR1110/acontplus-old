USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2025-05-22
-- Description:	SP FOR DELETE DOC ELECT ERRORS
-- =============================================
CREATE OR ALTER PROCEDURE [FactElect].[Doc_Elect_Error_Delete]
    @BatchSize INT = 1000,
    @MaxBatches INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @DeletedCount INT = 0;
    DECLARE @TotalDeleted INT = 0;
    DECLARE @BatchCount INT = 0;
    DECLARE @OldErrorsDeleted INT = 0;
    
    BEGIN TRY
        -- First: Delete old error records, keeping only the latest error per document
        DELETE TOP (@BatchSize) dee
        FROM dbo.DocumentoElectronicoError dee
        WHERE dee.idDocumentoElectronicoError NOT IN (
            SELECT MAX(dee2.idDocumentoElectronicoError)
            FROM dbo.DocumentoElectronicoError dee2
            GROUP BY dee2.idDocumentoElectronico
        );
        
        SET @OldErrorsDeleted = @@ROWCOUNT;
        
        -- Second: Delete processed error records in batches
        WHILE (@BatchCount < @MaxBatches)
        BEGIN
            -- Delete records in batches to avoid locking issues
            DELETE TOP (@BatchSize) dee
            FROM dbo.DocumentoElectronicoError dee WITH(NOLOCK)
            INNER JOIN dbo.DocumentoElectronico de WITH(NOLOCK) 
                ON dee.idDocumentoElectronico = de.idDocumentoElectronico
            INNER JOIN FactElect.EstadoServicio es WITH(NOLOCK) 
                ON de.idEstadoServicio = es.idEstadoServicio
            WHERE es.codigo IN (4, 6);
            
            SET @DeletedCount = @@ROWCOUNT;
            SET @TotalDeleted = @TotalDeleted + @DeletedCount;
            SET @BatchCount = @BatchCount + 1;
            
            -- Exit loop if no more records to delete
            IF @DeletedCount = 0
                BREAK;
            
            -- Small delay to prevent blocking other operations
            IF @BatchCount < @MaxBatches
                WAITFOR DELAY '00:00:00.500'; -- 500ms delay
        END
        
        -- Log the total number of deleted records
        PRINT 'Old error records deleted: ' + CAST(@OldErrorsDeleted AS VARCHAR(10));
        PRINT 'Processed error records deleted: ' + CAST(@TotalDeleted AS VARCHAR(10)) + ' in ' + CAST(@BatchCount AS VARCHAR(10)) + ' batches';
        PRINT 'Total records deleted: ' + CAST(@OldErrorsDeleted + @TotalDeleted AS VARCHAR(10));
        
    END TRY
    BEGIN CATCH
        -- Log error information
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        PRINT 'Error occurred during deletion process: ' + @ErrorMessage;
        
        -- Re-throw the error
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END