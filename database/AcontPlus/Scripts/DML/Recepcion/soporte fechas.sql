 --Recepcion.Documento_Get 93, '{"orderBy":"","sortBy":"","limit":50,"page":1,"codDoc":"","startDate":"2022-02-05T05:00:00.000Z","endDate":"2023-03-07T04:59:59.999Z"}'
   --Recepcion.Documento_Get 63, '{"orderBy":"","sortBy":"","limit":50,"page":1,"codDoc":"","startDate":"2022-02-05T05:00:00.000Z","endDate":"2023-03-07T04:59:59.999Z"}'
SELECT * FROM Recepcion.DocumentoRecibido WHERE codEstab IN (SELECT codEstab FROM Config.Estab_Asig WHERE idUsuarioRol = 63 AND predeterminado = 1)
--SELECT idDocumento FROM Recepcion.DocumentoRecibido where LEN(fechaEmision) = 10
 --select * from FacturaCompra where nroAutorizacion = '2802202301179028338000120010190035526800355268014'

 --select * from FacturaCompra where idFacturaCompra NOT IN (
 
 --SELECT fcd.idFacturaCompra FROM FacturaCompraDetalle fcd
 --)

-- delete from FacturaCompra where idFacturaCompra in (2132,
--2368,
--2369,
--2370,
--2371)

-- select * from Recepcion.DocumentoRecibido where numeroAutorizacion IN (
--'2802202301179028338000120010190035526800355268014' 
-- )

-- update Recepcion.DocumentoRecibido set complete = 0 where idDocumento in (
 
-- 3322,
--5795,
--5796,
--5797,
--5798
-- )

--select idDocumento, ltrim(rtrim(replace(fechaEmision, '/', '-'))) as fechaEmision into #temp from Recepcion.DocumentoRecibido order by idDocumento

----INSERT INTO @tmp(idDocumento)
--select idDocumento, fechaEmision, converT(int, SUBSTRING(fechaEmision, 1,2)) 
--, converT(int, SUBSTRING(fechaEmision, 4,2)) 
--from #temp 
----WHERE --converT(int, SUBSTRING(fechaEmision, 1,2)) <= 12
----CONVERT(DATETIME2, fechaEmision, 101) BETWEEN CAST('2020-02-05T05:00:00.000Z' AS date) AND  CAST('2023-03-07T04:59:59.999Z' AS date)


--ORDER BY SUBSTRING(fechaEmision, 10,6) DESC
--, converT(int, SUBSTRING(fechaEmision, 4,2)) desc
--,converT(int, SUBSTRING(fechaEmision, 1,2)) asc
----where


--update 



------select TOP 2 * from Recepcion.DocumentoRecibido where idDocumento not in ((select idDocumento from @tmp))

------select * from @tmp
--drop table #temp

--select * from @tmp

--select idDocumento from Recepcion.DocumentoRecibido where convert(datetime, fechaEmision, 103) != convert(datetime, fechaEmision, 103)

--declare @tmp AS TABLE(idDocumento INT, fechaEmision datetime2)

--insert into @tmp(idDocumento, fechaEmision)
--select idDocumento, CONVERT(datetime2, fechaEmision, 101) from Recepcion.DocumentoRecibido where idDocumento IN (
--6289,
--6079,
--6135,
--6272,
--6131,
--6219,
--6129,
--6081,
--6091,
--6306,
--6124,
--6152,
--6174,
--6137,
--6298,
--6294,
--6243,
--6257,
--6104,
--6061,
--6123,
--6281,
--6246,
--6202,
--6122,
--6307,
--6121,
--6115,
--6160,
--6304,
--6300,
--6269,
--6212,
--6299,
--6171,
--6117,
--6144,
--6228,
--6209,
--6293,
--6273,
--6262,
--6287,
--6178,
--6145,
--6168,
--6270,
--6103,
--6253,
--6297,
--6288,
--6286,
--6305,
--6176,
--6186,
--6199,
--6230,
--6227,
--6169,
--6167,
--6175,
--6154,
--6147,
--6148,
--6301,
--6302,
--6087,
--6263,
--6256,
--6276,
--6277,
--6266,
--6259,
--6279,
--6153,
--6142,
--6165,
--6166,
--6235,
--6245,
--6226,
--6216,
--6224,
--6214,
--6206,
--6197,
--6292,
--6282,
--6240,
--6133,
--6134,
--6102,
--6295
--)
--update dr set fechaEmision = t.fechaEmision

--from recepcion.documentoRecibido dr join (
--SELECT idDocumento, CONVERT(VARCHAR, FORMAT(fechaEmision, 'dd/MM/yyyy'), 106) as fechaEmision FROM @tmp ) as t on dr.idDocumento = t.idDocumento



DECLARE @infoRentecion TABLE(
idDocumento INT, 
	fechaEmision VARCHAr(50)
) 

--INSERT INTO @infoRentecion (idDocumento,fechaEmision) 
--SELECT ci.idDocumento, 
--CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante')))).query('/comprobante/comprobanteRetencion/infoCompRetencion').value('(/infoCompRetencion/fechaEmision)[1]','varchar(50)')
--FROM Recepcion.DocumentoRecibido ci 
--where LEN(LTRIM(RTRIM(convert(varchar(max), xmlDoc)))) > 0
--AND codDoc = '07'

--INSERT INTO @infoRentecion (idDocumento,fechaEmision) 
--SELECT ci.idDocumento, 
--CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante')))).query('/comprobante/notaCredito/infoNotaCredito').value('(/infoNotaCredito/fechaEmision)[1]','varchar(50)')
--FROM Recepcion.DocumentoRecibido ci 
--where LEN(LTRIM(RTRIM(convert(varchar(max), xmlDoc)))) > 0
--AND codDoc = '04'

--INSERT INTO @infoRentecion (idDocumento,fechaEmision) 
--SELECT ci.idDocumento, 
--CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), ci.xmlDoc.query('/autorizacion/comprobante')))).query('/comprobante/factura/infoFactura').value('(/infoFactura/fechaEmision)[1]','varchar(50)')
--FROM Recepcion.DocumentoRecibido ci with (nolock)
--where LEN(LTRIM(RTRIM(convert(varchar(max), xmlDoc)))) > 0
--AND codDoc = '01'

--INSERT INTO @headerRetencion 
--SELECT 
--idDocumento
--   ,fechaEmision = x.y.value('(//infoCompRetencion/fechaEmision)[1]','varchar(150)')
  
--from @infoRentecion t
--CROSS APPLY t.xmlInfoRentecion.nodes('//comprobante/comprobanteRetencion') x(y)

--update dr set dr.fechaEmision = t.fechaEmision
 
-- --select t.fe
-- from recepcion.documentoRecibido dr with (nolock)
-- join (select iii.idDocumento, iii.fechaEmision from @infoRentecion iii ) as t on dr.idDocumento = t.idDocumento


select * from Recepcion.DocumentoRecibido where codEstab = 'ESTAB-000000069'