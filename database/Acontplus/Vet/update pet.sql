use Acontplus
go
UPDATE p SET CustomerCompanyId = c.idCliente
FROM Pet.Pet p WITH (ROWLOCK)
INNER JOIN Cliente c ON p.companyId = c.idEntidad AND p.CustomerId = c.CustomerId 
