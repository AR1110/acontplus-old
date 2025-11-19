USE Acontplus
go 

--UPDATE oi set oi.ItemId = (
--                            select top 1 it.Id from Restaurant.Item it where it.ProductId = me.ProductId
--                          )
--from Restaurant.OrderItem  oi
--inner join Restaurant.Menu me on me.Id = oi.MenuId
--where ItemId is null

--alter table Restaurant.[Order] drop constraint fk_estab_order

--> FK para detalles de las ordenes
--ALTER TABLE Restaurant.OrderDetail ADD CONSTRAINT FK_OrderDetail_Tarifa_FeeId FOREIGN KEY(FeeId) REFERENCES dbo.Tarifa(idTarifa)

--ALTER TABLE Restaurant.OrderDetail ADD CONSTRAINT FK_OrderDetail_TarifaImpuesto_TaxPercentId FOREIGN KEY(TaxPercentId) REFERENCES Sri.TarifaImpuesto(idTarifaImpuesto)

--ALTER TABLE Restaurant.OrderDetail ADD CONSTRAINT FK_OrderDetail_Medida_MeasureId FOREIGN KEY([MeasureId]) REFERENCES dbo.Medida(idMedida)

--ALTER TABLE Restaurant.OrderDetail ADD CONSTRAINT FK_OrderDetail_Bodega_WarehouseId FOREIGN KEY([WarehouseId]) REFERENCES dbo.Bodega(idBodega)

--> MIGRACION DE INFORMACION DEL DETALLE DE LAS ORDENES

--INSERT INTO Restaurant.OrderDetail
--(
--      OrderId
--      ,ItemId
--      ,TaxPercentId
--      ,FeeId
--      ,WarehouseId
--      ,MeasureId
--      ,TaxValue,Quantity
--      ,UnitPrice
--      ,SalePrice
--      ,Discount
--      ,Total
--      ,Obs
--      ,IsPaid
--      ,RemainingQuantity
--      ,CreatedAt
--      ,UpdatedAt
--      ,CreatedByUserId
--      ,IsActive
--      ,IsDeleted
--      ,DiscountPercent
--      ,Subtotal
--      ,Status
--)

--select OrderId
--      ,ItemId
--      ,TaxPercentId
--      ,FeeId
--      ,WarehouseId
--      ,MeasureId
--      ,TaxValue,Quantity
--      ,UnitPrice
--      ,SalePrice
--      ,Discount
--      ,Total
--      ,Obs
--      ,ISNULL(IsPaid,0)
--      ,RemainingQuantity
--      ,CreatedAt
--      ,UpdatedAt
--      ,CreatedByUserId
--      ,IsActive
--      ,IsDeleted
--      ,DiscountPercent
--      ,Subtotal
--      ,Status
--from Restaurant.OrderItem

--> Eliminacion de ordenes con customercompany = 0 

--DELETE FROM Restaurant.[Order] where CustomerCompanyId = 0

--> Migraacion y validacion de la tabla order fk

--ALTER TABLE Restaurant.[Order] ADD CONSTRAINT FK_Order_Cliente_CustomerCompanyId FOREIGN KEY(CustomerCompanyId) REFERENCES dbo.Cliente(idCliente)

--ALTER TABLE Restaurant.[Order] DROP CONSTRAINT [fk_ptoEmi_order]

--ALTER TABLE Restaurant.[Order] ADD CONSTRAINT FK_Order_PuntoEmision_PuntoEmisionId FOREIGN KEY(PuntoEmisionId) REFERENCES dbo.PuntoEmision(idPuntoEmision)

SELECT * FROM Restaurant.[Order]
