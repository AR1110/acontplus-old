USE Acontplus
GO

CREATE OR ALTER PROCEDURE Transaction_Handler
AS
SET NOCOUNT ON;
SET XACT_ABORT ON;
SET NOCOUNT ON;
SET LANGUAGE SPANISH;

DECLARE @RecvReqDlgHandle UNIQUEIDENTIFIER;
DECLARE @RecvReqMsg XML;
DECLARE @RecvReqMsgName SYSNAME;

-- Declare variables with SQL Server 2022+ optimal data types
DECLARE @codDoc VARCHAR(2)
DECLARE @idTransaccion INT;
DECLARE @fechaTransaccion DATETIME2(7);
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

        --> Optimized XML parsing
        WITH XMLParsing AS (SELECT nref.value('(id)[1]','INT') as id FROM @RecvReqMsg.nodes('/msg') as R(nref))

        SELECT @idTransaccion = id FROM XMLParsing;

        IF (@RecvReqMsgName = 'StockRequestMessage')
            BEGIN
                --> Begin transaction with proper isolation
                BEGIN TRANSACTION;
            
                    --> SQL Server 2022+ optimized transaction lookup
                    SELECT TOP 1 @fechaTransaccion = tr.fechaEmision
                                ,@codDoc           = td.codigo
                    FROM Inventario.Transaccion         tr WITH (INDEX(IX_Transaccion_enterprise_lookup))
                    INNER JOIN Inventario.TipoDocumento td ON td.idTipoDocumento = tr.idTipoDocumento
                    WHERE idTransaccion = @idTransaccion

                    --> Adjustment transactions
                    IF @codDoc = 'CI' 
                        BEGIN
                            --> Paso 1: Obtener los últimos ajustes consolidados para cada artículo/bodega
                            WITH TransaccionActual AS
                            (
                                SELECT DISTINCT idArticulo, idBodega
                                FROM Inventario.TransaccionDetalle WITH (READCOMMITTED)
                                WHERE idTransaccion = @idTransaccion
                                  AND estado <> 0
                            ),
                            UltimosAjustes AS
                            (
                                SELECT td.idArticulo
                                      ,td.idBodega
                                      ,td.idTransaccionDetalle
                                      ,ROW_NUMBER() OVER (PARTITION BY td.idArticulo, td.idBodega ORDER BY tr.fechaEmision DESC) as rn
                                FROM TransaccionActual                   ta
                                INNER JOIN Inventario.TransaccionDetalle td WITH (READCOMMITTED) ON td.idArticulo = ta.idArticulo 
                                                                                                AND td.idBodega = ta.idBodega
                                                                                                AND td.estado = 1
                                INNER JOIN Inventario.Transaccion        tr WITH (READCOMMITTED) ON tr.idTransaccion     = td.idTransaccion
                                INNER JOIN Inventario.TipoTransaccion    tt WITH (READCOMMITTED) ON tt.idTipoTransaccion = tr.idTipoTransaccion
                                WHERE tt.codigo = 'A' 
                            )
                            UPDATE st SET  idTransaccionDetalle = ua.idTransaccionDetalle
                            FROM Inventario.Stock     st WITH (ROWLOCK)
                            INNER JOIN UltimosAjustes ua ON ua.idArticulo = st.idArticulo AND ua.idBodega = st.idBodega AND ua.rn = 1;

                            --> Paso 2: Calcular saldos acumulados para transacciones afectadas
                            WITH TransaccionesAfectadas AS
                            (
                                 SELECT td.idTransaccionDetalle
                                       ,td.idArticulo
                                       ,td.idBodega
                                       ,ta.cantidadTransaccion + 
                                        SUM(td.cantidadTransaccion) OVER (
                                            PARTITION BY td.idArticulo, td.idBodega 
                                            ORDER BY tr.fechaEmision ASC 
                                            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                                        ) as nuevoSaldo
                                    FROM Inventario.TransaccionDetalle       td WITH (READCOMMITTED)
                                    INNER JOIN Inventario.Transaccion        tr WITH (READCOMMITTED) ON tr.idTransaccion = td.idTransaccion
                                    INNER JOIN Inventario.TipoTransaccion    tt WITH (READCOMMITTED) ON tt.idTipoTransaccion = tr.idTipoTransaccion
                                    INNER JOIN Inventario.TransaccionDetalle ta WITH (READCOMMITTED) --> Transaccion Actual
                                        ON  ta.idTransaccion = @idTransaccion
                                        AND ta.idArticulo    = td.idArticulo
                                        AND ta.idBodega      = td.idBodega
                                    WHERE td.estado = 1
                                      AND tt.codigo != 'A'
                                      AND tr.fechaRegistro >= @fechaTransaccion
                                      AND td.AjusteId IS NULL
                            )
                            --> Actualizar todas las transacciones afectadas en UNA sola operación
                            UPDATE td SET saldo    = af.nuevoSaldo
                                         ,AjusteId = @idTransaccion
                            FROM Inventario.TransaccionDetalle td WITH (ROWLOCK)
                            INNER JOIN TransaccionesAfectadas  af ON af.idTransaccionDetalle = td.idTransaccionDetalle;

                            --> Actualazacion de saldo y ajuste
                            UPDATE Inventario.TransaccionDetalle SET saldo = cantidadTransaccion ,AjusteId = @idTransaccion WHERE idTransaccion = @idTransaccion AND estado <> 0;

                            WITH TransaccionActualStock AS
                            (
                                SELECT DISTINCT idArticulo, idBodega
                                FROM Inventario.TransaccionDetalle WITH (READCOMMITTED)
                                WHERE idTransaccion = @idTransaccion
                                  AND estado <> 0
                           ),
                           StockBase AS
                           (
                                -- Obtener la transacción base (último ajuste) de cada Stock
                                SELECT st.idArticulo
                                      ,st.idBodega
                                      ,td.cantidadTransaccion as cantidadBase
                                      ,tr.fechaRegistro       as fechaBase
                                FROM TransaccionActualStock              ta
                                INNER JOIN Inventario.Stock              st WITH (READCOMMITTED) ON st.idArticulo = ta.idArticulo 
                                                                                                AND st.idBodega = ta.idBodega
                                                                                                AND st.estado = 1
                                INNER JOIN Inventario.TransaccionDetalle td WITH (READCOMMITTED) ON td.idTransaccionDetalle = st.idTransaccionDetalle
                                INNER JOIN Inventario.Transaccion        tr WITH (READCOMMITTED) ON tr.idTransaccion        = td.idTransaccion
                            ),
                            MovimientosPosteriores AS
                            (
                                -- Obtener la suma de movimientos E/S después del ajuste base
                                SELECT sb.idArticulo
                                      ,sb.idBodega
                                      ,ISNULL(SUM(td.cantidadTransaccion), 0) as sumaMovimientos
                                FROM StockBase                           sb
                                INNER JOIN Inventario.TransaccionDetalle td WITH (READCOMMITTED) ON td.idArticulo = sb.idArticulo
                                                                                                AND td.idBodega = sb.idBodega
                                                                                                AND td.estado = 1

                                INNER JOIN Inventario.Transaccion        tr WITH (READCOMMITTED) ON tr.idTransaccion = td.idTransaccion
                                                                                                AND tr.fechaRegistro >= sb.fechaBase  -- Solo movimientos posteriores

                                INNER JOIN Inventario.TipoTransaccion tt WITH (READCOMMITTED)    ON tt.idTipoTransaccion = tr.idTipoTransaccion
                                                                                                AND tt.codigo IN ('E','S')  -- Solo Entradas y Salidas
                                GROUP BY sb.idArticulo, sb.idBodega
                            ),
                            StockFinal AS (
                                -- Calcular el stock final: base + movimientos posteriores
                                SELECT sb.idArticulo
                                      ,sb.idBodega
                                      ,sb.cantidadBase + ISNULL(mp.sumaMovimientos, 0) as cantidadFinal
                                FROM StockBase                   sb
                                LEFT JOIN MovimientosPosteriores mp ON mp.idArticulo = sb.idArticulo AND mp.idBodega = sb.idBodega
                            )
                            UPDATE st SET cantidad = sf.cantidadFinal
                            FROM Inventario.Stock st 
                            INNER JOIN StockFinal sf ON sf.idArticulo = st.idArticulo AND sf.idBodega = st.idBodega;
                            
                        END
                    --> Regular transactions
                    ELSE 
                        BEGIN
                            --> Calculate and update final stock
                            UPDATE st SET cantidad = st.cantidad + ag.cantidadTotal
                            FROM Inventario.Stock st WITH (ROWLOCK)
                            INNER JOIN
                            (
                                SELECT idArticulo
                                      ,idBodega
                                      ,SUM(cantidadTransaccion) as cantidadTotal
                                FROM Inventario.TransaccionDetalle
                                WHERE idTransaccion = @idTransaccion
                                  AND estado <> 0
                                GROUP BY idArticulo, idBodega

                            ) ag ON ag.idArticulo = st.idArticulo AND ag.idBodega = st.idBodega;
                            

                            WITH SaldosActuales AS
                            (
                                SELECT td.idTransaccionDetalle
                                      ,st.cantidad      as saldoActual
                                      ,tr.idTransaccion as ajusteId
                                FROM Inventario.TransaccionDetalle       td
                                INNER JOIN Inventario.Stock              st WITH (READCOMMITTED) ON st.idBodega = td.idBodega AND st.idArticulo = td.idArticulo
                                 LEFT JOIN Inventario.TransaccionDetalle tr WITH (READCOMMITTED) ON tr.idTransaccionDetalle = st.idTransaccionDetalle
                                WHERE td.idTransaccion = @idTransaccion
                                  AND td.estado <> 0
                            )
                            UPDATE td SET saldo    = sa.saldoActual
                                         ,ajusteId = sa.ajusteId
                            FROM Inventario.TransaccionDetalle td
                            INNER JOIN SaldosActuales          sa ON sa.idTransaccionDetalle = td.idTransaccionDetalle;
                        END;

                    -- Update article total stock
                    WITH StockTotales AS
                    (
                        SELECT st.idArticulo
                              ,ISNULL(SUM(st.cantidad), 0) as stockTotal
                        FROM Inventario.Stock st WITH (READCOMMITTED)
                        WHERE EXISTS
                        (
                            SELECT 1 FROM Inventario.TransaccionDetalle td 
                            WHERE td.idTransaccion = @idTransaccion 
                              AND td.idArticulo = st.idArticulo
                              AND td.estado <> 0
                        )
                        GROUP BY st.idArticulo
                    )
                    UPDATE ar SET stock = st.stockTotal
                    FROM dbo.Articulo       ar 
                    INNER JOIN StockTotales st ON st.idArticulo = ar.idArticulo;

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
