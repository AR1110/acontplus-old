use AcontPlus 
go 
GO  
-- Find an existing index named U_I_WhatasappUsage_Ruc 
-- on the Config.WhatsappUsage table and delete it if found. 
IF EXISTS (SELECT name from sys.indexes  
           WHERE name = N'U_I_WhatasappUsage_Ruc'
           AND object_id = OBJECT_ID(N'Config.WhatsappUsage', N'U'))   
   DROP INDEX U_I_WhatasappUsage_Ruc ON Config.WhatsappUsage;   
GO  
-- Create a unique index called U_I_WhatasappUsage_Ruc  
-- on the Config.WhatsappUsage table using the ruc column.  
CREATE UNIQUE INDEX U_I_WhatasappUsage_Ruc   
   ON Config.WhatsappUsage(ruc);  
GO

--select * from Config.WhatsappUsage where ruc = '2293530915001'
--delete from Config.WhatsappUsage where idWhatsappUsage = 178