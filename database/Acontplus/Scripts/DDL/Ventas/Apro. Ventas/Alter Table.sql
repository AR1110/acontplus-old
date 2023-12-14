use [Acontplus]
go 


--ALTER TABLE Ventas.Aprob_Document DROP COLUMN [codigoPorcentaje]
--ALTER TABLE Ventas.Aprob_Document DROP COLUMN [totalConImpuestos]


--ALTER TABLE Ventas.Aprob_Document_Detailt add idMedida INT 
--ALTER TABLE Ventas.Aprob_Document_Detailt add idTipoIva INT 

--ALTER TABLE Ventas.Aprob_Document_Detailt ADD CONSTRAINT fk_Medida FOREIGN KEY (idMedida) REFERENCES dbo.Medida(idMedida);
--ALTER TABLE Ventas.Aprob_Document_Detailt ADD CONSTRAINT fk_TipoIva_DetailAprob FOREIGN KEY (idTipoIva) REFERENCES dbo.TipoIva(idTipoIva);
--ALTER TABLE Ventas.Aprob_Document_Detailt ADD CONSTRAINT fk_Articulo_DetailAprob FOREIGN KEY (idArticulo) REFERENCES dbo.Articulo(idArticulo);
--ALTER TABLE Ventas.Aprob_Document_Detailt ADD CONSTRAINT fk_Tarifa_DetailAprob FOREIGN KEY (idTarifa) REFERENCES dbo.Tarifa(idTarifa);

--update ad set
--	ad.idArticulo = (select top 1 ar.idArticulo from Articulo ar where ar.code_unique = ad.codArticulo)
--   ,ad.idMedida   = (select top 1 me.idMedida from Medida me where me.codigo = ad.codMedida)
--   ,ad.idTipoIva  = (select top 1 ti.idTipoIva from TipoIva ti where ti.codigoPorcentaje = ad.codigoPorcentaje)
--from Ventas.Aprob_Document_Detailt ad

--ALTER TABLE Ventas.Aprob_Document_Detailt ALTER COLUMN idMedida INT NOT NULL 
--ALTER TABLE Ventas.Aprob_Document_Detailt ALTER COLUMN idTipoIva INT NOT NULL 
--ALTER TABLE Ventas.Aprob_Document_Detailt ALTER COLUMN idArticulo INT NOT NULL 

--ALTER TABLE Ventas.Aprob_Document_Detailt DROP COLUMN [codArticulo]
--ALTER TABLE Ventas.Aprob_Document_Detailt DROP COLUMN [codMedida]
--ALTER TABLE Ventas.Aprob_Document_Detailt DROP COLUMN [codigoPrincipal]
--ALTER TABLE Ventas.Aprob_Document_Detailt DROP COLUMN [codigoAuxiliar]
--ALTER TABLE Ventas.Aprob_Document_Detailt DROP COLUMN codigo
--ALTER TABLE Ventas.Aprob_Document_Detailt DROP COLUMN valor
--ALTER TABLE Ventas.Aprob_Document_Detailt DROP COLUMN baseImponible
 
--alter table  Ventas.Aprob_Document_Detailt add valorImpuesto NUMERIC(18,5)

--UPDATE ne set
--   ne.valorImpuesto    = (ne.precioTotalSinImpuesto * ti.porcentaje) / 100 
--FROM Ventas.Aprob_Document_Detailt ne 
--inner join dbo.TipoIva ti on ti.idTipoIva = ne.idTipoIva

SELECT * FROM Ventas.Aprob_Document_Detailt

--alter table  Ventas.Aprob_Document_Detailt alter column valorImpuesto NUMERIC(18,5) not null

--alter table Ventas.Aprob_Document_Detailt alter column codigoPorcentaje VARCHAR(10) NOT NULL