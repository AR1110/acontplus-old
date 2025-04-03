USE Acontplus 
 
CREATE   TABLE Config.SolicitudAutorizacion (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuarioRolSolicitante INT NOT NULL,
	IdUsuarioRolAprobante INT NULL,
	IdEntidad INT NOT NULL,
	CodigoModulo VARCHAR(5),
	IdDocumentoRef INT ,
	CodigoAccion  VARCHAR(5), 
	CodigoEstado  VARCHAR(10) DEFAULT 'P',  
    FechaRegistro DATETIME NOT NULL ,
    FechaRespuesta DATETIME NULL,
   
    obs VARCHAR(200),
    AdminRolesJson NVARCHAR(MAX) NOT NULL,
    infoExtraJson  NVARCHAR(MAX) NOT NULL,  
	RowGuid UNIQUEIDENTIFIER NOT NULL
    
    FOREIGN KEY (IdUsuarioRolSolicitante) REFERENCES App.UsuarioRol(idUsuarioRol), 
    FOREIGN KEY (IdUsuarioRolAprobante) REFERENCES App.UsuarioRol(idUsuarioRol), 
    FOREIGN KEY (IdEntidad) REFERENCES Entidad(IdEntidad),  
);

CREATE   TABLE Config.SolicitudAutorizacionDetalle (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    IdSolicitudAutorizacion INT,
    Nombre VARCHAR(100),
    Valor VARCHAR(100),
    NuevoValor VARCHAR(100),
    Obs VARCHAR(200),
    
    FOREIGN KEY (IdSolicitudAutorizacion) REFERENCES  Config.SolicitudAutorizacion(Id)
);