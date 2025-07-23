--WARNING! ERRORS ENCOUNTERED DURING SQL PARSING!
USE Acontplus
GO
CREATE OR ALTER PROCEDURE Transaction_Handler
AS
DECLARE @RecvReqDlgHandle UNIQUEIDENTIFIER;
DECLARE @RecvReqMsg XML;
DECLARE @RecvReqMsgName SYSNAME;

--> Data Global
DECLARE @tipo INT = 1

--> Inventario
DECLARE @codTran VARCHAR(2) 
       ,@codDoc VARCHAR(2) 
       ,@documentoId INT 
       ,@idTipoTransaccion INT 
       ,@idTipoDocumento INT
       ,@idTransaccion INT

WHILE (1 = 1)
BEGIN
	BEGIN TRY
		BEGIN TRANSACTION;

		WAITFOR (
				RECEIVE TOP (1) @RecvReqDlgHandle = conversation_handle
				,@RecvReqMsg = message_body
				,@RecvReqMsgName = message_type_name FROM Stock_Queue
				)
			,TIMEOUT 5000;


		IF (@@ROWCOUNT = 0)
		    BEGIN
			    ROLLBACK TRANSACTION;
			    BREAK;
		    END

		--declare @targetpProcedure nvarchar(100);
		--set @targetpProcedure = CAST(@RecvReqMsg AS nvarchar(100))
		SELECT @codTran     = nref.value('(codTran)[1]','VARCHAR(5)')
			  ,@codDoc      = nref.value('(codDoc)[1]', 'VARCHAR(5)')
			  ,@documentoId = nref.value('(documentoId)[1]', 'INT')
			  ,@tipo        = nref.value('(tipo)[1]','INT')
		FROM @RecvReqMsg.nodes('/msg') AS R(nref);

		--IF LEN(@targetpProcedure) > 0
		--BEGIN
		--    --execute target procedure (no need to send the reply)
		--   --exec @targetpProcedure;
		--END
        PRINT @RecvReqMsgName
		IF (@RecvReqMsgName = 'StockRequestMessage')
		    BEGIN
			    SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = @codTran

			    SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = @codDoc
                
                SELECT TOP 1 @idTransaccion = idTransaccion FROM Inventario.Transaccion WITH (NOLOCK) WHERE idTipoDocumento = @idTipoDocumento ANd idTipoTransaccion = @idTipoTransaccion AND idDocumento = @documentoId
                
                --> Ajustes 
                IF @codTran = 'A'
                    BEGIN
                        
                       --> Ajuste para todas las trasacciones que fueron afectados en los ajustes
                       WITH CTE_AjusteActual AS (
                            SELECT tr.idTransaccion as idAjuste
                                  ,tr.fechaEmision
                                  ,td.idArticulo
                                  ,td.idBodega
                            FROM Inventario.Transaccion              tr WITH (NOLOCK)
                            INNER JOIN Inventario.TransaccionDetalle td WITH (NOLOCK) ON td.idTransaccion = tr.idTransaccion
                            WHERE tr.idTransaccion = @idTransaccion
                              AND td.estado        = 1
                        )
                        UPDATE dt SET dt.AjusteId = CASE WHEN td.codigo = 'CI' THEN tr.idTransaccion ELSE t.idAjuste END
                        FROM Inventario.TransaccionDetalle    dt 
                        INNER JOIN Inventario.Transaccion     tr WITH (NOLOCK) ON tr.idTransaccion     = dt.idTransaccion
                        INNER JOIN Inventario.TipoTransaccion tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
                        INNER JOIN Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
                        OUTER APPLY (
                                        SELECT TOP 1 aa.idAjuste
                                        FROM CTE_AjusteActual aa
                                        WHERE aa.idBodega      = dt.idBodega 
                                          AND aa.idArticulo    = dt.idArticulo
                                          AND aa.fechaEmision <= tr.fechaEmision
                                        ORDER BY aa.fechaEmision DESC

                                    ) t
                        WHERE tt.codigo != 'A'  
                          AND dt.estado = 1;    


                        --> Ultimo Movimiento de Ajuste para su calculo de stork
                        WITH CTE_UltimoAjuste AS 
                            (
                                SELECT dt.idArticulo
                                      ,dt.idBodega
                                      ,dt.cantidadTransaccion
                                      ,tr.idDocumento
                                      ,tr.fechaEmision
                                      ,ROW_NUMBER() OVER (PARTITION BY dt.idArticulo, dt.idBodega ORDER BY tr.fechaEmision DESC) as rn
                                FROM Inventario.Transaccion              tr WITH (NOLOCK)
                                INNER JOIN Inventario.TransaccionDetalle dt WITH (NOLOCK) ON dt.idTransaccion     = tr.idTransaccion
                                INNER JOIN Inventario.TipoDocumento      td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
                                INNER JOIN Inventario.TipoTransaccion    tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
                                WHERE dt.estado        = 1
                                  AND tt.codigo        = 'A'
                                  AND tr.idTransaccion = @idTransaccion
                            )
                        UPDATE st SET st.consolidacion      = ct.cantidadTransaccion
                                     ,st.ConsolidacionId    = ct.idDocumento
                                     ,st.fechaConsolidacion = ct.fechaEmision
                        FROM Inventario.Stock                    st WITH (ROWLOCK)
                        INNER JOIN Inventario.TransaccionDetalle td WITH (ROWLOCK) ON td.idArticulo    = st.idArticulo AND td.idBodega = st.idBodega
                        INNER JOIN Inventario.Transaccion        tr WITH (ROWLOCK) ON tr.idTransaccion = td.idTransaccion
                        INNER JOIN CTE_UltimoAjuste              ct WITH (NOLOCK)  ON ct.idArticulo    = st.idArticulo AND ct.idBodega = st.idBodega AND ct.rn = 1
                        WHERE tr.idTransaccion = @idTransaccion;
                    END 

                --> Actualizacion de stock por bodega
                IF @codDoc = 'TB'
                    BEGIN 
                        UPDATE st SET st.cantidad = Inventario.f_Stock(st.idArticulo,st.idBodega)
			            FROM Inventario.Stock                    st WITH (ROWLOCK)
			            INNER JOIN Inventario.TransaccionDetalle td WITH (ROWLOCK) ON td.idArticulo    = st.idArticulo 
                                                                                  AND td.idBodega      = st.idBodega
                        INNER JOIN Inventario.Transaccion        tr WITH (ROWLOCK) ON tr.idTransaccion = td.idTransaccion
			            WHERE tr.idTipoDocumento = @idTipoDocumento
				          AND tr.idDocumento     = @documentoId;
                    END 
                ELSE   
                    BEGIN
                        UPDATE st SET st.cantidad = Inventario.f_Stock(st.idArticulo,st.idBodega)
			            FROM Inventario.Stock                    st WITH (ROWLOCK)
			            INNER JOIN Inventario.TransaccionDetalle td WITH (ROWLOCK) ON td.idArticulo    = st.idArticulo 
                                                                                  AND td.idBodega      = st.idBodega
                        INNER JOIN Inventario.Transaccion        tr WITH (ROWLOCK) ON tr.idTransaccion = td.idTransaccion
			            WHERE tr.idTransaccion = @idTransaccion;
                    END ;
               
                --> Actualizar Stock y saldos
                WITH CTE_Saldos AS 
                (
                    SELECT idTransaccionDetalle
                          ,SUM(IIF(tt.codigo = 'S', -1, 1) * IIF(td.estado = 1, td.cantidadTransaccion, 0))
                           OVER (PARTITION BY idArticulo, idBodega, ISNULL(td.ajusteId, 0) 
                           ORDER BY ts.fechaEmision, idTransaccionDetalle ASC) as nuevoSaldo
                    FROM Inventario.Transaccion              ts WITH (NOLOCK)
                    INNER JOIN inventario.TipoTransaccion    tt WITH (NOLOCK) ON tt.idTipoTransaccion = ts.idTipoTransaccion
                    INNER JOIN Inventario.TransaccionDetalle td WITH (NOLOCK) ON td.idTransaccion     = ts.idTransaccion
                    WHERE ts.idTransaccion = @idTransaccion
                )

                UPDATE td SET td.saldo = sa.nuevoSaldo 
                FROM Inventario.TransaccionDetalle td WITH (NOLOCK)
                INNER JOIN CTE_Saldos              sa WITH (NOLOCK) ON sa.idTransaccionDetalle = td.idTransaccionDetalle;

                UPDATE ar
			        SET ar.stock = (SELECT SUM(s.cantidad) FROM Inventario.Stock s WITH (NOLOCK) WHERE s.idArticulo = ar.idArticulo)
			    FROM dbo.Articulo ar WITH (ROWLOCK)
			    WHERE ar.idArticulo IN (
					                        SELECT tr.idArticulo
					                        FROM Inventario.Transaccion              t  WITH (NOLOCK)
                                            INNER JOIN Inventario.TransaccionDetalle tr WITH (NOLOCK) ON tr.idTransaccion = t.idTransaccion
					                        WHERE t.idTransaccion = @idTransaccion
					                    )
		    END
        END CONVERSATION @RecvReqDlgHandle;
        COMMIT TRAN
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN;
		    END
		INSERT INTO ErroresSistema (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate)
		SELECT NEWID(),'/Transaccion/Insert/' + CAST(@RecvReqMsg AS VARCHAR(250)),ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE()
	END CATCH
END
GO