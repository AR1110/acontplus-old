--WARNING! ERRORS ENCOUNTERED DURING SQL PARSING!
USE Acontplus
GO

CREATE OR ALTER PROCEDURE Transaction_Handler
AS
SET NOCOUNT ON;
SET XACT_ABORT ON;

DECLARE @RecvReqDlgHandle UNIQUEIDENTIFIER;
DECLARE @RecvReqMsg XML;
DECLARE @RecvReqMsgName SYSNAME;

-- Declare variables with SQL Server 2022+ optimal data types
DECLARE @codDoc VARCHAR(2)
DECLARE @idTransaccion INT;
DECLARE @fechaTransaccion DATETIME2(7);
DECLARE @idArticulo INT, @idBodega INT, @cantidadTransaccion NUMERIC(18,5);
DECLARE @idTransaccionDetalle INT
DECLARE @saldoAnterior NUMERIC(18,5);
DECLARE @ErrorMessage NVARCHAR(4000);
DECLARE @StartTime DATETIME2(7) = SYSDATETIME();


-- Service Broker message processing loop
WHILE (1 = 1)
BEGIN
    BEGIN TRY
        -- Optimized WAITFOR with better timeout management
        WAITFOR (
            RECEIVE TOP (1) 
                @RecvReqDlgHandle = conversation_handle
               ,@RecvReqMsg       = message_body
               ,@RecvReqMsgName   = message_type_name 
            FROM Stock_Queue
        ), TIMEOUT 500;

        IF (@@ROWCOUNT = 0)
            BEGIN
                BREAK;
            END;

        -- Optimized XML parsing
        WITH XMLParsing AS (
            SELECT nref.value('(id)[1]','INT') as id
            FROM @RecvReqMsg.nodes('/msg') as R(nref)
        )
        SELECT @idTransaccion = id FROM XMLParsing;

        IF (@RecvReqMsgName = 'StockRequestMessage')
            BEGIN
            --> Begin transaction with proper isolation
            BEGIN TRANSACTION;

            -- Optimized table variable for batch processing
            DECLARE @ArticuloBodegaBatch TABLE (
                RowNum INT IDENTITY(1,1) PRIMARY KEY
               ,idTransaccionDetalle INT NOT NULL
               ,idArticulo INT NOT NULL
               ,idBodega INT NOT NULL
               ,cantidadTransaccion NUMERIC(18,5) NOT NULL
               ,INDEX IX_ArticuloBodega_Lookup NONCLUSTERED (idArticulo, idBodega)
            );
            
            --> SQL Server 2022+ optimized transaction lookup
            SELECT TOP 1 @fechaTransaccion = tr.fechaRegistro
                        ,@codDoc           = td.codigo
            FROM Inventario.Transaccion         tr WITH (INDEX(IX_Transaccion_enterprise_lookup))
            INNER JOIN Inventario.TipoDocumento td ON td.idTipoDocumento = tr.idTipoDocumento
            WHERE idTransaccion = @idTransaccion


            INSERT INTO @ArticuloBodegaBatch
                  (idTransaccionDetalle,idArticulo,idBodega,cantidadTransaccion)
            SELECT idTransaccionDetalle,idArticulo,idBodega,cantidadTransaccion
            FROM Inventario.TransaccionDetalle WITH (INDEX(IX_TransaccionDetalle_enterprise_perf))
            WHERE idTransaccion = @idTransaccion
              AND estado  = 1
              AND processed = 0
                

            --> Process each article/warehouse combination with set-based operations
            DECLARE @MaxRows INT, @CurrentRow INT = 1;
            SELECT @MaxRows = MAX(RowNum) FROM @ArticuloBodegaBatch;

            WHILE @CurrentRow <= @MaxRows
                BEGIN
                    SELECT @idTransaccionDetalle = idTransaccionDetalle  ,@idArticulo = idArticulo ,@idBodega = idBodega ,@cantidadTransaccion = cantidadTransaccion FROM @ArticuloBodegaBatch WHERE RowNum = @CurrentRow;

                    --> Adjustment transactions
                    IF @codDoc = 'CI' 
                        BEGIN
                            --> Get latest adjustment transaction detail
                            SELECT TOP 1 @idTransaccionDetalle = td.idTransaccionDetalle
                            FROM Inventario.Transaccion              tr WITH (READCOMMITTED)
                            INNER JOIN Inventario.TransaccionDetalle td WITH (READCOMMITTED) ON td.idTransaccion     = tr.idTransaccion
                            INNER JOIN Inventario.TipoTransaccion    tt WITH (READCOMMITTED) ON tt.idTipoTransaccion = td.idTipoTransaccion
                            WHERE td.idArticulo = @idArticulo 
                              AND td.idBodega = @idBodega
                              AND tt.codigo = 'A'
                              AND td.estado = 1
                            ORDER BY tr.fechaRegistro DESC;

                            --> Update affected transactions with proper window function
                            WITH CTE_TransaccionAfectadas AS
                            (
                                SELECT td.idTransaccionDetalle
                                      ,@cantidadTransaccion + SUM(cantidadTransaccion) OVER (ORDER BY tr.fechaEmision ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as saldo
                                FROM Inventario.Transaccion              tr WITH (READCOMMITTED)
                                INNER JOIN Inventario.TransaccionDetalle td WITH (READCOMMITTED) ON td.idTransaccion     = tr.idTransaccion
                                INNER JOIN Inventario.TipoTransaccion    tt WITH (READCOMMITTED) ON tt.idTipoTransaccion = td.idTipoTransaccion
                                WHERE td.idArticulo = @idArticulo 
                                  AND td.idBodega = @idBodega
                                  AND td.estado = 1
                                  AND tt.codigo != 'A'  
                                  AND tr.fechaRegistro >= @fechaTransaccion
                                  AND td.AjusteId IS NULL
                            )
                            UPDATE td SET saldo    = af.saldo
                                         ,AjusteId = @idTransaccion
                            FROM Inventario.TransaccionDetalle  td WITH (ROWLOCK)
                            INNER JOIN CTE_TransaccionAfectadas af ON af.idTransaccionDetalle = td.idTransaccionDetalle;

                            -- Update stock reference
                            UPDATE Inventario.Stock WITH (ROWLOCK) SET idTransaccionDetalle = @idTransaccionDetalle WHERE idArticulo = @idArticulo AND idBodega = @idBodega;

                            UPDATE Inventario.TransaccionDetalle WITH (ROWLOCK) SET saldo = @cantidadTransaccion WHERE idTransaccionDetalle = @idTransaccionDetalle AND estado = 1

                            --> Calculate and update final stock
                            UPDATE Inventario.Stock WITH (ROWLOCK) SET cantidad = Inventario.f_Stock(@idArticulo, @idBodega) WHERE idBodega = @idBodega AND idArticulo = @idArticulo;

                        END
                    --> Regular transactions
                    ELSE 
                        BEGIN
                            --> Calculate and update final stock
                            UPDATE Inventario.Stock WITH (ROWLOCK) SET cantidad = cantidad + @cantidadTransaccion WHERE idBodega = @idBodega AND idArticulo = @idArticulo;

                            --> Get current stock and update transaction detail in one operation
                            SELECT @saldoAnterior = cantidad FROM Inventario.Stock WITH (READCOMMITTED) WHERE idBodega = @idBodega AND idArticulo = @idArticulo;

                            UPDATE Inventario.TransaccionDetalle WITH (ROWLOCK) SET saldo = @saldoAnterior WHERE idTransaccionDetalle = @idTransaccionDetalle AND estado = 1
                        END

                    -- Update article total stock
                    UPDATE ar WITH (ROWLOCK)
                    SET stock = (
                        SELECT ISNULL(SUM(s.cantidad), 0) 
                        FROM Inventario.Stock s WITH (READCOMMITTED) 
                        WHERE s.idArticulo = ar.idArticulo
                    )
                    FROM dbo.Articulo ar
                    WHERE ar.idArticulo = @idArticulo;

                    SET @CurrentRow = @CurrentRow + 1;

                    UPDATE Inventario.TransaccionDetalle SET processed = 1 WHERE idTransaccionDetalle =  @idTransaccionDetalle
            END

            END CONVERSATION @RecvReqDlgHandle;
            COMMIT TRANSACTION;
        END
        ELSE
            BEGIN
                END CONVERSATION @RecvReqDlgHandle;
            END

    END TRY

    BEGIN CATCH
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION;
        END

        SET @ErrorMessage = ERROR_MESSAGE();
        
        -- SQL Server 2022+ enhanced error logging with JSON
        DECLARE @ErrorDetails NVARCHAR(MAX);
        SET @ErrorDetails = CONCAT(
            '{"procedure":"', ISNULL(ERROR_PROCEDURE(), 'Transaction_Handler'), '",',
            '"line":', ERROR_LINE(), ',',
            '"severity":', ERROR_SEVERITY(), ',',
            '"state":', ERROR_STATE(), ',',
            '"number":', ERROR_NUMBER(), ',',
            '"message":"', REPLACE(@ErrorMessage, '"', '\"'), '",',
            '"execution_time_ms":', DATEDIFF(MILLISECOND, @StartTime, SYSDATETIME()), ',',
            '"msg_content":"', ISNULL(CAST(@RecvReqMsg AS NVARCHAR(250)), 'NULL'), '"}'
        );

        INSERT INTO ErroresSistema WITH (ROWLOCK)
            (token, method, errorNumber, errorSeverity, errorState, 
             errorProcedure, errorLine, errorMessage, errorDate, errorDetails)
        VALUES (
            NEWID(),
            '/Transaccion/ServiceBroker/Transaction_Handler',
            ERROR_NUMBER(),
            ERROR_SEVERITY(),
            ERROR_STATE(),
            ISNULL(ERROR_PROCEDURE(), 'Transaction_Handler'),
            ERROR_LINE(),
            @ErrorMessage,
            SYSDATETIME(),
            @ErrorDetails
        );

        -- Proper conversation cleanup with detailed error
        IF @RecvReqDlgHandle IS NOT NULL
        BEGIN
            END CONVERSATION @RecvReqDlgHandle 
            WITH ERROR = 500 
            DESCRIPTION = @ErrorMessage;
        END
    END CATCH
END
GO
