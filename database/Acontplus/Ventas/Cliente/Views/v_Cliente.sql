USE AcontPlus
GO
IF OBJECT_ID(N'v_Cliente', N'V') IS NOT NULL
DROP VIEW v_Cliente
GO
CREATE VIEW v_Cliente WITH SCHEMABINDING AS (

SELECT c.[idCliente]
    ,c.[idTipoClienteProveedor]
    ,c.[idTipoEntidad]
    ,c.[idSubContribuyente]
    ,c.[idTiempoCredito]
    ,c.[idTipoIdentificacion]
    ,c.[idCiudad]
    ,c.[numeroIdentificacion]
    ,c.[nombreFiscal]
    ,c.[montoCredito]
    ,c.[nombreComercial]
    ,c.[direccion]
    ,c.[telefono]
    ,c.[correo]
    ,c.[estado]
    ,c.[consumidorFinal]
    ,c.[fechaRegistro]
    ,c.[idUsuario]
    ,c.[idEntidad]
    ,c.[idEmpleado]
    ,c.[idEmpresa]
    ,c.[idCargo]
    ,c.[placa]
    ,c.[nota]
    ,c.[importacion]
    ,c.[validationSri]
    ,c.[CustomerId]
    ,e.ruc rucEntidad
    ,e.razonSocial   as entidad
    ,ce.BusinessName as empresa
    ,ti.descripcion  as tipoIdentificacion
    ,ti.codigo       as codTipoIdentificacion
    ,ti.codigoSri    as codIdentSri
    ,IIF(cs.IDType IS NULL,ti.codigoSri,cs.IDType)                as IDType
    ,IIF(cs.IDCard IS NULL,c.numeroIdentificacion,cs.IDCard)      as IDCard
    ,IIF(cs.BusinessName IS NULL, c.nombreFiscal,cs.BusinessName) as BusinessName
    ,IIF(cs.TradeName IS NULL, c.nombreComercial,cs.TradeName)    as TradeName
    ,c.correo as Email
    ,c.telefono as Telephone
    ,c.direccion as [Address]
    ,c.infoCrediticia
   /* ,ic.maritalStatusId
	,ic.housingTypeId
	,ic.conyugeNombre
	,ic.conyugeTel 
	,ic.refFamNombre
	,ic.dirVivienda 
	,ic.refDomicilio
	,ic.refFamTel 
	,estadoCivilNom = ms.[Name]
	,tipoViviendaNom = ht.[Name]*/ 
    ,ciudadNom = c2.descripcion
FROM dbo.Cliente                    c WITH (NOLOCK)
INNER JOIN dbo.Entidad              e WITH (NOLOCK) ON e.idEntidad             = c.idEntidad
INNER JOIN dbo.TipoIdentificacion  ti WITH (NOLOCK) ON ti.idTipoIdentificacion = c.idTipoIdentificacion 
/**OUTER  APPLY OPENJSON (c.infoCrediticia)
WITH(
	maritalStatusId INT
	,housingTypeId  INT
	,conyugeNombre VARCHAR(150)
	,conyugeTel VARCHAR(100)
	,refFamNombre VARCHAR(100) 
	,dirVivienda VARCHAR(150)
	,refDomicilio VARCHAR(100) 
	,refFamTel VARCHAR(100)
) as ic*/

 LEFT JOIN Customer.Customer       cs WITH (NOLOCK) ON cs.Id                   = c.CustomerId
 LEFT JOIN dbo.Ciudad c2 WITH(NOLOCK) ON c2.idCiudad = c.idCiudad
 LEFT JOIN Administrador.Empresa  emp WITH (NOLOCK) ON emp.idEmpresa           = c.idEmpresa
 LEFT JOIN Customer.Customer       ce WITH (NOLOCK) ON ce.Id                   = emp.CustomerId
 --LEFT JOIN Common.MaritalStatus ms WITH(NOLOCK) ON ms.Id = ic.maritalStatusId
--LEFT JOIN Common.HousingType ht WITH(NOLOCK) ON ht.Id = ic.housingTypeId
 
)