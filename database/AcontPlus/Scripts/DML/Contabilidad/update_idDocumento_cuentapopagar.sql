use [AcontPlus]
go 


update cp set 
		cp.idDocumento =  case cp.codDoc when '03' then (select lc.idLiquidacionCompra from liquidacioncompra lc where lc.uniqueId = cp.uniqueId)
		                               WHEN '01' then (SELECT dr.idDocumento FROM Recepcion.DocumentoRecibido dr WITH (NOLOCK) WHERE dr.claveAcceso = cp.uniqueId)  
		                               WHEN 'DH' then (SELECT di.idDocumentoIngreso FROM compra.Documento_Ingreso di WITH (NOLOCK) WHERE di.uniqueId = cp.uniqueId)  
		                               WHEN 'FC' then (SELECT fc.idFacturaCompra FROM FacturaCompra fc WITH (NOLOCK) WHERE fc.uniqueId = cp.uniqueId)  
					   end 
FROM Contabilidad.CuentaPorPagar cp

update contabilidad.cuentaporpagar set idDocumento = 0 where idDocumento is null