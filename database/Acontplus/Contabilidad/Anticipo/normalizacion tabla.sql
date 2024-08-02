USE [Acontplus]
go 

--> Anticipos

--ALTER TABLE dbo.Anticipo DROP CONSTRAINT [FK__Anticipo__idSucu__30B91D22]

--ALTER TABLE dbo.Anticipo DROP COLUMN idSucursal

--ALTER TABLE dbo.Anticipo DROP CONSTRAINT [FK__Anticipo__idTipo__2FC4F8E9]

--ALTER TABLE dbo.Anticipo DROP COLUMN idTipoDocumento

--ALTER TABLE dbo.Anticipo DROP CONSTRAINT [FK__Anticipo__idEsta__1C3DEE80]

--ALTER TABLE dbo.Anticipo DROP COLUMN idEstadoDocumento

--ALTER TABLE dbo.Anticipo  ADD idEstablecimiento INT CONSTRAINT fk_Anticipo_Establecimiento FOREIGN KEY(idEstablecimiento) REFERENCES Sri.Establecimiento(idEstablecimiento)

--ALTER TABLE dbo.Anticipo DROP CONSTRAINT FK__Anticipo__codEst__40237F73

--ALTER TABLE dbo.Anticipo DROP COLUMN [codEstab]

--ALTER TABLE dbo.Anticipo ADD idComprobanteIngreso BIGINT CONSTRAINT fk_Anticipo_ComprobanteIngreso FOREIGN KEY(idComprobanteIngreso) REFERENCES dbo.ComprobanteIngreso(idComprobanteIngreso)



--update a set
--    a.idComprobanteIngreso =isnull((
--            select TOP 1 cd.idComprobanteIngreso from CobroDocumento cd
--            inner join TipoDocumento td on td.idTipoDocumento = cd.idTipoDocumento
--            where td.codigo = 'A'
--              and cd.idComprobante = a.idAnticipo
--        ),63)
--from dbo.Anticipo a 

--update a set
--    a.idEstablecimiento = (SELECT (
--                                        select top 1 e.idEstablecimiento from sri.establecimiento e where e.codEstab = ci.codEstab
--                                    )
                            
--                             FROM dbo.ComprobanteIngreso ci WHERE ci.idComprobanteIngreso = a.idComprobanteIngreso
--                            )
--from dbo.Anticipo a 

--ALTER TABLE Anticipo ALTER COLUMN idComprobanteIngreso BIGINT NOT NULL

--ALTER TABLE Anticipo ALTER COLUMN idEstablecimiento INT NOT NULL

--ALTER TABLE dbo.Anticipo DROP CONSTRAINT FK__Anticipo__idClie__31AD415B

--alter table Anticipo drop column idCliente

select * from Anticipo
