use AcontPlus
go
--USAR ESTE UNA VEZ ACTUALIZADO TODO
IF OBJECT_ID(N'v_Transferencia_Bodega', N'V') IS NOT NULL
	DROP VIEW v_Transferencia_Bodega
GO
 

CREATE VIEW v_Transferencia_Bodega AS (
	SELECT 
		tb.idTransferenciaBodega,
		tb.idTipoDocumento,
		tb.idEntidad,
		es.idEstablecimiento,
		pto.idPuntoEmision,
		tb.idBodegaOrigen,
		tb.idBodegaDestino,
		tb.idUsuario,
		e.razonSocial,
		es.estab,
		es.nombreComercial,
		es.codEstab,
		pto.ptoEmi,
		tb.nroDoc,
		tb.fechaEmision,
		estadoDesc = ep.descripcion,
		estadoCodigo = ep.codigo,
		total = tb.total,
		bodegaOrigen = bo.descripcion,
		bodegaDestino = bd.descripcion,
		u.nombreUsuario,
		tb.estado,
		tb.observacion
	FROM TransferenciaBodega tb WITH(NOLOCK)
	INNER JOIN PuntoEmision pto WITH(NOLOCK) ON pto.idPuntoEmision = tb.idPuntoEmision
	INNER JOIN Sri.Establecimiento es WITH(NOLOCK) ON es.codEstab = pto.codEstab
	INNER JOIN EstadoPago ep WITH(NOLOCK) ON ep.idEstadoPago = tb.idEstadoDocumento
	INNER JOIN Bodega bo WITH(NOLOCK) ON bo.idBodega = tb.idBodegaOrigen
	INNER JOIN Bodega bd WITH(NOLOCK) ON bd.idBodega = tb.idBodegaDestino
	INNER JOIN Usuario u WITH(NOLOCK) ON u.idUsuario = tb.idUsuario
	INNER JOIN Entidad e WITH(NOLOCK) ON e.idEntidad = tb.idEntidad
) 