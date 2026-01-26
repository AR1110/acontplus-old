USE ACONTPLUS 
--CONFIGURACION 
--SELECT * FROM Config.Menu WHERE Code='VET'
--SELECT mm.* FROM Config.Menu m
--INNER JOIN Config.Menu mm ON mm.ParentId = m.Id
--WHERE m.Code='CFG'

--PARENT CONFIG
--UPDATE Config.Menu SET Url='config' WHERE  Code='CFG'

--CHILDREN
--UPDATE Config.Menu SET Url='general-config' WHERE Code='CONG'
--UPDATE Config.Menu SET Url='doc-config' WHERE Code='COND'
--UPDATE Config.Menu SET Url='user-customer' WHERE Code='USU'
--UPDATE Config.Menu SET Url='establishment' WHERE Code='SUC'
--UPDATE Config.Menu SET Url='company' WHERE Code='ENT'
--UPDATE Config.Menu SET Url='printer' WHERE Code='CI'
--UPDATE Config.Menu SET Url='credit-time' WHERE Code='TIE'
--UPDATE Config.Menu SET Url='electronic-signature' WHERE Code='FIR'
--UPDATE Config.Menu SET Url='warehouse' WHERE Code='BOD'
--UPDATE Config.Menu SET Url='shift' WHERE Code='FIR'

--VET
--UPDATE Config.Menu SET Url='vet' WHERE  Code='VET'
--select * from  Config.Menu WHERE parentId = 1
--UPDATE Config.Menu SET Url='stats' WHERE  Code='AVE'
--UPDATE Config.Menu SET Url='pets' WHERE  Code='MAS'
--UPDATE Config.Menu SET Url='breeds' WHERE  Code='RAZ'
--UPDATE Config.Menu SET Url='medical-history' WHERE  Code='REG'

--ALMACEN
--select * from  Config.Menu WHERE Code='AL'
--select * from  Config.Menu WHERE parentId = 7
--UPDATE Config.Menu SET Url='inventory' WHERE  Code='AL' 
--UPDATE Config.Menu SET Url='products' WHERE  Code='ART'
--UPDATE Config.Menu SET Url='tags' WHERE  Code='ETI'



--Almacen
DECLARE @AlmacenCode VARCHAR(10) = 'AL'
DECLARE @AlmacenParentId INT

SELECT @AlmacenParentId = Id FROM Config.Menu WHERE Code=@AlmacenCode 
select * from  Config.Menu WHERE Code=@AlmacenCode 

SELECT *
FROM Config.Menu
WHERE ParentId IN (
    SELECT Id
    FROM Config.Menu
    WHERE Code = @AlmacenCode
);
UPDATE Config.Menu SET Url='subcategories' WHERE  Code='SUBF'

--Inventario
--select * from  Config.Menu WHERE Code='INV'
--select * from  Config.Menu WHERE parentId = 13 
--UPDATE Config.Menu SET Url='kardex' WHERE  Code='KAR'
--UPDATE Config.Menu SET Url='inventory-adjustments' WHERE  Code='CINV'


--CONTABILIDAD
--select * from  Config.Menu WHERE Code='AWC'
--select * from  Config.Menu WHERE parentId = 15
--UPDATE Config.Menu SET Url='accounting' WHERE  Code='AWC'
--UPDATE Config.Menu SET Url='cashboxes', ParentId=15 WHERE  Code='CAJ'
--UPDATE Config.Menu SET Url='medical-history' WHERE  Code='REG'

--REPORTES
--INSERT INTO Config.Menu (AplicacionId, Code, Icon, Order, Url) VALUES(1,'REP','Reportes','' )

--RESTAURANTE
--select * from  Config.Menu WHERE Code='REST'
--select * from  Config.Menu WHERE parentId = 6

--UPDATE Config.Menu SET Url='restaurant' WHERE  Code='REST'
--UPDATE Config.Menu SET Url='infrastructure' WHERE  Code='RINF'
--UPDATE Config.Menu SET Url='products' WHERE  Code='RPRO'


--Facturacion
DECLARE @FactElectCode VARCHAR(10) = 'FE'
DECLARE @FactElectParentId INT

SELECT @FactElectParentId = Id FROM Config.Menu WHERE Code=@FactElectCode 
--select * from  Config.Menu WHERE Code=@FactElectCode 

--SELECT *
--FROM Config.Menu
--WHERE ParentId IN (
--    SELECT Id
--    FROM Config.Menu
--    WHERE Code = @FactElectCode
--);



--UPDATE Config.Menu SET Url='billing' WHERE  Code='FE'
--UPDATE Config.Menu SET Url='ats' WHERE  Code='ATS'
--UPDATE Config.Menu SET Url='doc-elects' WHERE  Code='AUTH'
--UPDATE Config.Menu SET Url='fact-elect-report' WHERE  Code='FE-R'
--UPDATE Config.Menu SET Url='invoices', ParentId=@FactElectParentId WHERE  Code='FV'
 


--Ventas
--DECLARE @SaleCode VARCHAR(10) = 'GV'
--select * from  Config.Menu WHERE Code=@SaleCode 

--SELECT *
--FROM Config.Menu
--WHERE ParentId IN (
--    SELECT Id
--    FROM Config.Menu
--    WHERE Code = @SaleCode
--);



--UPDATE Config.Menu SET Url='sales' WHERE  Code=@SaleCode
--UPDATE Config.Menu SET Url='delivery-notes' WHERE  Code='NE'
--UPDATE Config.Menu SET Url='proforma-invoices' WHERE  Code='PF'



--Compras
DECLARE @PurchaseCode CHAR(2) = 'GC', @PurchaseParentId INT, @importacionParentId INT
select * from  Config.Menu WHERE Code = @PurchaseCode--ParentId IS NULL AND Code LIKE '%C' 
 
SELECT @PurchaseParentId = Id FROM Config.Menu WHERE Code=@PurchaseCode 
SELECT * FROM Config.Menu WHERE ParentId=@PurchaseParentId

--SELECT *
--FROM Config.Menu
--WHERE ParentId IN (
--    SELECT Id
--    FROM Config.Menu
--    WHERE Code = @SaleCode
--);


SELECT @importacionParentId=Id FROM Config.Menu WHERE Code ='IMP'
SELECT * FROM Config.Menu WHERE ParentId=@importacionParentId
UPDATE Config.Menu SET Url='purchases' WHERE  Code=@PurchaseCode
UPDATE Config.Menu SET Url='received-documents', ParentId = @PurchaseParentId WHERE  Code='IMP-I'
--UPDATE Config.Menu SET Url='delivery-notes' WHERE  Code='NE'
--UPDATE Config.Menu SET Url='proforma-invoices' WHERE  Code='PF'


