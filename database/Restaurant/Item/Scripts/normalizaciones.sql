USE [Acontplus]
go 


--> Migracion de menus a la table item
--INSERT INTO Restaurant.Item
--      ([ProductId], [Summary], [Cooking], [Recipe], [Instructions], [Content], [CreatedAt], [UpdatedAt], [Unit], [CreatedByUserId], [DeletedAt], [DeletedByUserId], [IsActive], [IsDeleted], [UpdatedByUserId], [CreatedBy], [DeletedBy], [ForPromotion], [IsMobileRequest], [Quantity], [Title], [UpdatedBy])
--SELECT [ProductId], [Summary], 0, NULL, NULL                      , [Content], [CreatedAt], [UpdatedAt], NULL  , [CreatedByUserId], [DeletedAt], [DeletedByUserId], [IsActive], [IsDeleted], [UpdatedByUserId], [CreatedBy], [DeletedBy], [ForPromotion], [IsMobileRequest], NULL      , [Title], [UpdatedBy]
--FROM Restaurant.Menu


--> Migracion de ingredientes a la table item
--INSERT INTO Restaurant.Item
--      ([ProductId], [Summary], [Cooking], [Recipe], [Instructions], [Content], [CreatedAt], [UpdatedAt], [Unit], [CreatedByUserId], [DeletedAt], [DeletedByUserId], [IsActive], [IsDeleted], [UpdatedByUserId], [CreatedBy], [DeletedBy], [ForPromotion], [IsMobileRequest], [Quantity], [Title], [UpdatedBy])
--SELECT [ProductId], [Summary], 0, NULL, NULL                      , [Content], [CreatedAt], [UpdatedAt], NULL  , [CreatedByUserId], [DeletedAt], [DeletedByUserId], [IsActive], [IsDeleted], [UpdatedByUserId], [CreatedBy], [DeletedBy], 0             , [IsMobileRequest], NULL      , null   , [UpdatedBy]
--FROM Restaurant.Ingredient

--select it.Id ,it.Summary ,it.Title ,fa.siglas ,fa.descripcion
--from Restaurant.Item      it
--inner join dbo.Articulo   ar on ar.idArticulo   = it.ProductId
--inner join dbo.SubFamilia sf on sf.idSubFamilia = ar.idSubFamilia
--inner join dbo.Familia    fa on fa.idFamilia    = sf.idFamilia
--WHERE fa.siglas in ('RES' ,'POR', 'ING' ,'COM')
--order by fa.descripcion


--> Foreign key para la nueva tabla de detalles

--ALTER TABLE Restaurant.ItemComposition ADD CONSTRAINT FK_ItemComposition_Tarifa_idTarifa FOREIGN KEY(FeeId) REFERENCES dbo.Tarifa(idTarifa)

--ALTER TABLE Restaurant.ItemComposition ADD CONSTRAINT FK_ItemComposition_TarifaImpuesto_idTarifaImpuesto FOREIGN KEY([TaxId]) REFERENCES Sri.TarifaImpuesto(idTarifaImpuesto)

--ALTER TABLE Restaurant.ItemComposition ADD CONSTRAINT FK_ItemComposition_Medida_idMedida FOREIGN KEY([MeasureId]) REFERENCES dbo.Medida(idMedida)

--alter table Restaurant.ItemComposition drop constraint FK_ItemComposition_Tarifa_idTarifa
--alter table Restaurant.ItemComposition drop constraint FK_ItemComposition_TarifaImpuesto_idTarifaImpuesto
--alter table Restaurant.ItemComposition drop constraint FK_ItemComposition_Medida_idMedida

--INSERT INTO Restaurant.ItemComposition
--     (
--       ItemId
--      ,ChildItemId
--      ,Quantity
--      ,Subtotal
--      ,Price
--      ,Instructions
--      ,Weight
--      ,NetWeight
--      ,ExtentId
--      ,CostPrice
--      ,CreatedAt
--      ,UpdatedAt
--      ,CreatedByUserId
--      ,IsActive
--      ,IsOptional
--      ,IsDeleted
--     )
--select re.ItemId
--      ,(SELECT it.Id FROM Restaurant.Item it WHERE it.ProductId = ig.ProductId) as [ChildItemId]
--      ,re.Quantity
--      ,0
--      ,0
--      ,re.Instructions
--      ,re.Weight
--      ,re.NetWeight
--      ,re.ExtentId
--      ,re.CostPrice
--      ,re.CreatedAt
--      ,re.UpdatedAt
--      ,re.CreatedByUserId
--      ,re.IsActive
--      ,0
--      ,re.IsDeleted
--from Restaurant.Recipe           re
--INNER JOIN Restaurant.Ingredient ig ON ig.Id = re.IngredientId

--INSERT INTO Restaurant.ItemComposition

--    (
--       ItemId
--      ,ChildItemId
--      ,FeeId
--      ,TaxId
--      ,[MeasureId]
--      ,Quantity
--      ,Discount
--      ,DiscountPercent
--      ,CostPrice
--      ,Price
--      ,Subtotal
--      ,CreatedAt
--      ,UpdatedAt
--      ,CreatedByUserId
--      ,IsActive
--      ,IsDeleted
--      ,IsMobileRequest
--      ,IsOptional
--    )

--SELECT (SELECT it.Id FROM Restaurant.Item it WHERE it.ProductId = me.ProductId)                       as ItemId
--      ,mi.ItemId                                                                                      as ChildItemId
--      ,mi.FeeId
--      ,(SELECT im.idTarifaImpuesto FROM Sri.TarifaImpuesto im WHERE im.codigo =  ti.codigoPorcentaje) as TaxId
--      ,ar.idMedida                                                                                    as [MeasureId]
--      ,mi.Quantity
--      ,mi.DiscountValue
--      ,mi.DiscountPercent
--      ,ar.precioCosto                                                                                 as CostPrice
--      ,ar.precioCosto                                                                                 as Price
--      ,mi.Subtotal
--      ,mi.CreatedAt
--      ,mi.UpdatedAt
--      ,mi.CreatedByUserId
--      ,mi.IsActive
--      ,mi.IsDeleted
--      ,mi.IsMobileRequest
--      ,0
--FROM Restaurant.MenuItem   mi
--INNER JOIN Restaurant.Menu me ON me.Id         = mi.MenuId
--INNER JOIN Restaurant.Item it ON it.Id         = mi.ItemId
--INNER JOIN dbo.Articulo    ar ON ar.idArticulo = it.ProductId
--INNER JOIN dbo.TipoIva     ti ON ti.idTipoiva  = ar.idTipoIva

select * from Restaurant.ItemComposition

