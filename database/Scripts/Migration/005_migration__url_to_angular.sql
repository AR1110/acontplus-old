USE ACONTPLUS 
--CONFIGURACION 
--SELECT * FROM AcontplusAdmin.Config.Menu WHERE Code='VET'
--SELECT mm.* FROM AcontplusAdmin.Config.Menu m
--INNER JOIN AcontplusAdmin.Config.Menu mm ON mm.ParentId = m.Id
--WHERE m.Code='CFG'

--PARENT CONFIG
--UPDATE AcontplusAdmin.Config.Menu SET Url='config' WHERE  Code='CFG'

--CHILDREN
--UPDATE AcontplusAdmin.Config.Menu SET Url='general-config' WHERE Code='CONG'
--UPDATE AcontplusAdmin.Config.Menu SET Url='doc-config' WHERE Code='COND'
--UPDATE AcontplusAdmin.Config.Menu SET Url='user-customer' WHERE Code='USU'
--UPDATE AcontplusAdmin.Config.Menu SET Url='establishment' WHERE Code='SUC'
--UPDATE AcontplusAdmin.Config.Menu SET Url='company' WHERE Code='ENT'
--UPDATE AcontplusAdmin.Config.Menu SET Url='printer' WHERE Code='CI'
--UPDATE AcontplusAdmin.Config.Menu SET Url='credit-time' WHERE Code='TIE'
--UPDATE AcontplusAdmin.Config.Menu SET Url='electronic-signature' WHERE Code='FIR'
--UPDATE AcontplusAdmin.Config.Menu SET Url='warehouse' WHERE Code='BOD'
--UPDATE AcontplusAdmin.Config.Menu SET Url='shift' WHERE Code='FIR'

--VET
--UPDATE AcontplusAdmin.Config.Menu SET Url='vet' WHERE  Code='VET'
--select * from  AcontplusAdmin.Config.Menu WHERE parentId = 1
--UPDATE AcontplusAdmin.Config.Menu SET Url='stats' WHERE  Code='AVE'
--UPDATE AcontplusAdmin.Config.Menu SET Url='pets' WHERE  Code='MAS'
--UPDATE AcontplusAdmin.Config.Menu SET Url='breeds' WHERE  Code='RAZ'
--UPDATE AcontplusAdmin.Config.Menu SET Url='medical-history' WHERE  Code='REG'

--ALMACEN
--select * from  AcontplusAdmin.Config.Menu WHERE Code='AL'
--select * from  AcontplusAdmin.Config.Menu WHERE parentId = 7
--UPDATE AcontplusAdmin.Config.Menu SET Url='inventory' WHERE  Code='AL' 
--UPDATE AcontplusAdmin.Config.Menu SET Url='products' WHERE  Code='ART'
--UPDATE AcontplusAdmin.Config.Menu SET Url='tags' WHERE  Code='ETI'



--Almacen
DECLARE @AlmacenCode VARCHAR(10) = 'AL'
DECLARE @AlmacenParentId INT

SELECT @AlmacenParentId = Id FROM AcontplusAdmin.Config.Menu WHERE Code=@AlmacenCode 
select * from  AcontplusAdmin.Config.Menu WHERE Code=@AlmacenCode 

SELECT *
FROM AcontplusAdmin.Config.Menu
WHERE ParentId IN (
    SELECT Id
    FROM AcontplusAdmin.Config.Menu
    WHERE Code = @AlmacenCode
);
UPDATE AcontplusAdmin.Config.Menu SET Url='subcategories' WHERE  Code='SUBF'

--Inventario
--select * from  AcontplusAdmin.Config.Menu WHERE Code='INV'
--select * from  AcontplusAdmin.Config.Menu WHERE parentId = 13 
--UPDATE AcontplusAdmin.Config.Menu SET Url='kardex' WHERE  Code='KAR'
--UPDATE AcontplusAdmin.Config.Menu SET Url='inventory-adjustments' WHERE  Code='CINV'


--CONTABILIDAD
--select * from  AcontplusAdmin.Config.Menu WHERE Code='AWC'
--select * from  AcontplusAdmin.Config.Menu WHERE parentId = 15
--UPDATE AcontplusAdmin.Config.Menu SET Url='accounting' WHERE  Code='AWC'
--UPDATE AcontplusAdmin.Config.Menu SET Url='cashboxes', ParentId=15 WHERE  Code='CAJ'
--UPDATE AcontplusAdmin.Config.Menu SET Url='medical-history' WHERE  Code='REG'

