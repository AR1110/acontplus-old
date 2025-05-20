USE AcontPlus
GO

CREATE OR ALTER VIEW v_CuentaPorPagar WITH SCHEMABINDING AS (
	SELECT cp.idCuentaPorPagar
	      ,cp.idProveedor
		  ,cp.idTiempoCredito
		  ,cp.idEstadoPago
		  ,cp.idUsuario
		  ,cp.idDocumento
		  ,es.idEntidad
          ,es.idEstablecimiento
          ,es.nombreComercial
          ,es.codEstab
		  ,cp.codDoc
		  ,cp.uniqueId
		  ,cu.BusinessName                                                             as razonSocialProveedor
		  ,cu.IDCard                                                                   as identificacionProveedor
          ,pr.CustomerId
		  ,cp.serieComprobante
		  ,REPLACE(LTRIM(REPLACE(SUBSTRING(cp.serieComprobante,9,9),'0',' ')),' ','0') as secuencial
		  ,cp.fechaEmision
		  ,cp.fechaVencimiento
		  ,cp.importeTotal
		  ,cp.abono
		  ,cp.saldo
		  ,estado                  = ep.descripcion
		  ,codEstado               = ep.codigo
		  ,usuario = us.nombreUsuario
          ,tc.descripcion as tiempoCredito
          ,tc.diasCredito
          ,cp.subcategoryId
          ,sc.[Name] subcategoryName
          ,(
                CASE cp.codDoc WHEN '01' THEN cp.uniqueId
                               WHEN 'FC' THEN (SELECT TOP 1 fc.nroAutorizacion FROM dbo.FacturaCompra fc WITH (NOLOCK) WHERE fc.idFacturaCompra = cp.idDocumento)
                END 
           ) as numAutDocSustento
	FROM Contabilidad.CuentaPorPagar    cp WITH (NOLOCK)
	INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento = cp.idEstablecimiento 
	INNER JOIN dbo.Proveedor            pr WITH (NOLOCK) ON pr.idProveedor       = cp.idProveedor
	INNER JOIN dbo.EstadoPago           ep WITH (NOLOCK) ON ep.idEstadoPago      = cp.idEstadoPago
	INNER JOIN dbo.Usuario              us WITH (NOLOCK) ON us.idUsuario         = cp.idUsuario
     LEFT JOIN dbo.TiempoCredito        tc WITH (NOLOCK) ON tc.idTiempoCredito   = cp.idTiempoCredito
     LEFT JOIN Contabilidad.Subcategory sc WITH (NOLOCK) ON sc.Id                = cp.SubcategoryId 
    INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                = pr.CustomerId
)