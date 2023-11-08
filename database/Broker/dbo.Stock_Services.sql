use master
go
DECLARE @is_broker_enabled BIT = 0
SELECT @is_broker_enabled = is_broker_enabled
FROM sys.databases
WHERE name = 'Acontplus'
 
IF (@is_broker_enabled = 1)
    BEGIN
        ALTER DATABASE Acontplus SET NEW_BROKER  WITH ROLLBACK IMMEDIATE;
 
        ALTER DATABASE Acontplus SET ENABLE_BROKER WITH ROLLBACK IMMEDIATE;
END
GO
USE Acontplus
GO
IF EXISTS (SELECT * FROM sys.services WHERE name = N'StockService')
BEGIN
     DROP SERVICE
     [StockService];
END

IF EXISTS (SELECT * FROM sys.services WHERE name = N'StockInitService')
BEGIN
     DROP SERVICE
     [StockInitService];
END
        
IF EXISTS (SELECT * FROM sys.service_queues WHERE name = N'Stock_Queue')
BEGIN
     DROP QUEUE Stock_Queue;
END     
     
IF EXISTS (SELECT * FROM sys.service_contracts WHERE name = N'StockContract')
BEGIN
     DROP CONTRACT
     [StockContract];
END

IF EXISTS (SELECT * FROM sys.service_message_types WHERE name = N'StockRequestMessage')
BEGIN
     DROP MESSAGE TYPE
     [StockRequestMessage];
END

IF EXISTS (SELECT * FROM sys.service_message_types WHERE name = N'StockReplyMessage')
BEGIN        
     DROP MESSAGE TYPE
     [StockReplyMessage];
END

CREATE MESSAGE TYPE [StockRequestMessage] VALIDATION=WELL_FORMED_XML; 
CREATE MESSAGE TYPE [StockReplyMessage] VALIDATION=WELL_FORMED_XML;

CREATE CONTRACT [StockContract]
(
 [StockRequestMessage]
 SENT BY INITIATOR 
  ,[StockReplyMessage]
 SENT BY TARGET 
);  

CREATE QUEUE Stock_Queue
 WITH STATUS=ON,
 ACTIVATION (
  PROCEDURE_NAME = Acontplus.dbo.Transaction_Handler,
  MAX_QUEUE_READERS = 10,
  EXECUTE AS 'dbo');

CREATE SERVICE [StockService] ON QUEUE Stock_Queue([StockContract]);
CREATE SERVICE [StockInitService] ON QUEUE Stock_Queue([StockContract]);

go