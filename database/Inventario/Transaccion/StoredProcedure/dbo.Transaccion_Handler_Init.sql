USE Acontplus
GO
CREATE OR ALTER PROCEDURE dbo.Transaccion_Handler_Init
--@ProcedureName nvarchar(150) = ''
 @codTran AS VARCHAR(2)
,@codDoc AS VARCHAR(2)
,@documentoId INT
,@tipo INT = 1
AS

DECLARE @InitDlgHandle UNIQUEIDENTIFIER;
DECLARE @RequestMsg xml;
	BEGIN TRANSACTION;
		BEGIN DIALOG @InitDlgHandle
			 FROM SERVICE
			  [StockInitService]
			 TO SERVICE
			  N'StockService'
			 ON CONTRACT
			  [StockContract]
			 WITH
				 ENCRYPTION = OFF;
 
        --DECLARE @xmlParams XML 

        SET @RequestMsg = (SELECT @codTran codTran, @codDoc codDoc, @documentoId documentoId, @tipo tipo FOR XML PATH ('msg'));
 		 --SELECT @RequestMsg = @xmlParams;
         --print cast(@requestMsg  as varchar(max));

		 --SELECT @RequestMsg = @ProcedureName;
       
		--Send the Message
		SEND ON CONVERSATION @InitDlgHandle MESSAGE TYPE [StockRequestMessage](@RequestMsg);

		--Close conversation
		--END CONVERSATION @InitDlgHandle;

	COMMIT TRANSACTION;
GO 
    