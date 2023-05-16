USE AcontPlus
GO
IF OBJECT_ID(N'Catalogo.EstadoDocumento', N'U') IS NOT NULL
DROP TABLE Catalogo.EstadoDocumento 
GO
CREATE TABLE Catalogo.EstadoDocumento(
	 idEstadoDocumento INT PRIMARY KEY IDENTITY(1,1) NOT NULL
	,codigo VARCHAR(5) NOT NULL UNIQUE
	,descripcion VARCHAR(150) NOT NULL
	,estado BIT DEFAULT 1 NOT NULL
	
)