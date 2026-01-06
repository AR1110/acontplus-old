USE AcontPlus
GO
CREATE OR ALTER VIEW Compra.v_DocumentoIngreso WITH SCHEMABINDING AS (

	SELECT di.idDocumentoIngreso 
		  ,di.idPuntoEmision
          ,di.fechaEmision
          ,di.importeTotal
          ,di.idUsuario
          ,di.idProveedor
          ,di.secuencial
          ,es.estab + '-' + pe.ptoEmi + '-' +  RIGHT('000000000' + CAST(di.secuencial AS VARCHAR(9)), 9) as serieComprobante
          ,ep.descripcion                                                                                as estadoCuenta
          ,ep.codigo                                                                                     as codCuenta
          ,cu.IDCard                                                                                     as identificacionProveedor
          ,cu.BusinessName                                                                               as razonSocialProveedor
          ,cp.abono
          ,cp.saldo
          ,us.nombreUsuario                                                                              as usuario
          ,cp.subcategoryId
          ,sc.[Name]                                                                                     as subcategoryName
          ,es.codEstab
	FROM Compra.Documento_Ingreso          di WITH (NOLOCK)
	INNER JOIN dbo.PuntoEmision            pe WITH (NOLOCK) ON pe.idPuntoEmision    = di.idPuntoEmision
    INNER JOIN dbo.Proveedor               pr WITH (NOLOCK) ON pr.idProveedor       = di.idProveedor
    INNER JOIN dbo.Usuario                 us WITH (NOLOCK) ON us.idUsuario         = di.idUsuario
	INNER JOIN Contabilidad.CuentaPorPagar cp WITH (NOLOCK) ON cp.idDocumento       = di.idDocumentoIngreso AND cp.codDoc = 'DH'
    INNER JOIN Sri.Establecimiento         es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
     LEFT JOIN dbo.EstadoPago              ep WITH (NOLOCK) ON ep.idEstadoPago      = cp.idEstadoPago
     LEFT JOIN Contabilidad.Subcategory    sc WITH (NOLOCK) ON sc.Id                = cp.subcategoryId
    INNER JOIN Customer.Customer           cu WITH (NOLOCK) ON cu.Id                = pr.CustomerId
)
