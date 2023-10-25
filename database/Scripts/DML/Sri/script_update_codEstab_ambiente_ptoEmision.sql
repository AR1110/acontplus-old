DECLARE @table TABLE
(
	idPuntoEmision INT UNIQUE 
   ,codEstab VARCHAR(20) NOT NULL
   ,ambiente VARCHAR(5) NOT NULL
)

insert into @table (idPuntoEmision,codEstab,ambiente)
SELECT idPuntoEmision
	  ,codEstab = s.codEstab
	  ,ambiente =CAST( ta.codigo AS varchar)
FROM
dbo.PuntoEmision pe
INNER JOIN dbo.Sucursal s ON s.idSucursal = pe.idSucursal
INNER JOIN dbo.Entidad e ON e.idEntidad = s.idEntidad
inner join DBO.TipoAmbiente ta ON TA.idTipoAmbiente = pe.idTipoAmbiente

select * from @table
 
update pe SET 
	pe.codEstab = t.codEstab
   ,pe.ambiente = t.ambiente
   ,pe.usuario = 'sheylapb'
from PuntoEmision pe 
inner join @table t ON t.idPuntoEmision = pe.idPuntoEmision