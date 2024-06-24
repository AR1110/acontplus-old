USE [Acontplus]
go 


--ALTER TABLE dbo.NotaCredito DROP CONSTRAINT FK__NotaCredi__idEst__7DCE75F9

--ALTER TABLE dbo.NotaCredito DROP COLUMN idEstadoDocumento

--ALTER TABLE dbo.NotaCredito ADD CONSTRAINT fk_NotaCredito_Usuario FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(idUsuario)

--ALTER TABLE dbo.NotaCredito ADD CONSTRAINT fk_NotaCredito_Entidad FOREIGN KEY (idEntidad) REFERENCES dbo.Entidad(idEntidad)

--SELECT * FROM Ventas.v_NotaCredito

--select codDoc, idDocumento,count(*) as total 
--from DocumentoElectronico
--where codDoc = '04' 
--group by codDoc, idDocumento
--order by total desc