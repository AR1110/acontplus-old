USE [AcontPlus]
GO

DECLARE @secuencial INT 

DECLARE @table TABLE 
(
	id INT IDENTITY(1,1)
   ,idUsuarioRol INT  NOT NULL
   ,codEstab VARCHAR(50) NOT NULL
   ,predeterminada BIT NOT NULL
   ,usuario VARCHAR(100) NOT NULL
   ,fechaRegistro DATETIME NOT NULL
)

SELECT @secuencial = COUNT(*) FROM Config.Estab_Asig 

INSERT INTO @table 
(
	idUsuarioRol
   ,codEstab
   ,predeterminada
   ,usuario
   ,fechaRegistro
)
SELECT gs.idUsuarioRol
	  ,codEstab = s.serie+'-'+e.ruc
	  ,gs.defecto
	  ,usuario = u.nombreUsuario
	  ,gs.fechaRegistro
FROM Gestion.AsignacionSucursal gs
INNER JOIN dbo.Sucursal s ON s.idSucursal = gs.idSucursal
INNER JOIN dbo.Entidad e ON e.idEntidad = s.idEntidad
INNER JOIN dbo.Usuario u ON u.idUsuario = gs.idUsuario


INSERT INTO Config.Estab_Asig
(
    codEstab_Asig
   ,idUsuarioRol 
   ,codEstab 
   ,predeterminada 
   ,usuario 
   ,fechaRegistro 
)
SELECT codEstab_Asig = Helper.F_Auto_Sequential(@secuencial+id),idUsuarioRol,codEstab,predeterminada,usuario,fechaRegistro FROM @table