use [Acontplus]
go 
-- Find an existing index named U_I_WhatasappUsage_Ruc 
-- on the Config.WhatsappUsage table and delete it if found. 
IF EXISTS (SELECT name from sys.indexes  
           WHERE name = N'U_I_Familia_Siglas'
           AND object_id = OBJECT_ID(N'dbo.Familia', N'U'))   
   DROP INDEX U_I_Familia_Siglas ON dbo.Familia;   
GO  

CREATE UNIQUE INDEX U_I_Familia_Siglas  
   ON dbo.Familia(siglas);  
GO