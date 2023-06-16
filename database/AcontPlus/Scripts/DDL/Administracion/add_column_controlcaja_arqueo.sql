use [AcontPlus]
GO 

--alter table dbo.ControlCaja add arqueoCaja VARCHAR(MAX) DEFAULT '[]'
declare @table as table (
	 idControlCaja INT UNIQUE NOT NULL
	,arqueoCaja varchar(max) not null
)

insert into @table(idControlCaja,arqueoCaja)
SELECT idControlCaja 
      ,arqueoCaja = ISNULL((select da.idMoneda,mo.descripcion,da.cantidad from DetalleArqueoCaja da WITH (NOLOCK) INNER JOIN dbo.Moneda mo on mo.idMoneda = da.idMoneda where da.idControlCaja =  cc.idControlCaja for json path),'[]')

FROM dbo.ControlCaja cc

update cc set
	cc.arqueoCaja = t.arqueoCaja
from dbo.ControlCaja cc 
inner join @table t on t.idControlCaja = cc.idControlCaja

--select * from @table

SELECT * FROM dbo.ControlCaja

