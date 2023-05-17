USE AcontPlus
GO
CREATE TABLE Config.WhatsappMessage(
	idMessage INT NOT NULL CONSTRAINT whatsaap_message_pk PRIMARY KEY IDENTITY(1,1)
	,idUsuarioRol INT NOT NULL
	,browser VARCHAR(300) NOT NULL
	,os VARCHAR(300) NOT NULL
	,emisor VARCHAR(50) NOT NULL	
	,receptor VARCHAR(50) NOT NULL
	,mensaje VARCHAR(1000) NOT NULL
	,params VARCHAR(2000) NULL
	,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE() 
	,totalMensajes INT NOT NULL
)

--DROP TABLE Config.WhatsappMessage