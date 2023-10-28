USE AcontPlus
GO
IF OBJECT_ID('Config.Sistema') IS NOT NULL
DROP TABLE Config.Sistema
GO
CREATE TABLE Config.Sistema 
(	
	 idSistema INT IDENTITY(1,1) PRIMARY KEY NOT NULL
	,codigo AS CAST(idEntidad as VARCHAR)+codConfig UNIQUE
	,idEntidad INT CONSTRAINT fk_config_Aplicacion_Entidad FOREIGN KEY (idEntidad) REFERENCES Entidad(idEntidad) NOT NULL
	,codConfig VARCHAR(5) NOT NULL
	,jsonConfig VARCHAR(MAX) NOT NULL
	,fechaRegisto DATETIME DEFAULT GETDATE() 
	,estado BIT DEFAULT 1 
)