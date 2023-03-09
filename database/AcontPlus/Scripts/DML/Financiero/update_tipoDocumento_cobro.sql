use [AcontPlus]
go

--select * from dbo.TipoDocumento where codigoSri = '04'

--select * from dbo.TipoDocumento where codigo = 'RV'
--SELECT * FROM dbo.TipoDocumento where codigoSri = '07'


--update Cobro set idTipoDocumento = 8 where idTipoDocumento = 16


SELECT c.idComprobante,td.codigoSri,td.codigo 
FROM dbo.Cobro c WITH (NOLOCK)
INNER JOIN dbo.TipoDocumento     td  WITH (NOLOCK) ON td.idTipoDocumento      = c.idTipoDocumento
INNER JOIN dbo.EntidadFinanciera ef  WITH (NOLOCK) ON ef.idEntidadFinanciera  = c.idEntidadFinanciera
INNER JOIN dbo.ComprobanteIngreso ci WITH (NOLOCK) ON ci.idComprobanteIngreso = c.idComprobanteIngreso
WHERE ef.codigo = 'DOC' AND ci.estado = 1


--UPDATE c SET	
--	c.idComprobante = de.idDocumentoElectronico
--FROM dbo.Cobro c 
--INNER JOIN dbo.TipoDocumento td ON td.idTipoDocumento = c.idTipoDocumento
--INNER JOIN dbo.EntidadFinanciera ef ON ef.idEntidadFinanciera = c.idEntidadFinanciera
--INNER JOIN dbo.DocumentoElectronico de ON de.idDocumento = c.idComprobante and de.codDoc = '04'
--WHERE ef.codigo = 'DOC' and td.codigoSri = '04'
