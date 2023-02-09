USE AcontPlus
go
CREATE VIEW v_Cliente AS (

SELECT c.* FROM Cliente C 
LEFT JOIN Administrador.Empresa e WITH (NOLOCK)ON c.idEmpresa = e.idEmpresa

)
 