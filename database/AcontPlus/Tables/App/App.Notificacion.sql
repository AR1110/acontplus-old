USE AcontPlus
GO
IF OBJECT_ID(N'App.Notificacion', N'U') IS NOT NULL
DROP TABLE App.Notificacion 
GO
CREATE TABLE App.Notificacion(
idNotificacion INT NOT NULL CONSTRAINT pk_idNotificacion PRIMARY KEY IDENTITY(1,1) 
,params VARCHAR(1000) NOT NULL
,emailData VARCHAR(MAX) NOT NULL
,receptor VARCHAR(150) NOT NULL
,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
,estado VARCHAR(5) NOT NULL
,fechaEnvio DATETIME NULL
,msgError VARCHAR(300) NULL
,idUsuario INT NULL
)