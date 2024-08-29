use [Acontplus]
go 

SELECT * FROM Inventario.TipoDocumento

SELECT * FROM Inventario.TipoTransaccion

--insert into Inventario.TipoDocumento 
--(codigo,descripcion,estado,orden)
--select 'BI','Baja de Inventario',1,10


--insert into Inventario.TipoDocumento 
--(codigo,descripcion,estado,orden)
--select 'EI','Entrada de Inventario',2,11


select * from ConsolidacionInventario

--ALTER TABLE ConsolidacionInventario DROP CONSTRAINT FK__Consolida__idTip__33CA93F7

--ALTER TABLE ConsolidacionInventario DROP COLUMN idTipoDocumento

--ALTER TABLE dbo.ConsolidacionInventario ADD idTipoDocumento INT CONSTRAINT FK_Consolidacion_TipoDoc FOREIGN KEY REFERENCES Inventario.TipoDocumento(idTipoDocumento)

--UPDATE ConsolidacionInventario SET idTipoDocumento = 7

--ALTER TABLE dbo.ConsolidacionInventario ALTER COLUMN idTipoDocumento INT NOT NULL

select * from Inventario.TipoTransaccion

--select * from Inventario.TipoDocumento