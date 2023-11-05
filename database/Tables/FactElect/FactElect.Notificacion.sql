USE Acontplus
IF OBJECT_ID(N'FactElect.NotificacionTributaria', N'U') IS NOT NULL
DROP TABLE FactElect.NotificacionTributaria
GO
CREATE TABLE FactElect.NotificacionTributaria(
 idNotificacionTributaria BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1)
,idDocumentoElectronico BIGINT NOT NULL FOREIGN KEY (idDocumentoElectronico) REFERENCES dbo.DocumentoElectronico(idDocumentoElectronico)
,receptor VARCHAR(150) NULL
,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
,fechaEnvio DATETIME NULL
,estado VARCHAR(5) NOT NULL --'NE', 'E', 'ERROR'
,msgError VARCHAR(300) NULL
)