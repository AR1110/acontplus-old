use [Acontplus]
go 


--ALTER TABLE dbo.NotaEntrega ADD CONSTRAINT FK_notaEntrega_idUsuario FOREIGN KEY(idUsuario) REFERENCES dbo.Usuario(idUsuario)

--ALTER TABLE dbo.NotaEntrega ADD CONSTRAINT FK_notaEntrega_idEntidad FOREIGN KEY(idEntidad) REFERENCES dbo.Entidad(idEntidad)

--ALTER TABLE dbo.NotaEntrega ADD serieComprobante VARCHAR(50)

--update ne set 
--       ne.serieComprobante = es.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CAST(ne.nroDocumento AS VARCHAR(9)),9)
--FROM dbo.NotaEntrega   ne 
--INNER JOIN dbo.PuntoEmision    pe on pe.idPuntoEmision       = ne.idPuntoEmision
--inner join Sri.Establecimiento es on es.idEstablecimiento = pe.idEstablecimiento

--ALTER TABLE dbo.NotaEntrega ALTER COLUMN serieComprobante VARCHAR(50) NOT NULL