create table Config.Sistema(
	idSistema INT PRIMARY KEY IDENTITY(1,1),
	urlSistema NVARCHAR(MAX) NOT NULL,
	hostApp NVARCHAR(MAX) NOT NULL,
	connectionStrings NVARCHAR(MAX) NOT NULL,
	estado BIT DEFAULT 1,
	fechaRegistro DATETIME NOT NULL
)