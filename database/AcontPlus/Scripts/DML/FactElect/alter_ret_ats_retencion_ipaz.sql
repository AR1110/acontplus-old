use AcontPlus 
go
alter table factelect.RetencionAtsRet alter column codigo varchar(1) NOT NULL
go
alter table factelect.RetAtsImpDocSustento alter column codImpuestoDocSustento varchar(1) NOT NULL
GO
alter table FactElect.RetencionAts alter column fechaEmision DATETIME NOT NULL
GO
alter table FactElect.RetAtsDocSustento alter column fechaEmisionDocSustento DATETIME NOT NULL

GO

alter table FactElect.RetAtsDocSustento alter column fechaRegistroContable DATETIME NULL


 