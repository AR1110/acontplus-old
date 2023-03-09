use AcontPlus
DECLARE @xmlComp XML
,@rucProv VARCHAR(13)
--,@idEntidad INT = 7

DECLARE @tmp TABLE(
	idDocumento INT NULL
	,idArticulo INT NULL
	,codigoPrincipal VARCHAR(100)  NULL
	,codigoAuxiliar VARCHAR(100) NULL
	,cantidad VARCHAR(100) NOT NULL
	,descripcion VARCHAR(300) NOT NULL
	,precioUnitario VARCHAR(15) NOT NULL
	,descuento VARCHAR(15) NULL
	,precioTotalSinImpuesto VARCHAR(15) NULL
	,detallesAdicionales XML
	,idDetalle INT NULL
	)

	DECLARE @mainTable AS TABLE(
	idDocumento INT,
	xmlComp XML
	)

	INSERT INTO @mainTable(idDocumento, xmlComp)
SELECT idDocumento,  CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), xmlDoc.query('/autorizacion/comprobante')))) 
FROM Recepcion.DocumentoRecibido 
where
downloaded = 'DE'
and rucEmisor = '0102762531001'
--numeroAutorizacion = '0603202301179174314800120010010004555590045555911'

	INSERT INTO @tmp(idDocumento, codigoPrincipal, codigoAuxiliar, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto, detallesAdicionales)
	SELECT idDocumento, codigoPrincipal = x.y.value('(codigoPrincipal)[1]','VARCHAR(200)')
	, codigoAuxiliar = x.y.value('(codigoAuxiliar)[1]','VARCHAR(200)')
	, cantidad = x.y.value('(cantidad)[1]','NUMERIC(18,2)')
	, descripcion = x.y.value('(descripcion)[1]','VARCHAR(200)')
	, precioUnitario = x.y.value('(precioUnitario)[1]','NUMERIC(18,2)')
	, descuento = x.y.value('(descuento)[1]','NUMERIC(18,2)')
	, precioTotalSinImpuesto = x.y.value('(precioTotalSinImpuesto)[1]','NUMERIC(18,2)')
	, detallesAdicionales = x.y.query('(detallesAdicionales)')
	FROM @mainTable t
	CROSS APPLY t.xmlComp.nodes('//factura/detalles/detalle') as x(y)


	SELECT * FROM @tmp RETURN

--SELECT idDetalle, idDocumento, ch.idArticulo, m.idMedida, t.codigoPrincipal, t.codigoAuxiliar
--					,cantidad, t.descripcion, precioUnitario, precioTotalSinImpuesto, CAST((CAST(precioTotalSinImpuesto AS decimal(15,5)) / CAST(cantidad AS decimal(18,5))) AS numeric(18,5)), descuento
--					FROM @tmp t
--					LEFT JOIN FactElect.CompraHabitual ch ON t.codigoPrincipal = ch.codArticulo AND ch.ruc = @rucProv
--					LEFT JOIN dbo.Articulo a ON a.codigo = t.codigoPrincipal AND a.idEntidad = @idEntidad
--					--LEFT JOIN dbo.Articulo a ON ch.idArticulo = a.idArticulo AND a.idEntidad = @idEntidad
--					LEFT JOIN dbo.Medida m ON a.idMedida = m.idMedida AND m.idEntidad = @idEntidad
--					WHERE NOT EXISTS (SELECT * FROM Recepcion.Doc_Detalle_Temp tt 
--					WHERE t.idDocumento = tt.idDocumento AND t.codigoPrincipal = tt.codigoPrincipal)


--					--SELECT * FROM FactElect.CompraHabitual WHERE codArticulo = 'xfreight'

--					select * from Articulo where idArticulo IN  (14,
--13291,
--15000) 


--SELECT * FROM Usuario WHERE idUsuario IN (
--11,
--35,
--11
--)
--SELECT * FROM Entidad WHERE idEntidad = 9