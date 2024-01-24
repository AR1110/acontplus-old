--CREATE TABLE Importaciones.Historial
--(
--	idHistorial INT PRIMARY KEY IDENTITY(1,1) NOT NULL
--   ,idUsuario INT NOT NULL
--   ,idEntidad INT NOT NULL
--   ,modulo VARCHAR(200) NOT NULL
--   ,cantidad INT NOT NULL
--   ,fechaRegistro DATETIME NOT NULL
--   ,token VARCHAR(500) DEFAULT NEWID()
--)

--alter table dbo.SubFamilia add importacion BIT DEFAULT 0 
--UPDATE dbo.SubFamilia set importacion = 0 
--SELECT * FROM SubFamilia

--alter table dbo.Medida drop column codigo
--alter table dbo.Medida add codigo VARCHAR(10) 
--alter table dbo.Medida add importacion BIT DEFAULT 0
--UPDATE dbo.Medida set importacion = 0
--select * from dbo.Medida
--update Medida set codigo = CAST(idMedida as varchar)+CAST(descripcion as varchar(3))

--alter table dbo.Marca drop column codigo 
--alter table dbo.Marca add  codigo VARCHAR(50)
--alter table dbo.Marca add importacion BIT DEFAULT 0
--update MARCA set codigo = CAST(descripcion as varchar(3))+CAST(idMarca as varchar)
--update MARCA set importacion = 0
--select * from dbo.Marca

--alter table dbo.Modelo add  codigo VARCHAR(50)
--alter table dbo.Modelo add importacion BIT DEFAULT 0
--update modelo set codigo = CAST(descripcion as varchar(3))+CAST(idModelo as varchar)
--update modelo set importacion = 0
--select * from dbo.Modelo

--alter table dbo.Articulo add importacion BIT DEFAULT 0
--UPDATE dbo.Articulo set importacion = 0 
--select * from dbo.Articulo

--alter table dbo.Cliente add importacion BIT DEFAULT 0
--UPDATE dbo.Cliente set importacion = 0 
--select * from dbo.Cliente

--alter table dbo.Proveedor add importacion BIT DEFAULT 0
--UPDATE dbo.Proveedor set importacion = 0 
--select * from dbo.Proveedor