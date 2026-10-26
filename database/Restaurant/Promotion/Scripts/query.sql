use [Acontplus]
go 



--update Dia set diaSemana = 1 where idDia = 7 
--update Dia set diaSemana = 2 where idDia = 1 
--update Dia set diaSemana = 3 where idDia = 2
--update Dia set diaSemana = 4 where idDia = 3
--update Dia set diaSemana = 5 where idDia = 4
--update Dia set diaSemana = 6 where idDia = 5
--update Dia set diaSemana = 7 where idDia = 6

--select * from Dia order by diaSemana asc

--> NUEVA TABLE PARA RELACIONAR LOS DETALLES DE LA PROMOCION Y FK

--DELETE FROM Restaurant.Promotion WHERE EstablishmentId = 0

--ALTER TABLE Restaurant.Promotion ADD CONSTRAINT FK_Promotion_Establecimiento_EstablishmentId FOREIGN KEY(EstablishmentId) REFERENCES Sri.Establecimiento(idEstablecimiento)

--ALTER TABLE Restaurant.PromotionDetail ADD CONSTRAINT FK_PromotionDetail_Tarifa_FeeId FOREIGN KEY(FeeId) REFERENCES dbo.Tarifa(idTarifa)

--ALTER TABLE Restaurant.PromotionDetail ADD CONSTRAINT FK_PromotionDetail_TarifaImpuesto_TaxId FOREIGN KEY([TaxId]) REFERENCES Sri.TarifaImpuesto(idTarifaImpuesto)

--ALTER TABLE Restaurant.PromotionDetail ADD CONSTRAINT FK_PromotionDetail_Medida_MeasureId FOREIGN KEY([MeasureId]) REFERENCES dbo.Medida(idMedida)

--insert into [Restaurant].[PromotionDetail] 
--        (
--             PromotionId
--            ,ItemId
--            ,FeeId
--            ,TaxId
--            ,[MeasureId]
--            ,[RequiredQuantity]
--            ,[UnitPrice]
--            ,[PromotionalPrice]
--            ,[DiscountPercent]
--            ,[Discount]
--            ,[Subtotal]
--            ,CreatedAt
--            ,CreatedByUserId
--            ,UpdatedAt
--            ,UpdatedByUserId
--            ,IsActive
--            ,IsDeleted
--            ,IsMobileRequest
--        )
--SELECT pm.PromotionId
--      ,(SELECT it.Id FROM Restaurant.Item it WHERE it.ProductId = ar.idArticulo)                     as ItemId
--      ,ta.idTarifa                                                                                   as FeeId
--      ,(select it.idTarifaImpuesto from Sri.TarifaImpuesto it where it.codigo = ti.codigoPorcentaje) as TaxId
--      ,ar.idMedida                                                                                   as [MeasureId]
--      ,1                                                                                             as [Quantity]
--      ,ap.precioVenta                                                                                as [Price]
--      ,ar.precioCosto                                                                                as [CostPrice]
--      ,0 as [DiscountPercent]
--      ,0 as [Discount]
--      ,1 * ap.precioVenta                                                                            as [Subtotal]
--      ,pm.CreatedAt
--      ,pm.CreatedByUserId
--      ,pm.UpdatedAt
--      ,pm.UpdatedByUserId
--      ,pm.IsActive
--      ,pm.IsDeleted
--      ,pm.IsMobileRequest
--FROM Restaurant.PromotionMenu pm
--inner join Restaurant.Menu    me on me.Id         = pm.MenuId
--INNER JOIN dbo.Articulo       ar ON ar.idArticulo = me.ProductId
--INNER JOIN dbo.ArticuloPvP    ap ON ap.idArticulo = ar.idArticulo
--inner join dbo.TipoIva        ti ON ti.idTipoIva  = ar.idTipoIva
--inner join dbo.Tarifa         ta on ta.idTarifa   = ap.idTarifa
--WHERE ta.codigo = 1
--order by ar.idArticulo asc


--select* from dbo.tarifa where idEntidad = 1

--update dbo.Tarifa set codigo = 4 where idTarifa = 6 
--update dbo.Tarifa set codigo = 5 where idTarifa = 7
--WHERE ta.codigo = 1


--select * from Restaurant.PromotionDetail



