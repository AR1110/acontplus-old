use [Acontplus]
go 



--ALTER TABLE dbo.PuntoEmision ADD idEstablecimiento INT CONSTRAINT FK_Establecimiento_PtoEmision REFERENCES Sri.Establecimiento(idEstablecimiento)

--ALTER TABLE dbo.PuntoEmision ADD idUsuario INT CONSTRAINT FK_PtoEmi_Usuario REFERENCES dbo.Usuario(idUsuario)

select * from dbo.PuntoEmision

--UPDATE pe SET
--	 pe.idEstablecimiento = (SELECT TOP 1 es.idEstablecimiento FROM Sri.Establecimiento es WHERE es.codEstab = pe.codEstab)
--	,pe.idUsuario = (SELECT TOP 1 u.idUsuario FROM dbo.Usuario u WHERE u.nombreUsuario = pe.usuario)
--FROM dbo.PuntoEmision pe 

--ALTER TABLE dbo.PuntoEmision ALTER COLUMN idEstablecimiento INT NOT NULL

--ALTER TABLE dbo.PuntoEmision ALTER COLUMN idUsuario INT NOT NULL
--ALTER TABLE dbo.PuntoEmision DROP CONSTRAINT FK__PuntoEmis__codEs__7BE363BF

--ALTER TABLE dbo.PuntoEmision DROP COLUMN codEstab

--ALTER TABLE dbo.PuntoEmision DROP COLUMN usuario