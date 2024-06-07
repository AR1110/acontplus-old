--select * from TipoDocumento where codigoSri is not null


--select * from Cliente cl where idCliente in (

--SELECT idCliente FROM Factura where idFactura in 
--(
-- 22464
--,55333
--,55468
--,55469
--,56373
--,58386
--,58387
--,58388
--,35354
	
--)
--)


--INSERT INTO [Customer].[Customer]
--           ([IDType]
--           ,[IDCard]
--           ,[BusinessName]
--           ,[TradeName]
--           ,[Email]
--           ,[Telephone]
--           ,[Address]
--           ,[SriValidation]
--           ,[CreatedAt])
--select te.codigoSri
--	  ,cl.numeroIdentificacion
--	  ,(select top 1 cll.nombreFiscal from Cliente cll WHERE cll.numeroIdentificacion = cl.numeroIdentificacion)
--	  ,(select top 1 cll.nombreComercial from Cliente cll WHERE cll.numeroIdentificacion = cl.numeroIdentificacion)
--	  ,(select top 1 cll.correo from Cliente cll WHERE cll.numeroIdentificacion = cl.numeroIdentificacion)
--	  ,(select top 1 cll.telefono from Cliente cll WHERE cll.numeroIdentificacion = cl.numeroIdentificacion)
--	  ,(select top 1 cll.direccion from Cliente cll WHERE cll.numeroIdentificacion = cl.numeroIdentificacion)
--	  ,1
--	  ,GETDATE()
--from
--Cliente cl 
--inner join TipoIdentificacion te on te.idTipoIdentificacion = cl.idTipoIdentificacion
--where CustomerId is null 
--and cl.numeroIdentificacion not in (select IDCard from Customer.Customer)
--group by te.codigoSri
--	  ,cl.numeroIdentificacion


--update cl set
--	   cl.validationSri = (select c.SriValidation from Customer.Customer c where c.IDCard = cl.numeroIdentificacion)
--	  ,cl.CustomerId = (select c.Id from Customer.Customer c where c.IDCard = cl.numeroIdentificacion)
--from Cliente cl 
--inner join TipoIdentificacion te on te.idTipoIdentificacion = cl.idTipoIdentificacion
--where CustomerId is null 