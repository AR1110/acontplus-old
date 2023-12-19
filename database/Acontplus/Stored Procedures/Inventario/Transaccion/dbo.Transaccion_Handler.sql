--WARNING! ERRORS ENCOUNTERED DURING SQL PARSING!
USE Acontplus
GO
CREATE OR ALTER PROCEDURE Transaction_Handler
AS
DECLARE @RecvReqDlgHandle UNIQUEIDENTIFIER;
DECLARE @RecvReqMsg XML;
DECLARE @RecvReqMsgName SYSNAME;
DECLARE @idTipoTransaccion INT
DECLARE @idTipoDocumento INT
DECLARE @codTran VARCHAR(2)
DECLARE @codDoc VARCHAR(2)
DECLARE @documentoId INT 
DECLARE @tipo INT = 1

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
		SELECT @codTran     = nref.value('(codTran)[1]', 'VARCHAR(5)')
			  ,@codDoc      = nref.value('(codDoc)[1]', 'VARCHAR(5)')
			  ,@documentoId = nref.value('(documentoId)[1]', 'INT')
			  ,@tipo        = nref.value('(tipo)[1]', 'INT')
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
			    UPDATE st SET st.cantidad = Inventario.f_Stock(st.idArticulo,st.idBodega)
			    FROM Inventario.Stock             st WITH (ROWLOCK)
			    INNER JOIN Inventario.Transaccion td WITH (ROWLOCK) ON td.idArticulo = st.idArticulo AND td.idBodega = st.idBodega
			    WHERE td.idTipoTransaccion = @idTipoTransaccion
				  AND td.idTipoDocumento   = @idTipoDocumento
				  AND td.idDocumento       = @documentoId

                --> Actualizar Stock General
                UPDATE ar
			        SET ar.stock = (
					                SELECT SUM(s.cantidad) FROM Inventario.Stock s WITH (NOLOCK) WHERE s.idArticulo = ar.idArticulo
					               )
			    FROM dbo.Articulo ar WITH (ROWLOCK)
			    WHERE ar.idArticulo IN (
					    SELECT t.idArticulo
					    FROM Inventario.Transaccion t
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