use [Acontplus]
go 

--> Eliminar las Colunmas comprobante y codDoc por idTipoDocumento, Primera Forma Normal (1FN) 

--ALTER TABLE Recepcion.DocumentoRecibido ADD idTipoDocumento BIGINT CONSTRAINT FK_DocumentoRecibido_TipoDocumento_idTipoDocumento FOREIGN KEY(idTipoDocumento) REFERENCES dbo.TipoDocumento(idTipoDocumento)

--UPDATE dr set dr.idTipoDocumento = td.idTipoDocumento
--FROM Recepcion.DocumentoRecibido dr
--INNER JOIN dbo.TipoDocumento td ON td.codigoSri = dr.codDoc

--UPDATE dr set dr.idTipoDocumento = case dr.comprobante when 'Factura'                  then  (select top 1 idTipoDocumento from dbo.TipoDocumento where codigoSri = '01')
--                                                       when 'Notas de Crédito'         then  (select top 1 idTipoDocumento from dbo.TipoDocumento where codigoSri = '04')
--                                                       when 'Comprobante de Retención' then  (select top 1 idTipoDocumento from dbo.TipoDocumento where codigoSri = '07')
--                                   end
--FROM Recepcion.DocumentoRecibido dr
--where idTipoDocumento is null and dr.comprobante is not null


--delete from Recepcion.DocumentoRecibido where idTipoDocumento is null

--select * from Recepcion.DocumentoRecibido where idTipoDocumento is null

--ALTER TABLE Recepcion.DocumentoRecibido ALTER COLUMN idTipoDocumento BIGINT NOT NULL

--ALTER TABLE Recepcion.DocumentoRecibido DROP COLUMN comprobante
--ALTER TABLE Recepcion.DocumentoRecibido DROP COLUMN codDoc


--> Eliminar las Colunmas RucEmision y RazonSocialEmison por CustomerId, Primera Forma Normal (1FN) 

--ALTER TABLE Recepcion.DocumentoRecibido ALTER COLUMN [customerId] INT NOT NULL

--ALTER TABLE Recepcion.DocumentoRecibido DROP COLUMN [rucEmisor]

--ALTER TABLE Recepcion.DocumentoRecibido DROP COLUMN [razonSocialEmisior]


--> Eliminar identificacionReceptor ya tiene idEstablecimiento y esta relacionado con la empresa al que pertenece

--ALTER TABLE Recepcion.DocumentoRecibido DROP COLUMN identificacionReceptor 

SELECT TOP 10 * FROM Recepcion.DocumentoRecibido dr --where CustomerId is null

--select * from TipoDocumento where codigoSri is not null

--> Eliminar subcategoryId irrelevante en informacion de la compre pertenece a la contabilidad entidad relacion
--ALTER TABLE Recepcion.DocumentoRecibido DROP CONSTRAINT fk_contabilidad_dr_subcategory

--ALTER TABLE Recepcion.DocumentoRecibido DROP COLUMN subcategoryId 

--> ALTERACION DE LA COLUMNA  fechaEmision y fechaAutorizacion a FORMATOS TIPO FECHA MANTENER LA SEGURIDAD Y ROBUSTEZ CON UN TIPADO


--update Recepcion.DocumentoRecibido set fechaAutorizacion = fechaEmision where fechaAutorizacion is null AND fechaEmision is null
--update Recepcion.DocumentoRecibido set fechaEmision = fechaAutorizacion where fechaEmision is null AND  fechaAutorizacion IS NULL

--UPDATE Recepcion.DocumentoRecibido set fechaEmision = TRY_CONVERT(date,fechaEmision,103)
--                                      ,fechaAutorizacion = TRY_CONVERT(datetime2,fechaAutorizacion )


ALTER TABLE Recepcion.DocumentoRecibido ALTER COLUMN fechaEmision DATETIME2 NOT NULL
ALTER TABLE Recepcion.DocumentoRecibido ALTER COLUMN fechaAutorizacion DATETIME2 NOT NULL

--select * from tipodocumento
