
USE AcontPlus;

IF OBJECT_ID('ReporteInventario.TransferenciaBodega') IS NOT NULL
	DROP PROCEDURE ReporteInventario.TransferenciaBodega
go

CREATE PROCEDURE ReporteInventario.TransferenciaBodega @json VARCHAR(600)
AS 
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @id INT;

	SELECT @id = id FROM OPENJSON(@json)WITH(id INT '$.id')

	SELECT 
		entidad = tb.razonSocial,
		establecimiento = tb.nombreComercial,
		nroDoc = dbo.AFTGenerarNroDocumento(tb.estab+tb.ptoEmi,tb.nroDoc),
		fechaEmision = FORMAT(tb.fechaEmision, 'dd/MM/yyyy HH:mm'),
		tb.bodegaOrigen,
		tb.bodegaDestino,
		tb.observacion
	FROM v_Transferencia_Bodega tb	
	WHERE idTransferenciaBodega = @id

	SELECT 
		ROW_NUMBER() OVER (ORDER BY tbd.idTransferenciaBodega) AS 'index',
		ar.codigo,
		tbd.descripcion,
		cantidad = CAST(tbd.cantidad AS numeric(18,2)),
		medida = m.descripcion,
		precioCosto = CAST(tbd.precioCosto AS numeric(18,2)),
		total = CAST(tbd.total AS numeric(18,2))
	FROM TransferenciaBodegaDetalle tbd WITH(NOLOCK)
	INNER JOIN Articulo ar WITH(NOLOCK) ON ar.idArticulo = tbd.idArticulo
	INNER JOIN Medida m WITH(NOLOCK) ON m.idMedida = tbd.idMedida
	WHERE tbd.idTransferenciaBodega = @id 

END 
