USE Acontplus
GO
CREATE OR ALTER PROCEDURE dbo.Transaccion_Handler_Init @id INT
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

        SET @RequestMsg = (SELECT @id as id FOR XML PATH ('msg'));
 		 --SELECT @RequestMsg = @xmlParams;
         --print cast(@requestMsg  as varchar(max));
       
		--Send the Message
		SEND ON CONVERSATION @InitDlgHandle MESSAGE TYPE [StockRequestMessage](@RequestMsg);

		--Close conversation
		--END CONVERSATION @InitDlgHandle;

	COMMIT TRANSACTION;
GO 
