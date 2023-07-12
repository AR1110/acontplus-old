--use [Acontplus]
--go


--CREATE TABLE Customer(
--id INT NOT NULL PRIMARY KEY IDENTITY (1,1)
--,IDType VARCHAR(2) NOT NULL
--,identificacion varchar(25) not null
--,businessName VARCHAR(300) NULL
--,tradeName VARCHAR(300) NULL
--,email VARCHAR(500) NULL
--,telephone VARCHAR(300) NULL
--,address varchar(500) null
--,SriValidation BIT NULL
--)

----select count(*) from Customer


--GO

--declare @catalogoClientes as table (
--     origen varchar(5) not null
--    ,IDCard varchar(25) not null
--    ,tipoIdentificacion VARCHAR(5) NOT NULL 
--	,businnesName VARCHAR(300) NULL
--	,tradeName VARCHAR(300) NULL
--	,email VARCHAR(500) NULL
--	,telephone VARCHAR(300) NULL
--	,address varchar(500) null
--	,SriValidation BIT NULL
--)



--insert into @catalogoClientes (origen,IDCard,tipoIdentificacion, businnesName, tradeName, email, telephone, address, SriValidation)
--select 'cl',numeroIdentificacion,ti.codigoSri, cl.nombreFiscal, cl.nombreComercial, cl.correo, cl.telefono, cl.direccion, validationSri
--from dbo.Cliente cl WITH(NOLOCK)
--inner join dbo.TipoIdentificacion ti WITH(NOLOCK) ON ti.idTipoIdentificacion = cl.idTipoIdentificacion
--where ti.codigoSri = '04'
--AND len(cl.numeroIdentificacion) = 13
--AND cl.validationSri = 1


--insert into @catalogoClientes (origen,IDCard,tipoIdentificacion, businnesName, tradeName, email, telephone, address, SriValidation)
--select 'cl',numeroIdentificacion,ti.codigoSri, cl.nombreFiscal, cl.nombreComercial, cl.correo, cl.telefono, cl.direccion, validationSri
--from dbo.Cliente cl WITH(NOLOCK)
--inner join dbo.TipoIdentificacion ti WITH(NOLOCK) ON ti.idTipoIdentificacion = cl.idTipoIdentificacion
--where ti.codigoSri = '05'
--AND len(cl.numeroIdentificacion) = 10
--AND cl.validationSri = 1

--insert into @catalogoClientes (origen,IDCard,tipoIdentificacion, businnesName, tradeName, email, telephone, address, SriValidation)
--select 'cl',numeroIdentificacion,ti.codigoSri, cl.nombreFiscal, cl.nombreComercial, cl.correo, cl.telefono, cl.direccion, validationSri
--from dbo.Cliente cl WITH(NOLOCK)
--inner join dbo.TipoIdentificacion ti WITH(NOLOCK) ON ti.idTipoIdentificacion = cl.idTipoIdentificacion
--where ti.codigoSri NOT IN ('04', '05')


--insert into @catalogoClientes (origen,IDCard,tipoIdentificacion, businnesName, tradeName, email, telephone, address, SriValidation)
--select 'pr',numeroIdentificacion,ti.codigoSri, pr.nombreFiscal, pr.nombreComercial, pr.correo, pr.telefono, pr.direccion, validationSri
--from dbo.Proveedor pr WITH(NOLOCK)
--inner join dbo.TipoIdentificacion ti WITH(NOLOCK) ON ti.idTipoIdentificacion = pr.idTipoIdentificacion
--where numeroIdentificacion not in (select IDCard from @catalogoClientes)
--and ti.codigoSri = '04'
--AND len(pr.numeroIdentificacion) = 13
--AND pr.validationSri = 1


--insert into @catalogoClientes (origen,IDCard,tipoIdentificacion, businnesName, tradeName, email, telephone, address, SriValidation)
--select 'pr',numeroIdentificacion,ti.codigoSri, pr.nombreFiscal, pr.nombreComercial, pr.correo, pr.telefono, pr.direccion, validationSri
--from dbo.Proveedor pr WITH(NOLOCK)
--inner join dbo.TipoIdentificacion ti WITH(NOLOCK) ON ti.idTipoIdentificacion = pr.idTipoIdentificacion
--where numeroIdentificacion not in (select IDCard from @catalogoClientes)
--and ti.codigoSri = '05'
--AND len(pr.numeroIdentificacion) = 10
--AND pr.validationSri = 1

--insert into @catalogoClientes (origen,IDCard,tipoIdentificacion, businnesName, tradeName, email, telephone, address, SriValidation)
--select 'pr',numeroIdentificacion,ti.codigoSri, pr.nombreFiscal, pr.nombreComercial, pr.correo, pr.telefono, pr.direccion, validationSri
--from dbo.Proveedor pr WITH(NOLOCK)
--inner join dbo.TipoIdentificacion ti WITH(NOLOCK) ON ti.idTipoIdentificacion = pr.idTipoIdentificacion
--where numeroIdentificacion not in (select IDCard from @catalogoClientes)
--and ti.codigoSri NOT IN ('04', '05')


--INSERT INTO Customer(IDType, identificacion, businessName, tradeName, email, telephone, address, Srivalidation)

--select tipoIdentificacion,IDCard, businnesName, tradeName, email, telephone, address, Srivalidation from @catalogoClientes order by businnesName asc


--GO

--WITH CTE(identificacion, 
--    DuplicateCount)
--AS (SELECT identificacion,
--           ROW_NUMBER() OVER(PARTITION BY identificacion
--           ORDER BY id) AS DuplicateCount
--    FROM dbo.Customer)
--DELETE FROM CTE
--WHERE DuplicateCount > 1
----SELECT *
----FROM CTE;

--GO

--INSERT INTO Customer.Customer(IDType, IDCard, BusinessName, TradeName, email, telephone, Address, SriValidation)
--SELECT IDType, identificacion, BusinessName, TradeName, email, telephone, Address, SriValidation FROM Customer

--GO
--DROP TABLE dbo.Customer

----select COUNT(*) from Customer

----GO

----ALTER TABLE Cliente ADD CustomerId INT NULL

----GO

----ALTER TABLE Proveedor ADD CustomerId INT NULL


--GO

--UPDATE C SET c.CustomerId = cc.Id

--FROM dbo.Cliente c 
--JOIN (SELECT Id, IDCard FROM Customer.Customer) cc ON c.numeroIdentificacion = cc.IDCard 

--GO

--UPDATE p SET p.CustomerId = cc.Id

--FROM dbo.Proveedor p 
--JOIN (SELECT Id, IDCard FROM Customer.Customer) cc ON p.numeroIdentificacion = cc.IDCard 


--GO
--SELECT COUNT(*) FROM Customer.Customer
----SELECT * FROM Cliente WHERE CustomerId is null
----SELECT * FROM Proveedor WHERE CustomerId is null

----select * from TipoIdentificacion

----select * from Customer.Customer where IDCard = '1105222853001'

----alter table customer.customer alter column [address] varchar(500) null

----alter table customer.customer alter column email  varchar(500) null

----alter table customer.customer alter column [tradeName] varchar(300) null