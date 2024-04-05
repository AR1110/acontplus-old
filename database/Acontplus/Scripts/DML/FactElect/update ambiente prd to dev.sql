use Acontplus
go

--FOR TEST
--select *  from PuntoEmision pe INNER JOIN Sri.Establecimiento e ON pe.codEstab = e.codEstab
--where e.ruc = '0101374015001'
--select * from PuntoEmision pe 
--INNER JOIN Sri.Establecimiento e ON pe.codEstab = e.codEstab

--where
--e.ruc = '0101374015001'


--DECLARE @tbl AS TABLE (ruc VARCHAR(100),estab VARCHAr(100), ptoEmi VARCHAR(100), codDoc VARCHAR(100), generacionNro INT, ultimaSecuencia INT)

--INSERT INTO @tbl(ruc, estab, ptoEmi, codDoc, generacionNro, ultimaSecuencia)

--select e.ruc, e.estab, pe.ptoEmi, td.codigo codDoc, generacionNro, ultimaSecuencia from ConfiguracionDocumento c 
--INNER JOIN PuntoEmision pe ON c.idPuntoEmision = pe.idPuntoEmision
--INNER JOIN Sri.Establecimiento e ON pe.codEstab = e.codEstab
--INNER JOIN TipoDocumento td ON c.idTipoDocumento = td.idTipoDocumento where c.idPuntoEmision in (6,
--22)

--order  by c.idPuntoEmision, td.idTipoDocumento

--select * from @tbl
--UPDATE c SET c.generacionNro = tt.generacionNro, c.ultimaSecuencia = tt.ultimaSecuencia
--select tt.ultimaSecuencia 
--FROM AcontPlus.dbo.ConfiguracionDocumento c 
--INNER JOIN AcontPlus.dbo.PuntoEmision pe ON c.idPuntoEmision = pe.idPuntoEmision
--INNER JOIN AcontPlus.Sri.Establecimiento e ON pe.codEstab = e.codEstab
--INNER JOIN AcontPlus.dbo.TipoDocumento td ON c.idTipoDocumento = td.idTipoDocumento
--INNER JOIN @tbl tt ON e.ruc = tt.ruc AND e.estab = tt.estab AND pe.ptoEmi = tt.ptoEmi AND td.codigo = tt.codDoc

--select * from FactElect.Config_Comprob_Elect
GO


update Acontplus.dbo.puntoemision set ambiente = 1 where ambiente = 2
GO

update Acontplus.Sri.Establecimiento set autoSriAuth = 0
GO

update Acontplus.dbo.DocumentoElectronico set isAutomatic = 0
GO

--UPDATE de SET de.xmlCompressed = NULL
--,de.xmlSri = NULL
----select COUNT(*) 
--FROM dbo.DocumentoElectronico de
--INNER JOIN dbo.puntoEmision pe ON de.idPuntoEmision = pe.idPuntoEmision
--INNER JOIN Sri.Establecimiento e On pe.codEstab = e.codEstab
--INNER JOIN dbo.Entidad en On e.ruc = en.ruc
--WHERE en.idEntidad not in (9,195)

--UPDATE de SET de.xmlCompressed = NULL
--,de.xmlDoc = NULL
----select COUNT(*) 
--FROM Recepcion.DocumentoRecibido de 
--INNER JOIN Sri.Establecimiento e On de.idEstablecimiento = e.idEstablecimiento
--INNER JOIN dbo.Entidad en On e.ruc = en.ruc
--WHERE en.idEntidad not in (9,195)

 