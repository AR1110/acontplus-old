use [Acontplus]
go

--alter table dbo.CobroDetalle add idCuotaPorCobrar INT FOREIGN KEY REFERENCES Contabilidad.CuotaPorCobrar(idCuotaPorCobrar)

-- alter table dbo.CobroDetalle DROP CONSTRAINT  [DF__CobroDeta__token__5F54107A]

--alter table dbo.CobroDetalle DROP COLUMN token

--UPDATE c set	
--	c.idCuotaPorCobrar = cc.idCuotaPorCobrar
--FROM dbo.CobroDetalle c with (nolock)
--inner join Contabilidad.CuotaPorCobrar cc ON cc.idCuotaXCobrar = c.idCuotaXCobrar

--alter table dbo.CobroDetalle ALTER COLUMN idCuotaPorCobrar INT NOT NULL

--alter table dbo.CobroDetalle DROP CONSTRAINT [FK__FacturaCo__idFac__7E42ABEE]

--alter table dbo.CobroDetalle DROP COLUMN [idCuotaXCobrar]


select * from dbo.CobroDetalle