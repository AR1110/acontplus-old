use [Acontplus]
go

--ALTER TABLE LiquidacionCompra DROP CONSTRAINT [FK__Liquidaci__idTip__1CFC3D38]
--ALTER TABLE LiquidacionCompra DROP CONSTRAINT [FK__Liquidaci__idTip__25D17A5B]
--ALTER TABLE LiquidacionCompra DROP CONSTRAINT [FK__Liquidaci__idTip__4397B2C3]
--ALTER TABLE LiquidacionCompra DROP CONSTRAINT [FK__Liquidaci__idTip__26C59E94]

--ALTER TABLE LiquidacionCompra ADD FOREIGN KEY (idTipoDocumento) REFERENCES dbo.TipoDocumento(idTipoDocumento)

--ALTER TABLE LiquidacionCompra ALTER COLUMN idTipoIva INT NULL
--ALTER TABLE LiquidacionCompra ALTER COLUMN idTipoAmbiente INT NULL
--ALTER TABLE LiquidacionCompra ALTER COLUMN idTipoContribuyente INT NULL

--ALTER TABLE LiquidacionCompra ADD ambiente VARCHAR(5)
--ALTER TABLE LiquidacionCompra ADD codigoPorcentaje VARCHAR(5)
--ALTER TABLE LiquidacionCompra ADD tarifa DECIMAL(15,5)

--UPDATE lc SET	
--	lc.ambiente = ta.codigo
--   ,codigoPorcentaje = '2'
--   ,tarifa = 12
--FROM dbo.LiquidacionCompra lc 
--INNER JOIN dbo.TipoAmbiente ta ON ta.idTipoAmbiente = lc.idTipoAmbiente


--ALTER TABLE LiquidacionCompra ALTER COLUMN ambiente VARCHAR(5) NOT NULL
--ALTER TABLE LiquidacionCompra ALTER COLUMN codigoPorcentaje VARCHAR(5) NOT NULL
--ALTER TABLE LiquidacionCompra ALTER COLUMN tarifa DECIMAL(15,5) NOT NULL

select * from dbo.liquidacioncompra