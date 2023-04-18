use acontplus_old
--select *  from PuntoEmision pe INNER JOIN Sri.Establecimiento e ON pe.codEstab = e.codEstab
--where e.ruc = '0101374015001'
--select * from PuntoEmision pe 
--INNER JOIN Sri.Establecimiento e ON pe.codEstab = e.codEstab

--where
--e.ruc = '0101374015001'


DECLARE @tbl AS TABLE (ruc VARCHAR(100),estab VARCHAr(100), ptoEmi VARCHAR(100), codDoc VARCHAR(100), generacionNro INT, ultimaSecuencia INT)

INSERT INTO @tbl(ruc, estab, ptoEmi, codDoc, generacionNro, ultimaSecuencia)

select e.ruc, e.estab, pe.ptoEmi, td.codigo codDoc, generacionNro, ultimaSecuencia from ConfiguracionDocumento c 
INNER JOIN PuntoEmision pe ON c.idPuntoEmision = pe.idPuntoEmision
INNER JOIN Sri.Establecimiento e ON pe.codEstab = e.codEstab
INNER JOIN TipoDocumento td ON c.idTipoDocumento = td.idTipoDocumento where c.idPuntoEmision in (6,
22)

order  by c.idPuntoEmision, td.idTipoDocumento

--select * from @tbl
--UPDATE c SET c.generacionNro = tt.generacionNro, c.ultimaSecuencia = tt.ultimaSecuencia
--select tt.ultimaSecuencia 
--FROM AcontPlus.dbo.ConfiguracionDocumento c 
--INNER JOIN AcontPlus.dbo.PuntoEmision pe ON c.idPuntoEmision = pe.idPuntoEmision
--INNER JOIN AcontPlus.Sri.Establecimiento e ON pe.codEstab = e.codEstab
--INNER JOIN AcontPlus.dbo.TipoDocumento td ON c.idTipoDocumento = td.idTipoDocumento
--INNER JOIN @tbl tt ON e.ruc = tt.ruc AND e.estab = tt.estab AND pe.ptoEmi = tt.ptoEmi AND td.codigo = tt.codDoc

--select * from FactElect.Config_Comprob_Elect