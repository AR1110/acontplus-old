USE AcontPlus
GO
CREATE OR ALTER VIEW v_Cliente WITH SCHEMABINDING AS (

SELECT cl.[idCliente]
      ,cl.[idTipoClienteProveedor]
      ,cl.[idTipoEntidad]
      ,cl.[idSubContribuyente]
      ,cl.[idTiempoCredito]
      ,cl.[idCiudad]
      ,cl.[montoCredito]
      ,cl.[direccion]
      ,cl.[telefono]
      ,cl.[correo]
      ,cl.[estado]
      ,cl.[consumidorFinal]
      ,cl.[fechaRegistro]
      ,cl.[idUsuario]
      ,cl.[idEntidad]
      ,cl.[idEmpleado]
      ,cl.[idEmpresa]
      ,cl.[idCargo]
      ,cl.[placa]
      ,cl.[nota]
      ,cl.[importacion]
      ,cl.[CustomerId]
      ,cl.correo                                                    as Email
      ,cl.telefono                                                  as Telephone
      ,cl.direccion                                                 as [Address]
      ,cl.infoCrediticia
      ,en.ruc                                                       as rucEntidad
      ,en.razonSocial                                               as entidad
      ,ce.BusinessName                                              as empresa
      ,ti.descripcion                                               as tipoIdentificacion
      ,ti.codigo                                                    as codTipoIdentificacion
      ,ti.codigoSri                                                 as IDType
      ,ti.codigoSri                                                 as codIdentSri
      ,cs.IdTypeId                                                  as idTipoIdentificacion
      ,cs.SriValidation                                             as validationSri
      ,cs.IDCard                                                    
      ,cs.BusinessName                                              
      ,cs.TradeName                                                 
      ,c2.descripcion                                               as ciudadNom
FROM dbo.Cliente                   cl WITH (NOLOCK)
INNER JOIN dbo.Entidad             en WITH (NOLOCK) ON en.idEntidad            = cl.idEntidad
INNER JOIN Customer.Customer       cs WITH (NOLOCK) ON cs.Id                   = cl.CustomerId
 LEFT JOIN dbo.Ciudad              c2 WITH (NOLOCK) ON c2.idCiudad             = cl.idCiudad
 LEFT JOIN Administrador.Empresa   em WITH (NOLOCK) ON em.idEmpresa            = cl.idEmpresa
 LEFT JOIN Customer.Customer       ce WITH (NOLOCK) ON ce.Id                   = em.CustomerId
INNER JOIN dbo.TipoIdentificacion  ti WITH (NOLOCK) ON ti.idTipoIdentificacion = cs.IdTypeId 
)