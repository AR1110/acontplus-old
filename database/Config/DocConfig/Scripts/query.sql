use [Acontplus]
go

--ALTER TABLE dbo.ConfiguracionDocumento DROP COLUMN codigoAmbiente 

--ALTER TABLE dbo.ConfiguracionDocumento DROP CONSTRAINT DF__Configura__gener__4E739D3B

--ALTER TABLE dbo.ConfiguracionDocumento DROP COLUMN generacionNro 

--ALTER TABLE dbo.ConfiguracionDocumento ADD CONSTRAINT FK_Usuario_Config_Doc FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(idUsuario)

--ALTER TABLE dbo.ConfiguracionDocumento ADD fechaActualizacion DATETIME2 NULL

--ALTER TABLE dbo.ConfiguracionDocumento ADD UsuarioEditId INT NULL CONSTRAINT FK_Usuario_Edit_Config_Doc FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(idUsuario)

--ALTER TABLE dbo.ConfiguracionDocumento ADD infoAdicional VARCHAR(MAX)

--SELECT * FROM Contabilidad.Category

--ALTER TABLE dbo.TipoDocumento ADD infoAdicional BIT 

select * from TipoDocumento where infoAdicional = 1

select * from dbo.ConfiguracionDocumento


--UPDATE dbo.TipoDocumento set infoAdicional = 1 where codigo in ('LC','NE','RC','GR','NC','PR','FV')
