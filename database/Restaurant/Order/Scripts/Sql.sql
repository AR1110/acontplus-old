USE Acontplus
go 



--UPDATE oi set oi.ItemId = (
--                            select top 1 it.Id from Restaurant.Item it where it.ProductId = me.ProductId
--                          )
--from Restaurant.OrderItem  oi
--inner join Restaurant.Menu me on me.Id = oi.MenuId
--where ItemId is null

select * from Restaurant.OrderItem where ItemId is null

