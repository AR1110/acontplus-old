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
    ,e.razonSocial entidad
    ,emp.razonSocial empresa
    ,ti.descripcion tipoIdentificacion
    ,ti.codigo as codTipoIdentificacion
    ,ti.codigoSri codIdentSri
    ,IIF(cs.IDType IS NULL,ti.codigoSri,cs.IDType)                as IDType
    ,IIF(cs.IDCard IS NULL,c.numeroIdentificacion,cs.IDCard)      as IDCard
    ,IIF(cs.BusinessName IS NULL, c.nombreFiscal,cs.BusinessName) as BusinessName
    ,IIF(cs.TradeName IS NULL, c.nombreComercial,cs.TradeName)    as TradeName
    ,c.correo as Email
    ,c.telefono as Telephone
    ,c.direccion as [Address]
FROM dbo.Cliente                       c WITH(NOLOCK)
    INNER JOIN dbo.Entidad             e WITH(NOLOCK)  ON c.idEntidad            = e.idEntidad
    INNER JOIN dbo.TipoIdentificacion ti WITH(NOLOCK)  ON c.idTipoIdentificacion = ti.idTipoIdentificacion 
    LEFT JOIN Administrador.Empresa  emp WITH (NOLOCK) ON c.idEmpresa            = emp.idEmpresa
    LEFT JOIN Customer.Customer       cs WITH (NOLOCK) ON cs.Id                  = c.CustomerId
)