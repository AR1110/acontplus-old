USE ACONTPLUS
set language spanish
SELECT idDocumento, CONVERT(datetime, fechaEmision, 103), CONVERT(datetime2, fechaAutorizacion, 103) FROM Recepcion.DocumentoRecibido 
--WHERE 
--CAST(fechaRegistro AS date) = CAST(GETDATE() AS date)
ORDER BY idDocumento DESC

--select *,
-- CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), xmlDoc.query('/autorizacion')))).value('(/autorizacion/fechaAutorizacion)[1]','VARCHAR(49)')
--,
--CONVERT(DATETIME,
--CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), xmlDoc.query('/autorizacion/comprobante')))).query('/comprobante/comprobanteRetencion/infoCompRetencion').value('(/infoCompRetencion/fechaEmision)[1]','VARCHAR(49)')
--,103)

--UPDATE dr SET 
--dr.fechaAutorizacion =
--CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), xmlDoc.query('/autorizacion')))).value('(/autorizacion/fechaAutorizacion)[1]','VARCHAR(49)')

----,dr.fechaEmision =   CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), xmlDoc.query('/autorizacion/comprobante')))).query('/comprobante/comprobanteRetencion/infoCompRetencion').value('(/infoCompRetencion/fechaEmision)[1]','VARCHAR(49)')
 

--FROM Recepcion.DocumentoRecibido dr
--where xmlDoc is not null

--

 

