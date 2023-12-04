USE AcontPlus
GO
CREATE OR ALTER VIEW Ventas.v_NotaCredito WITH SCHEMABINDING AS (

	SELECT nc.idNotaCredito
	      ,nc.idFactura
		  ,nc.idCliente
		  ,nc.idPuntoEmision
          ,nc.nroDocumento as secuencial
          ,nc.subTotalSinImpuestos
          ,nc.iva
          ,nc.total
          ,nc.estado
          ,pt.ptoEmi
          ,es.estab
	FROM dbo.NotaCredito           nc WITH (NOLOCK)
    INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision = nc.idPuntoEmision
    INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pt.codEstab

)