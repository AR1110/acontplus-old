USE AcontPlus

----select * from Recepcion.DocumentoRecibido where codDoc = '04'
--delete from Recepcion.DocumentoRecibido where downloaded = 'NE' and complete = 0
----select * from FactElect.CompImp_Imp_Temp

----select * from FactElect.CompImpDetailTemp

--alter table recepcion.DocumentoRecibido add obs VARCHAR(MAX) NULL

--INSERT INTO Recepcion.DocumentoRecibido(idEstablecimiento, codEstab, comprobante, codDoc, serieComprobante, rucEmisor, razonSocialEmisior, fechaEmision, fechaAutorizacion, tipoEmision, identificacionReceptor, claveAcceso, numeroAutorizacion, importeTotal, idUsuario, fechaRegistro, xmlDoc, complete, downloaded)

--SELECT e.idEstablecimiento, ci.codEstab, comprobante, codDoc, serieComprobante, rucEmisor, razonSocialEmisior, fechaEmision, fechaAutorizacion, tipoEmision, identificacionReceptor, claveAcceso, numeroAutorizacion, importeTotal, idUsuario, ci.fechaRegistro, xmlDoc, complete, CASE WHEN xmlDoc IS NULL THEN 'ND' ELSE 'DE' END 
--FROM FactElect.ComprobanteImportacion ci with (nolock)
--INNER JOIN Sri.Establecimiento e with (nolock) on ci.codEstab = e.codEstab

--select * from FactElect.ComprobanteImportacion  where codEstab is null
--TRUNCATE TABLE Recepcion.DocumentoRecibido


--SELECT * FROM Recepcion.Doc_Detalle_Temp
--SELECT * FROM Recepcion.Doc_Impuesto_Temp
