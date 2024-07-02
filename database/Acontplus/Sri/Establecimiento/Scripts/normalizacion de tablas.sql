use [Acontplus]
go 

--ALTER TABLE Sri.Establecimiento ADD idUsuario INT CONSTRAINT FK_Establecimiento_Usuario REFERENCES dbo.Usuario(idUsuario)


select * from Sri.Establecimiento

--update es set
--    es.idUsuario = (select top 1 u.idUsuario from dbo.Usuario u where u.nombreUsuario = es.usuario)
--from Sri.Establecimiento es 


--alter table Sri.Establecimiento ALTER COLUMN idUsuario INT NOT NULL

--alter table Sri.Establecimiento DROP COLUMN ruc

--alter table Sri.Establecimiento DROP COLUMN usuario