--REPORTES
--INSERT INTO AcontplusAdmin.Config.Menu (AplicacionId, Code, Icon, Order, Url) VALUES(1,'REP','Reportes','' )

--RESTAURANTE
--select * from  AcontplusAdmin.Config.Menu WHERE Code='REST'
--select * from  AcontplusAdmin.Config.Menu WHERE parentId = 6

--UPDATE AcontplusAdmin.Config.Menu SET Url='restaurant' WHERE  Code='REST'
--UPDATE AcontplusAdmin.Config.Menu SET Url='infrastructure' WHERE  Code='RINF'
--UPDATE AcontplusAdmin.Config.Menu SET Url='products' WHERE  Code='RPRO'


--Facturacion
DECLARE @FactElectCode VARCHAR(10) = 'FE'
DECLARE @FactElectParentId INT

SELECT @FactElectParentId = Id FROM AcontplusAdmin.Config.Menu WHERE Code=@FactElectCode 
--select * from  AcontplusAdmin.Config.Menu WHERE Code=@FactElectCode 

--SELECT *
--FROM AcontplusAdmin.Config.Menu
--WHERE ParentId IN (
--    SELECT Id
--    FROM AcontplusAdmin.Config.Menu
--    WHERE Code = @FactElectCode
--);



--UPDATE AcontplusAdmin.Config.Menu SET Url='billing' WHERE  Code='FE'
--UPDATE AcontplusAdmin.Config.Menu SET Url='ats' WHERE  Code='ATS'
--UPDATE AcontplusAdmin.Config.Menu SET Url='doc-elects' WHERE  Code='AUTH'
--UPDATE AcontplusAdmin.Config.Menu SET Url='fact-elect-report' WHERE  Code='FE-R'
--UPDATE AcontplusAdmin.Config.Menu SET Url='invoices', ParentId=@FactElectParentId WHERE  Code='FV'
 


--Ventas
--DECLARE @SaleCode VARCHAR(10) = 'GV'
--select * from  AcontplusAdmin.Config.Menu WHERE Code=@SaleCode 

--SELECT *
--FROM AcontplusAdmin.Config.Menu
--WHERE ParentId IN (
--    SELECT Id
--    FROM AcontplusAdmin.Config.Menu
--    WHERE Code = @SaleCode
--);



--UPDATE AcontplusAdmin.Config.Menu SET Url='sales' WHERE  Code=@SaleCode
--UPDATE AcontplusAdmin.Config.Menu SET Url='delivery-notes' WHERE  Code='NE'
--UPDATE AcontplusAdmin.Config.Menu SET Url='proforma-invoices' WHERE  Code='PF'



--Compras
DECLARE @PurchaseCode CHAR(2) = 'GC', @PurchaseParentId INT, @importacionParentId INT
select * from  AcontplusAdmin.Config.Menu WHERE Code = @PurchaseCode--ParentId IS NULL AND Code LIKE '%C' 
 
SELECT @PurchaseParentId = Id FROM AcontplusAdmin.Config.Menu WHERE Code=@PurchaseCode 
SELECT * FROM AcontplusAdmin.Config.Menu WHERE ParentId=@PurchaseParentId

--SELECT *
--FROM AcontplusAdmin.Config.Menu
--WHERE ParentId IN (
--    SELECT Id
--    FROM AcontplusAdmin.Config.Menu
--    WHERE Code = @SaleCode
--);


SELECT @importacionParentId=Id FROM AcontplusAdmin.Config.Menu WHERE Code ='IMP'
SELECT * FROM AcontplusAdmin.Config.Menu WHERE ParentId=@importacionParentId
UPDATE AcontplusAdmin.Config.Menu SET Url='purchases' WHERE  Code=@PurchaseCode
UPDATE AcontplusAdmin.Config.Menu SET Url='received-documents', ParentId = @PurchaseParentId WHERE  Code='IMP-I'
--UPDATE AcontplusAdmin.Config.Menu SET Url='delivery-notes' WHERE  Code='NE'
--UPDATE AcontplusAdmin.Config.Menu SET Url='proforma-invoices' WHERE  Code='PF'


