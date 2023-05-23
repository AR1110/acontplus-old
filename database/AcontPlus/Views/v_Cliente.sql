USE AcontPlus
GO
IF OBJECT_ID(N'v_Cliente', N'V') IS NOT NULL
DROP VIEW v_Cliente
GO
CREATE VIEW v_Cliente AS (

SELECT c.*
,e.ruc rucEntidad
,e.razonSocial entidad
,emp.razonSocial empresa
,ti.descripcion tipoIdentificacion
,ti.codigoSri codIdentSri
FROM Cliente c WITH(NOLOCK)
INNER JOIN Entidad e WITH(NOLOCK) ON c.idEntidad = e.idEntidad
INNER JOIN TipoIdentificacion ti WITH(NOLOCK) ON c.idTipoIdentificacion = ti.idTipoIdentificacion 
LEFT JOIN Administrador.Empresa emp WITH (NOLOCK) ON c.idEmpresa = emp.idEmpresa
)
 