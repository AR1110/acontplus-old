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


select it.Id ,it.Summary ,it.Title ,fa.siglas ,fa.descripcion
from Restaurant.Item      it
inner join dbo.Articulo   ar on ar.idArticulo   = it.ProductId
inner join dbo.SubFamilia sf on sf.idSubFamilia = ar.idSubFamilia
inner join dbo.Familia    fa on fa.idFamilia    = sf.idFamilia
WHERE fa.siglas in ('RES' ,'POR', 'ING' ,'COM')
order by fa.descripcion


