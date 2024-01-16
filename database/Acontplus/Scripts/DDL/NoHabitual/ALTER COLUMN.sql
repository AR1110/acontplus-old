USE [Acontplus]
GO 

--drop table Compra.Documento_Ingreso_taxes

--ALTER TABLE Compra.Documento_Ingreso ADD descuento NUMERIC(18,5)

--ALTER TABLE Compra.Documento_Ingreso ADD porcentajeDescuento NUMERIC(18,5)


--update di set
--	di.porcentajeDescuento = 0 
--   ,di.descuento = (select SUM(id.descuento) from compra.documento_ingreso_Detail id where id.idDocumentoIngreso = di.idDocumentoIngreso )
--FROM Compra.Documento_Ingreso di

--ALTER TABLE Compra.Documento_Ingreso ALTER COLUMN descuento NUMERIC(18,5) NOT NULL

--ALTER TABLE Compra.Documento_Ingreso ALTER COLUMN porcentajeDescuento NUMERIC(18,5) NOT NULL

--SELECT top 100 * FROM Compra.Documento_Ingreso

--> Detalles

--alter table compra.Documento_Ingreso_Detail drop column codigoPrincipal 
--alter table compra.Documento_Ingreso_Detail drop column codigoAuxiliar 
--alter table compra.Documento_Ingreso_Detail drop column costoNeto 

--ALTER TABLE Compra.Documento_Ingreso_Detail add idTipoIva INT 
--ALTER TABLE Compra.Documento_Ingreso_Detail add tarifa NUMERIC(18,5)
--ALTER TABLE Compra.Documento_Ingreso_Detail add valorImpuesto NUMERIC(18,5)


--UPDATE dd SET
--     dd.idTipoIva     = ti.idTipoIva
--    ,dd.tarifa        = ti.porcentaje 
--    ,dd.valorImpuesto = (dd.precioTotalSinImpuesto * ti.porcentaje) / 100 
--FROM Compra.Documento_Ingreso_Detail dd
--INNER JOIN dbo.TipoIva ti ON ti.codigoPorcentaje = dd.codigoPorcentaje

--ALTER TABLE Compra.Documento_Ingreso_Detail alter column idTipoIva INT not null 
--ALTER TABLE Compra.Documento_Ingreso_Detail alter column tarifa NUMERIC(18,5) not null
--ALTER TABLE Compra.Documento_Ingreso_Detail alter column valorImpuesto NUMERIC(18,5) not null

SELECT  * FROM Compra.Documento_Ingreso_Detail
