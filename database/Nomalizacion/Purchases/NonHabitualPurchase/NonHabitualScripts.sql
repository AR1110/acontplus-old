use [Acontplus]
go 

--> ELIMINAR CAMPO CODDOC NO CUMPLE CON LAS REGLAS DE ESTANDERIZACION

--ALTER TABLE Compra.Documento_Ingreso DROP COLUMN codDoc

--> ELIMINAR IDENTIDAD (EL PUNTO DE EMISION ESTA RELACIONADO CON ESTABLECIMIENTO Y ESTE CON ENTIDAD, ESTRCUTRURA ENTIDAD RELACION)

--aLTER TABLE Compra.Documento_Ingreso DROP COLUMN idEntidad

--select * from Compra.Documento_Ingreso

--> ELIMINACION DE LOS IMPUESTOS ESTO PARA TENER UNA RELACION DIRECTA MAS DETALLADA DE CADA IMPUESTO POR ARTICULO

--DELETE FROM Compra.DocumentoIngresoImpuesto

--> ELIMINACION DE TAXID --> ESTA ID ESTA RELACIONADO NO EXISTE APLICACION DE NORMATIVA N:2

--alter table Compra.DocumentoIngresoImpuesto DROP constraint fk_DocumentoIngresoImpuesto_SriImpuesto
--alter table Compra.DocumentoIngresoImpuesto DROP COLUMN TaxId

--> RENAME DE TAXPERCENTID POR TAXId

--EXEC sp_rename 'Compra.DocumentoIngresoImpuesto.TaxPercentId', 'TaxId', 'COLUMN';

--EXEC sp_rename 'Compra.DocumentoIngresoImpuesto.Enabled', 'IsActive', 'COLUMN';

--EXEC sp_rename 'Compra.DocumentoIngresoImpuesto.Deleted', 'IsDeleted', 'COLUMN';

--update Compra.DocumentoIngresoImpuesto set isDeleted = iif(isActive = 1,0,1)

--ALTER TABLE Compra.DocumentoIngresoImpuesto alter column isDeleted bit not null

--alter table Compra.DocumentoIngresoImpuesto add CONSTRAINT DF_NonHabitualTax_IsDelted DEFAULT 0 FOR isDeleted


--> ULTIMO CAMBIO DE ENTIDAD RELACION DE TABLAS de TIPO DE IVA A TIPO DE SRI.TARIFAIMPUESTO

--ALTER TABLE Compra.DocumentoIngresoImpuesto DROP CONSTRAINT  fk_DocumentoIngresoImpuesto_SriPorcentajeImpuesto

--ALTER TABLE Compra.DocumentoIngresoImpuesto ADD CONSTRAINT FK_NonHabitualTax_SriTarifaImpuesto_TaxId
--    FOREIGN KEY (TaxId)
--    REFERENCES [Sri].[TarifaImpuesto]([idTarifaImpuesto])


--> BORRAMOS LAS COLUMNAS PERCENT(ESTA YA TIENE TAXID LA HEREDA) BORRAMOS EL DISCOUNT YA QUE HEREDAMOS DEL DETALLE

--alter table Compra.DocumentoIngresoImpuesto DROP COLUMN [percent]

--alter table Compra.DocumentoIngresoImpuesto DROP COLUMN discount

--> CREAMOS EL CAMPO NonHabitualId para una mejor realcion de detalles e impuestos  || eliminamos el el documentoingresoid pq la relacion no es certera con los detalles

--ALTER TABLE Compra.DocumentoIngresoImpuesto drop constraint  fk_DocumentoIngresoImpuesto_DocumentoIngreso
--ALTER TABLE Compra.DocumentoIngresoImpuesto drop column DocumentoIngresoId

--ALTER TABLE Compra.DocumentoIngresoImpuesto ADD NonHabitualDetailId INT NOT NULL CONSTRAINT FK_DocumentoIngresoImpuesto_DocumentoIngresoDetail_NonHabitualDetailId
--    FOREIGN KEY (NonHabitualDetailId)
--    REFERENCES Compra.Documento_Ingreso_Detail(idDocumentoIngresoDetail)


--> MIGRAMOS LOS IMPUESTOS DE LOS DETALLES

--INSERT INTO Compra.DocumentoIngresoImpuesto
--     (TaxId,TaxBase,TaxValue,CreateAt,isActive,NonHabitualDetailId)
--SELECT (select top 1 im.idTarifaImpuesto from Sri.TarifaImpuesto im where im.codigo = ti.codigoPorcentaje)
--      ,precioTotalSinImpuesto
--      ,valorImpuesto
--      ,di.fechaRegistro
--      ,dd.estado
--      ,dd.idDocumentoIngresoDetail
--FROM Compra.Documento_Ingreso_Detail dd
--inner join Compra.Documento_Ingreso  di on di.idDocumentoIngreso = dd.idDocumentoIngreso
--INNER JOIN dbo.TipoIva               ti ON ti.idTipoIva          = dd.idTipoIva

--> MIGRACION DE ESQUEMAS Y RENAME TABLE DE IMPUESTOS (ESTRUCTURA MODERNA)

--ALTER SCHEMA Purchases TRANSFER Compra.DocumentoIngresoImpuesto;
--EXEC sp_rename 'Purchases.DocumentoIngresoImpuesto', 'NonHabitualTax';
SELECT * FROM Purchases.NonHabitualTax


--delete from Compra.DocumentoIngresoImpuesto where Id in (30854,30855)










