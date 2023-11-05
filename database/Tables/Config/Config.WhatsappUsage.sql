USE AcontPlus
GO
--drop table Config.WhatsappUsage
CREATE TABLE Config.WhatsappUsage(
idWhatsappUsage INT NOT NULL CONSTRAINT pk_whatsapp_usage PRIMARY KEY IDENTITY (1,1)
,ruc VARCHAR(25) NOT NULL
,fechaInicio DATETIME NOT NULL
,fechaFin DATETIME NULL
,ilimitado BIT NOT NULL DEFAULT 0
,used INT NULL
,limite INT NOT NULL
,estado BIT NOT NULL DEFAULT 1
,idUsuario INT NULL
)