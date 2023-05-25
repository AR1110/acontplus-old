use acontplus

GO
IF OBJECT_ID(N'v_Cartera_Cliente', N'V') IS NOT NULL
DROP VIEW v_Cartera_Cliente
GO
CREATE VIEW v_Cartera_Cliente AS (
	SELECT 
		f.idFactura as idDocumento,
		f.idTipoDocumento,
		f.idEntidad,
		s.codEstab,
		f.idCliente,
		f.idEstadoPago,
		td.codigo,
		f.fechaEmision,
		f.fechaVencimiento,
		dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,f.nroFactura) as nroDoc,
		f.total,
		f.abono,
		f.saldo,
		f.estado,
		f.anuladaSri as anulada,
		dbo.afnDayExpiration(f.idTipoDocumento,f.idFactura) as expira
	FROM dbo.Factura f WITH (NOLOCK) 
	INNER JOIN dbo.TipoDocumento  td WITH (NOLOCK) ON td.idTipoDocumento = f.idTipoDocumento
	INNER JOIN dbo.PuntoEmision   pe WITH (NOLOCK) ON pe.idPuntoEmision  = f.idPuntoEmision
	INNER JOIN Sri.Establecimiento s WITH (NOLOCK) ON s.codEstab         = pe.codEstab
	WHERE f.estado = 1

	UNION ALL 

	SELECT 
		ne.idNotaEntrega,
		ne.idTipoDocumento,
		ne.idEntidad,
		s.codEstab,
		ne.idCliente,
		ne.idEstadoPago,
		td.codigo,
		ne.fechaEmision,
		ne.fechaVencimiento,
		dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,ne.nroDocumento),
		ne.total,
		ne.abono,
		ne.saldo,
		ne.estado,
		ne.anulada,
		dbo.afnDayExpiration(ne.idTipoDocumento,ne.idNotaEntrega) as expira
	FROM dbo.NotaEntrega ne WITH (NOLOCK) 
	INNER JOIN dbo.TipoDocumento  td WITH (NOLOCK) ON td.idTipoDocumento = ne.idTipoDocumento
	INNER JOIN dbo.PuntoEmision   pe WITH (NOLOCK) ON pe.idPuntoEmision  = ne.idPuntoEmision
	INNER JOIN Sri.Establecimiento s WITH (NOLOCK) ON s.codEstab         = pe.codEstab
	WHERE ne.estado = 1
 )