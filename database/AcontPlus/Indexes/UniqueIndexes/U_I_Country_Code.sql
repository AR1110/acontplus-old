use AcontPlus 
go 
GO  
-- Find an existing index named U_I_WhatasappUsage_Ruc 
-- on the Config.WhatsappUsage table and delete it if found. 
IF EXISTS (SELECT name from sys.indexes  
           WHERE name = N'U_I_Country_Code'
           AND object_id = OBJECT_ID(N'Common.Country', N'U'))   
   DROP INDEX U_I_Country_Code ON Common.Country;   
GO  

CREATE UNIQUE INDEX U_I_Country_Code   
   ON Common.Country(Code);  
GO