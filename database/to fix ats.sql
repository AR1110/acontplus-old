use acontplus
go
--select * from entidad where ruc = '1201045125001'

--select * from App.UsuarioRol where identidad = 66
go
--[dbo].[ASPAtsGetData] 94, '{"fromDate": "2024-04-01", "toDate": "2024-04-30"}'

DECLARE     @fromDate DATETIME2  = '2024-04-01',
        @toDate DATETIME2 = '2024-04-30',
        @idEntidad INT = 66


 --SELECT 'R'                                                                                as TipoIdInformante
	--       ,en.Ruc                                                                            as IdInformante
	--       ,en.razonSocial
	     
	--       ,'IVA'                                                                             as codigoOperativo
	--       ,ISNULL(CAST(SUM(fe.baseImponible) AS NUMERIC(18,2)),0)                     as totalVentas
 --          --,ROW_NUMBER() OVER(PARTITION BY pe.codEstab ORDER BY pe.codEstab)                  as estabs
	 
 --   FROM dbo.Factura            fe WITH (NOLOCK) 
	--INNER JOIN dbo.PuntoEmision pe WITH (NOLOCK) ON pe.idPuntoEmision = fe.idPuntoEmision
	--INNER JOIN dbo.Entidad      en WITH (NOLOCK) ON en.idEntidad      = fe.idEntidad
	--WHERE fe.idEntidad = @idEntidad
	--  AND fe.autorizada = 1 
	--  AND fe.notaCredito = 0
	--  AND CAST(fe.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
	--  AND fe.estado = 1
	--GROUP BY en.ruc,en.razonSocial,pe.codEstab


    SELECT 'R' AS TipoIdInformante,
e.Ruc AS IdInformante,
e.razonSocial,  
ROW_NUMBER()OVER(PARTITION BY pe.codEstab ORDER BY PE.CODESTAB) estabs,
'IVA' AS codigoOperativo,
totalVentas = ISNULL((SELECT CAST(SUM(fff.subtotalsinImpuestos) AS NUMERIC(18,2)) FROM Factura fff  WITH (NOLOCK)
									INNER JOIN PuntoEmision pe WITH (NOLOCK) ON pe.idPuntoEmision = fff.idPuntoEmision
									INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = pe.codEstab
									WHERE fff.idEntidad = @idEntidad
									AND fff.autorizada = 1 
									AND fff.notacredito = 0
									AND fff.estado = 1  
                                    AND CAST(FFf.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)), 0)
--INTO #tempTotalVentas
FROM dbo.Factura f WITH (NOLOCK) 
INNER JOIN dbo.PuntoEmision pe  WITH(NOLOCK) ON f.idPuntoEmision = pe.idPuntoEmision
INNER JOIN dbo.Entidad e  WITH(NOLOCK) ON f.idEntidad = e.idEntidad
WHERE f.idEntidad = @idEntidad
AND f.autorizada = 1 
AND f.notaCredito = 0
                                    AND CAST(f.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)

AND f.estado = 1
GROUP BY e.Ruc
,e.razonSocial
,pe.codEstab

--select top 1 dbo.f_sanitize_xml(CONVERT(Varchar(max),  CONVERT(XML, DECOMPRESS(xmlCompressed)))), idDocumento from Recepcion.DocumentoRecibido dr
--inner join Sri.Establecimiento e ON dr.idestablecimiento = e.idestablecimiento
--where serieComprobante like'%15954%' 
-- and identidad = 66


--  SELECT *
--			    FROM [Recepcion].[DocumentoImpuesto] fci WITH (NOLOCK)
--			    WHERE fci.DocumentoRecibidoId = 33875
--				    --AND fci.CodePercentage IN ('2','3','8')