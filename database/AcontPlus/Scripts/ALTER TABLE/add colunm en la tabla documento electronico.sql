--alter table dbo.DocumentoElectronico add codEstado INT DEFAULT 1 
--alter table dbo.DocumentoElectronico add versionComp VARCHAR(20)
--alter table dbo.DocumentoElectronico add isAutomatic INT DEFAULT 0
--alter table dbo.DocumentoElectronico add idContribuyente INT 
--alter table dbo.DocumentoElectronico add fechaRegistro DATETIME DEFAULT GETDATE()

--update DocumentoElectronico set codEstado = 2 where estado = 'FIRMADO' AND xmlAcontPlus IS NOT NULL
--update DocumentoElectronico set codEstado = 4 where estado = 'AUTORIZADO'
--update DocumentoElectronico set codEstado = 1 where estado is NULL 
--update DocumentoElectronico set codEstado = 1 where codEstado is NULL 


--update DocumentoElectronico set versionComp = '1.1.0' where codDoc in ('01','03','06','04')
--update DocumentoElectronico set versionComp = '1.0.0' where codDoc in ('07')
--UPDATE DocumentoElectronico set isAutomatic = 0
--update documentoElectronico set fechaRegistro = fechaEmision

--alter table dbo.DocumentoElectronico alter column codEstado INT NOT NULL
--alter table dbo.DocumentoElectronico alter column versionComp VARCHAR(20) NOT NULL
--alter table dbo.DocumentoElectronico alter column fechaRegistro DATETIME NOT NULL

--SELECT * FROM dbo.DocumentoElectronico where codDoc = '01'

--update de set 
--	de.idContribuyente = f.idCliente
--from DocumentoElectronico de 
--inner join Factura f on f.idFactura = de.idDocumento
--where de.codDoc = '01'


--SELECT * FROM dbo.DocumentoElectronico where codDoc = '03'

--update de set 
--	de.idContribuyente = lc.idProveedor
--from DocumentoElectronico de 
--inner join LiquidacionCompra lc on lc.idLiquidacionCompra = de.idDocumento
--where de.codDoc = '03'

--SELECT * FROM dbo.DocumentoElectronico where codDoc = '04'

--update de set 
--	de.idContribuyente = nc.idCliente
--from DocumentoElectronico de 
--inner join NotaCredito nc on nc.idNotaCredito = de.idDocumento
--where de.codDoc = '04'

--SELECT * FROM dbo.DocumentoElectronico where codDoc = '06'
--update de set 
--	de.idContribuyente = gr.idCliente
--from DocumentoElectronico de 
--inner join GuiaRemision gr on gr.idGuiaRemision = de.idDocumento
--where de.codDoc = '06'

SELECT * FROM dbo.DocumentoElectronico where codDoc = '07'
--update de set 
--	de.idContribuyente = rc.idProveedor
--from DocumentoElectronico de 
--inner join RetencionCompra rc on rc.idRetencionCompra = de.idDocumento
--where de.codDoc = '07'

--alter table dbo.DocumentoElectronico alter column idContribuyente INT NOT NULL