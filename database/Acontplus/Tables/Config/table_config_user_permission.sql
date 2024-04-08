
USE AcontPlus;
GO
--IF OBJECT_ID('Config.UserPermission') IS NOT NULL
--DROP TABLE Config.UserPermission
--GO
--CREATE TABLE Config.UserPermission (
--	idUserPermission INT PRIMARY KEY IDENTITY (1,1) NOT NULL
--	,idUsuarioRol INT NOT NULL CONSTRAINT PK_UsuarioRol FOREIGN KEY (idUsuarioRol) REFERENCES App.UsuarioRol(idUsuarioRol)	
--	,codModule VARCHAR(5) NOT NULL
--	,jsonPermission VARCHAR(MAX)
--	,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
--	,estado BIT NOT NULL DEFAULT 1	
--)

--IF OBJECT_ID('Config.Solicitud')IS NOT NULL
--	DROP TABLE Config.Solicitud
--GO 

----tabla solicitud para modificar, anular el documento de venta 
CREATE TABLE Config.Solicitud(
	idSolicitud INT NOT NULL PRIMARY KEY IDENTITY(1,1)
	,idUsuarioRolAprobante  INT NOT NULL CONSTRAINT FK_Solicitud_UsuarioRol1 FOREIGN KEY (idUsuarioRolAprobante) REFERENCES App.UsuarioRol(idUsuarioRol)	
	,idUsuarioRolSolicitante INT NOT NULL CONSTRAINT FK_Solicitud_UsuarioRol2 FOREIGN KEY (idUsuarioRolSolicItante) REFERENCES App.UsuarioRol(idUsuarioRol)	
	,observacion VARCHAR(200) NOT NULL
	,codigoAccion VARCHAR(2) -- E(EDITAR), A(ANULAR)
	,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
	,fechaAprobacion DATETIME  NULL 
	,codEstado VARCHAR(2) -- P(PENDIENTE), A(APROBADA), F(FINALIZADO)
    ,idEntidad INT NOT NULL
    ,jsonData NVARCHAR(MAX) NOT NULL
    ,rowguid UNIQUEIDENTIFIER NOT NULL
)

 