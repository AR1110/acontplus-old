USE AcontPlus
GO
CREATE TABLE Config.WhatsAppSession(
	idSession INT NOT NULL CONSTRAINT whatsaap_session_pk PRIMARY KEY IDENTITY(1,1)
	,idUsuarioRol INT NOT NULL
	,browser VARCHAR(300) NOT NULL
	,os VARCHAR(300) NOT NULL
	,fechaInicio DATETIME NOT NULL DEFAULT GETDATE()
	,fechaFin DATETIME NULL
	,estado BIT NOT NULL DEFAULT 1
)

--DROP TABLE Config.WhatsAppSession