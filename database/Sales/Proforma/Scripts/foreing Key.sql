use [Acontplus]
go 

--ALTER TABLE dbo.Proforma ADD CONSTRAINT FK_proforma_idUsuario FOREIGN KEY(idUsuario) REFERENCES dbo.Usuario(idUsuario)

--ALTER TABLE dbo.Proforma ADD CONSTRAINT FK_proforma_idEntidad FOREIGN KEY(idEntidad) REFERENCES dbo.Entidad(idEntidad)

--ALTER TABLE dbo.Proforma ADD serieComprobante VARCHAR(50)

--update pr set 
--       pr.serieComprobante = es.estab + '-' + pe.ptoEmi + '-' + RIGHT('000000000' + CAST(pr.nroDocumento AS VARCHAR(9)),9)
--FROM dbo.Proforma              pr 
--INNER JOIN dbo.PuntoEmision    pe on pe.idPuntoEmision       = pr.idPuntoEmision
--inner join Sri.Establecimiento es on es.idEstablecimiento = pe.idEstablecimiento

--ALTER TABLE dbo.Proforma alter column serieComprobante VARCHAR(50) NOT NULL

SELECT top 5 * FROM Proforma


