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
DECLARE @codTran VARCHAR(2) ,@codDoc VARCHAR(2) ,@documentoId INT ,@idTipoTransaccion INT ,@idTipoDocumento INT

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
                
                --> Actualizar Stock por Bodega 

                --> Ajuste ID unico
                IF @codTran = 'A'
                    BEGIN
                        UPDATE st 
                           SET st.consolidacion = (
                                                    SELECT TOP 1 dt.cantidadTransaccion    
                                                    FROM Inventario.Transaccion              tr WITH (NOLOCK)
                                                    INNER JOIN Inventario.TransaccionDetalle dt WITH (NOLOCK) ON dt.idTransaccion     = tr.idTransaccion
                                                    INNER JOIN Inventario.TipoDocumento      td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
                                                    INNER JOIN Inventario.TipoTransaccion    tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
                                                    WHERE dt.idArticulo = st.idArticulo
                                                      AND dt.idBodega   = st.idBodega
                                                      AND dt.estado     = 1
                                                      AND tt.codigo     = 'A'
                                                    ORDER BY tr.fechaEmision DESC
                                                  )
                              ,st.ConsolidacionId = (
                                                        SELECT TOP 1 tr.idDocumento    
                                                        FROM Inventario.Transaccion              tr WITH (NOLOCK)
                                                        INNER JOIN Inventario.TransaccionDetalle dt WITH (NOLOCK) ON dt.idTransaccion     = tr.idTransaccion
                                                        INNER JOIN Inventario.TipoDocumento      td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
                                                        INNER JOIN Inventario.TipoTransaccion    tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
                                                        WHERE dt.idArticulo = st.idArticulo
                                                          AND dt.idBodega   = st.idBodega
                                                          AND dt.estado     = 1
                                                          AND tt.codigo     = 'A'
                                                        ORDER BY tr.fechaEmision DESC
                                                     )
                              ,st.fechaConsolidacion = (
                                                            SELECT TOP 1 tr.fechaEmision    
                                                            FROM Inventario.Transaccion              tr WITH (NOLOCK)
                                                            INNER JOIN Inventario.TransaccionDetalle dt WITH (NOLOCK) ON dt.idTransaccion     = tr.idTransaccion
                                                            INNER JOIN Inventario.TipoDocumento      td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
                                                            INNER JOIN Inventario.TipoTransaccion    tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
                                                            WHERE dt.idArticulo = st.idArticulo
                                                              AND dt.idBodega   = st.idBodega
                                                              AND dt.estado     = 1
                                                              AND tt.codigo     = 'A'
                                                            ORDER BY tr.fechaEmision DESC
                                                       )
			            FROM Inventario.Stock                    st WITH (ROWLOCK)
			            INNER JOIN Inventario.TransaccionDetalle td WITH (ROWLOCK) ON td.idArticulo    = st.idArticulo AND 
                                                                                      td.idBodega      = st.idBodega
                        INNER JOIN Inventario.Transaccion        tr WITH (ROWLOCK) ON tr.idTransaccion = td.idTransaccion
			            WHERE tr.idTipoTransaccion = @idTipoTransaccion
				          AND tr.idTipoDocumento   = @idTipoDocumento
				          AND tr.idDocumento       = @documentoId
                    END 

                IF @codDoc = 'TB'
                    BEGIN 
                        UPDATE st SET st.cantidad = Inventario.f_Stock(st.idArticulo,st.idBodega)
			            FROM Inventario.Stock                    st WITH (ROWLOCK)
			            INNER JOIN Inventario.TransaccionDetalle td WITH (ROWLOCK) ON td.idArticulo    = st.idArticulo 
                                                                                  AND td.idBodega      = st.idBodega
                        INNER JOIN Inventario.Transaccion        tr WITH (ROWLOCK) ON tr.idTransaccion = td.idTransaccion
			            WHERE tr.idTipoDocumento = @idTipoDocumento
				          AND tr.idDocumento     = @documentoId
                    END 
                ELSE   
                    BEGIN
                        UPDATE st SET st.cantidad = Inventario.f_Stock(st.idArticulo,st.idBodega)
			            FROM Inventario.Stock                    st WITH (ROWLOCK)
			            INNER JOIN Inventario.TransaccionDetalle td WITH (ROWLOCK) ON td.idArticulo    = st.idArticulo 
                                                                                  AND td.idBodega      = st.idBodega
                        INNER JOIN Inventario.Transaccion        tr WITH (ROWLOCK) ON tr.idTransaccion = td.idTransaccion
			            WHERE tr.idTipoTransaccion = @idTipoTransaccion
				          AND tr.idTipoDocumento   = @idTipoDocumento
				          AND tr.idDocumento       = @documentoId
                    END 
               
                --> Actualizar Stock General
                UPDATE ar
			        SET ar.stock = (
					                SELECT SUM(s.cantidad) FROM Inventario.Stock s WITH (NOLOCK) WHERE s.idArticulo = ar.idArticulo
					               )
			    FROM dbo.Articulo ar WITH (ROWLOCK)
			    WHERE ar.idArticulo IN (
					    SELECT tr.idArticulo
					    FROM Inventario.Transaccion              t  WITH (NOLOCK)
                        INNER JOIN Inventario.TransaccionDetalle tr WITH (NOLOCK) ON tr.idTransaccion = t.idTransaccion
					    WHERE t.idTipoTransaccion = @idTipoTransaccion
						  AND t.idTipoDocumento   = @idTipoDocumento
						  AND t.idDocumento       = @documentoId
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