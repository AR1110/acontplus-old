USE [Acontplus]
go 


--> Migracion de menus a la table item
--INSERT INTO Restaurant.Item
--      ([ProductId], [Summary], [CreatedAt], [UpdatedAt], [CreatedByUserId], [DeletedAt], [DeletedByUserId], [IsActive], [IsDeleted], [UpdatedByUserId], [CreatedBy], [DeletedBy], [IsMobileRequest], [UpdatedBy])
--SELECT [ProductId], [Summary], [CreatedAt], [UpdatedAt], [CreatedByUserId], [DeletedAt], [DeletedByUserId], [IsActive], [IsDeleted], [UpdatedByUserId], [CreatedBy], [DeletedBy], [IsMobileRequest], [UpdatedBy]
--FROM Restaurant.Menu


--> Migracion de ingredientes a la table item
--INSERT INTO Restaurant.Item
--      ([ProductId], [Summary], [CreatedAt], [UpdatedAt], [CreatedByUserId], [DeletedAt], [DeletedByUserId], [IsActive], [IsDeleted], [UpdatedByUserId], [CreatedBy], [DeletedBy], [IsMobileRequest], [UpdatedBy])
--SELECT [ProductId], [Summary], [CreatedAt], [UpdatedAt], [CreatedByUserId], [DeletedAt], [DeletedByUserId], [IsActive], [IsDeleted], [UpdatedByUserId], [CreatedBy], [DeletedBy], [IsMobileRequest], [UpdatedBy]
--FROM Restaurant.Ingredient

--select it.Id ,it.Summary ,fa.siglas ,fa.descripcion
--from Restaurant.Item      it
--inner join dbo.Articulo   ar on ar.idArticulo   = it.ProductId
--inner join dbo.SubFamilia sf on sf.idSubFamilia = ar.idSubFamilia
--inner join dbo.Familia    fa on fa.idFamilia    = sf.idFamilia
--WHERE fa.siglas in ('RES' ,'POR', 'ING' ,'COM')
--order by fa.descripcion


--> Foreign key para la nueva tabla de detalles

--ALTER TABLE Restaurant.ItemComposition ADD CONSTRAINT FK_ItemComposition_Tarifa_idTarifa FOREIGN KEY(FeeId) REFERENCES dbo.Tarifa(idTarifa)

--ALTER TABLE Restaurant.ItemComposition ADD CONSTRAINT FK_ItemComposition_Medida_idMedida FOREIGN KEY([MeasureId]) REFERENCES dbo.Medida(idMedida)

--alter table Restaurant.ItemComposition drop constraint FK_ItemComposition_Tarifa_idTarifa
--alter table Restaurant.ItemComposition drop constraint FK_ItemComposition_Medida_idMedida

--delete from Restaurant.ItemComposition

    --INSERT INTO Restaurant.ItemComposition
    --     (
    --       MeasureId
    --      ,[ParentItemId]
    --      ,ChildItemId
    --      ,Quantity
    --      ,TotalPrice
    --      ,TotalCost
    --      ,SalePrice
    --      ,UnitPrice
    --      ,CreatedAt
    --      ,UpdatedAt
    --      ,CreatedByUserId
    --      ,IsActive
    --      ,IsOptional
    --      ,IsDeleted
    --     )
    --select ar.idMedida
    --      ,re.ItemId                                                                as [ParentItemId]
    --      ,(SELECT top 1 it.Id FROM Restaurant.Item it WHERE it.ProductId = ig.ProductId) as [ChildItemId]
    --      ,re.Quantity                                                              as Quantity
    --      ,re.Quantity * 0                                                          as TotalPrice
    --      ,re.Quantity * CostPrice                                                  as TotalCost
    --      ,0
    --      ,re.CostPrice
    --      ,re.CreatedAt
    --      ,re.UpdatedAt
    --      ,re.CreatedByUserId
    --      ,re.IsActive
    --      ,0
    --      ,re.IsDeleted
    --from Restaurant.Recipe           re
    --INNER JOIN Restaurant.Ingredient ig ON ig.Id = re.IngredientId
    --INNER JOIN dbo.Articulo          ar on ar.idArticulo = ig.ProductId

--INSERT INTO Restaurant.ItemComposition

--    (
--       ParentItemId
--      ,ChildItemId
--      ,FeeId
--      ,[MeasureId]
--      ,Quantity
--      ,UnitPrice
--      ,SalePrice
--      ,TotalCost
--      ,TotalPrice
--      ,CreatedAt
--      ,UpdatedAt
--      ,CreatedByUserId
--      ,IsActive
--      ,IsDeleted
--      ,IsMobileRequest
--      ,IsOptional
--    )

--SELECT (SELECT top 1 it.Id FROM Restaurant.Item it WHERE it.ProductId = me.ProductId)                       as ParentItemId
--      ,mi.ItemId                                                                                      as ChildItemId
--      ,mi.FeeId
--      ,ar.idMedida                                                                                    as [MeasureId]
--      ,mi.Quantity
--      ,ar.precioCosto                                                                                 as UnitPrice
--      ,ar.precioCosto                                                                                 as SalePrice
--      ,Quantity * 0                                                                                   as TotalCost
--      ,Quantity * 0                                                                                   as TotalPrice
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

select * from Restaurant.ItemComposition

