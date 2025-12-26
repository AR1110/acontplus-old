USE Acontplus
GO

DECLARE @claveAcceso VARCHAR(49) = '2110202507219173125800120010010000071201234567816',
        @IdDocumento INT,
        @SerieComprobante VARCHAR(25),
        @IdCuentaPorCobrar INT,
        @IdCobro INT,
        @RowsAffected INT = 0;

-- Verificar que el documento existe
SELECT @IdDocumento = idDocumento, 
       @SerieComprobante = serieComprobante 
FROM Recepcion.DocumentoRecibido 
WHERE claveAcceso = @claveAcceso;

IF @IdDocumento IS NULL
BEGIN
    SELECT 'ERROR: Documento no encontrado con la clave de acceso proporcionada' AS Result;
    RETURN;
END

-- Obtener cuenta por cobrar
SELECT @IdCuentaPorCobrar = idCuentaPorCobrar 
FROM dbo.v_CuentaPorCobrar 
WHERE serieComprobante = @SerieComprobante 
  AND idDocumento = @IdDocumento;

-- Obtener cobro
SET @IdCobro = (SELECT idCobro 
                FROM dbo.Cobro 
                WHERE idCuentaPorCobrar = @IdCuentaPorCobrar);

BEGIN TRY
    BEGIN TRAN
    
    -- Eliminar en orden inverso a las relaciones de FK
    IF @IdCobro IS NOT NULL
    BEGIN
        DELETE FROM dbo.CobroDetalle WHERE idCobro = @IdCobro;
        SET @RowsAffected = @RowsAffected + @@ROWCOUNT;
        
        DELETE FROM Contabilidad.Historial_Cobro WHERE idCobro = @IdCobro;
        SET @RowsAffected = @RowsAffected + @@ROWCOUNT;
        
        DELETE FROM dbo.Cobro WHERE idCobro = @IdCobro;
        SET @RowsAffected = @RowsAffected + @@ROWCOUNT;
    END
    
    IF @IdCuentaPorCobrar IS NOT NULL
    BEGIN
        DELETE FROM Contabilidad.CuentaPorCobrar WHERE idCuentaPorCobrar = @IdCuentaPorCobrar;
        SET @RowsAffected = @RowsAffected + @@ROWCOUNT;
    END
    
    -- Eliminar relaciones del documento
    DELETE FROM FactElect.DocRelacionado WHERE idDocumentoRecibido = @IdDocumento;
    SET @RowsAffected = @RowsAffected + @@ROWCOUNT;
    
    DELETE FROM Recepcion.DocumentoImpuesto WHERE DocumentoRecibidoId = @IdDocumento;
    SET @RowsAffected = @RowsAffected + @@ROWCOUNT;
    
    DELETE FROM Recepcion.DocumentoDetalle WHERE idDocumento = @IdDocumento;
    SET @RowsAffected = @RowsAffected + @@ROWCOUNT;
    
    -- **ESTO FALTABA**: Eliminar el documento principal
    DELETE FROM Recepcion.DocumentoRecibido WHERE idDocumento = @IdDocumento;
    SET @RowsAffected = @RowsAffected + @@ROWCOUNT;
    
    COMMIT TRAN;
    
    SELECT 'SUCCESS' AS Result,
           @RowsAffected AS TotalRowsDeleted,
           @IdDocumento AS DocumentoId,
           @IdCobro AS CobroId,
           @claveAcceso AS ClaveAcceso;
           
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRAN;
    
    SELECT 'ERROR' AS Result,
           ERROR_NUMBER() AS ErrorNumber,
           ERROR_MESSAGE() AS ErrorMessage,
           ERROR_LINE() AS ErrorLine,
           ERROR_PROCEDURE() AS ErrorProcedure;
END CATCH
