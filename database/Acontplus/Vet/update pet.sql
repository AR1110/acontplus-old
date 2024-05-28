use Acontplus
go
UPDATE p SET CustomerCompanyId = c.idCliente
FROM Pet.Pet p WITH (ROWLOCK)
INNER JOIN Cliente c ON p.companyId = c.idEntidad AND p.CustomerId = c.CustomerId 
GO

UPDATE mh SET mh.EstablecimientoId = e.idEstablecimiento 
FROM Pet.MedicalHistory mh 
INNER JOIN Sri.Establecimiento e ON mh.codEstab = e.codEstab 