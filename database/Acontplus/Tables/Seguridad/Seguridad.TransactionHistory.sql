use [Acontplus]
go 


CREATE TABLE Seguridad.TransactionHistory
(
	Id INT  PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,UserRoleId INT CONSTRAINT FK_Historial_UsuarioRolId FOREIGN KEY (UserRoleId) REFERENCES App.UsuarioRol(idUsuarioRol) NOT NULL
   ,Quantity INT NULL
   ,Module VARCHAR(150) NOT NULL
   ,[Action] VARCHAR(150) NOT NULL
   ,Obs VARCHAR(200) NULL
   ,CreateAt DATETIME2 DEFAULT GETDATE() NOT NULL
   ,Token VARCHAR(100) DEFAULT NEWID() NOT NULL
   ,[Enabled] BIT DEFAULT 1 NOT NULL
)

