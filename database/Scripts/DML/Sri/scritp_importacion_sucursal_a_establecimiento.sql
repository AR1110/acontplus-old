

--update ec SET 
--	ec.codSubContribuyente = s.codigo
--from Config.EntidadConfigSri ec 
--inner join dbo.SubContribuyente s ON s.idSubContribuyente = ec.idSubContribuyente

INSERT INTO Sri.Establecimiento 
(	
	codEstab
   ,canton
   ,actividad
   ,agenteRetencion
   ,contribuyente
   ,ruc
   ,estab
   ,contribuyenteEspecial
   ,obligadoContabilidad
   ,nombreComercial
   ,dirEstablecimiento
   ,contribuyenteRimpe
   ,fechaRegistro
   ,usuario
   ,estado
)
SELECT 
	codigo =  s.codEstab
   ,canton = '0122'
   ,actividad = '21'
   ,agenteRetencion = IIF(cs.agenteRetencion = '0',NULL,cs.agenteRetencion)
   ,contribuyente = cs.codSubContribuyente
   ,cs.ruc
   ,estab = s.serie
   ,contribuyenteEspecial = NULL
   ,obligadoContabilidad = IIF(cs.obligadoLlevarContabilidad = 1,'SI','NO')
   ,s.nombreComercial
   ,dirEstablecimiento = s.direccion
   ,contribuyenteRimpe = CASE cs.codSubContribuyente WHEN '02' THEN UPPER(tc.descripcion) 
													 WHEN '03' THEN UPPER(tc.descripcion)
													 ELSE NULL
						 END  

  ,s.fechaRegistro
  ,usuario = (SELECT nombreUsuario FROM Usuario WHERE nombreUsuario = 'sheylapb' )
  ,estado = cast(1 as bit)
from Config.EntidadConfigSri cs
INNER JOIN dbo.Sucursal s ON s.idEntidad = cs.idEntidad 
INNER JOIN dbo.SubContribuyente sc ON sc.idSubContribuyente = cs.idSubContribuyente
INNER JOIN dbo.TipoContribuyente tc ON tc.idTipoContribuyente = sc.idTipoContribuyente
ORDER BY s.idSucursal ASC



--SELECT * FROM Sri.Establecimiento