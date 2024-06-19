USE [Acontplus]
GO 


--ALTER TABLE dbo.ComprobanteEgreso ADD idProveedor INT 

--ALTER TABLE ComprobanteEgreso
--ADD CONSTRAINT fk_Proveedor_ComprobanteEgreso
--FOREIGN KEY (idProveedor) REFERENCES dbo.Proveedor(idProveedor);

--update ce   
--set ce.idProveedor = (select top 1 pr.idProveedor from Proveedor pr where pr.idProveedor = ce.idPersona)
--from ComprobanteEgreso ce
--where ce.codTipoPersona = 'P'

--update ce   
--set ce.idProveedor = (select top 1 pr.idProveedor from Proveedor pr where pr.numeroIdentificacion = ce.nroIdentificacion and pr.idEntidad = ce.idEntidad)
--from ComprobanteEgreso ce
--where ce.codTipoPersona = 'E'
--AND ce.idProveedor is null

--INSERT INTO Proveedor(idTipoIdentificacion,numeroIdentificacion,nombreFiscal,nombreComercial,idEntidad,idUsuario)
--select case when nroIdentificacion = '9999999999999' then (select top 1 ti.idTipoIdentificacion from TipoIdentificacion ti where ti.codigoSri = '07')
--            when LEN(nroIdentificacion) = 10         then (select top 1 ti.idTipoIdentificacion from TipoIdentificacion ti where ti.codigoSri = '05')
--            when LEN(nroIdentificacion) = 13         then (select top 1 ti.idTipoIdentificacion from TipoIdentificacion ti where ti.codigoSri = '04')
--                                                     ELSE (select top 1 ti.idTipoIdentificacion from TipoIdentificacion ti where ti.codigoSri = '06')
--       end as idTipoIdentificacion
--,nroIdentificacion,nombreFiscal,nombreFiscal,idEntidad
--,ISNULL((SELECT TOP 1 ur.idUsuario FROM App.UsuarioRol ur WHERE ur.idEntidad = ce.idEntidad),1)
--from dbo.ComprobanteEgreso ce
--where idProveedor is null 
-- and codTipoPersona = 'E'
--group by nroIdentificacion,nombreFiscal,idEntidad

--ALTER TABLE dbo.ComprobanteEgreso ALTER COLUMN idProveedor INT NOT NULL

--ALTER TABLE ComprobanteEgreso DROP COLUMN idPersona

--ALTER TABLE ComprobanteEgreso DROP CONSTRAINT FK__Comproban__idTip__6DC22B62

--ALTER TABLE ComprobanteEgreso DROP COLUMN idTipoPersona

--ALTER TABLE ComprobanteEgreso DROP CONSTRAINT FK__Comproban__idSuc__7E97B1A9

--ALTER TABLE ComprobanteEgreso DROP COLUMN idSucursal

--ALTER TABLE ComprobanteEgreso DROP CONSTRAINT FK__Comproban__idTip__47284C85

--ALTER TABLE ComprobanteEgreso DROP COLUMN idTipoDocumento


--ALTER TABLE ComprobanteEgreso DROP COLUMN codTipoPersona

--ALTER TABLE ComprobanteEgreso DROP COLUMN nroIdentificacion

--ALTER TABLE ComprobanteEgreso DROP COLUMN nombreFiscal

--ALTER TABLE dbo.ComprobanteEgreso  ADD idEstablecimiento INT CONSTRAINT fk_ComprobanteEgreso_Establecimiento FOREIGN KEY(idEstablecimiento) REFERENCES Sri.Establecimiento(idEstablecimiento)

--UPDATE ce
--set  ce.idEstablecimiento = (select top 1 e.idEstablecimiento from sri.establecimiento e where e.codEstab = ce.codEstab)
--from ComprobanteEgreso ce 


--ALTER TABLE ComprobanteEgreso ALTER COLUMN idEstablecimiento INT NOT NULL

--ALTER TABLE ComprobanteEgreso DROP CONSTRAINT FK__Comproban__codEs__4117A3AC

--ALTER TABLE ComprobanteEgreso DROP COLUMN codEstab

--ALTER TABLE dbo.ComprobanteEgreso ADD CustomerId INT 

--ALTER TABLE ComprobanteEgreso
--ADD CONSTRAINT fk_customer_ComprobanteEgreso
--FOREIGN KEY (CustomerId) REFERENCES Customer.Customer(Id);
 
-- update ce set
--      ce.CustomerId = (select TOP 1 CustomerId from Proveedor pr where pr.idProveedor = ce.idProveedor)
--from ComprobanteEgreso ce

select TOP 100 * 
from ComprobanteEgreso ce 

--ALTER TABLE dbo.ComprobanteEgreso ALTER COLUMN CustomerId INT NOT NULL

--ALTER TABLE ComprobanteEgreso DROP CONSTRAINT fk_Proveedor_ComprobanteEgreso

--ALTER TABLE ComprobanteEgreso DROP COLUMN idProveedor