--DELETE NOT USED SPS
USE Acontplus
GO
DECLARE @TableName NVARCHAR(128) = 'Sucursal';
 DECLARE @sql NVARCHAR(MAX);
 
 SELECT @sql = STRING_AGG(
     'ALTER TABLE [' + SCHEMA_NAME(fk.schema_id) + '].[' + OBJECT_NAME(fk.parent_object_id) + '] ' +
     'DROP CONSTRAINT [' + fk.name + '];', CHAR(13) + CHAR(10))
 FROM 
     sys.foreign_keys AS fk
 WHERE 
     OBJECT_NAME(fk.referenced_object_id) = @TableName;
 
 EXEC sp_executesql @sql;

GO
DROP PROC IF EXISTS Dashboard.Estadisticas_Get;
GO

DROP SCHEMA IF EXISTS Dashboard;
GO

DROP PROC IF EXISTS GestFinanc.ComprobanteEgreso_Get_ByDocument;
GO

DROP PROC IF EXISTS GestFinanc.ComprobanteEgreso_Delete;
GO

DROP PROC IF EXISTS GestFinanc.ComprobanteIngreso_Insert;
GO

DROP PROC IF EXISTS GestFinanc.EstadoFinanciero_Update;
GO

--DROP SCHEMA IF EXISTS GestFinanc;
--GO

DROP PROCEDURE IF EXISTS FactElect.Comp_Imp_Get_Data_Prov;
GO
DROP PROCEDURE IF EXISTS FactElect.Comp_Imp_GetArticle_History;
GO
DROP PROCEDURE IF EXISTS FactElect.Comp_Imp_Insert_Prov;
GO
DROP PROCEDURE IF EXISTS FactElect.CompImpDetailTemp_Get;
GO
DROP PROCEDURE IF EXISTS FactElect.CompImpDetailTemp_Insert;
GO
DROP PROCEDURE IF EXISTS FactElect.CompImpDetailTemp_Insert_All;
GO
DROP PROCEDURE IF EXISTS FactElect.CompImpDetailTemp_Update;
GO
DROP PROCEDURE IF EXISTS FactElect.Comprobante_Sri_Config_Get;
GO
DROP PROCEDURE IF EXISTS FactElect.Comprobante_Sri_Config_Update;
GO
DROP PROCEDURE IF EXISTS FactElect.ComprobanteImportacionDelete;
GO
DROP PROCEDURE IF EXISTS FactElect.ComprobanteImportacionGet;
GO
DROP PROCEDURE IF EXISTS FactElect.ComprobanteImportacionInsert;
GO
DROP PROCEDURE IF EXISTS FactElect.ComprobanteImportacionUpdate;
GO
DROP PROC IF EXISTS [dbo].[SPTipoMenuRead];
GO
DROP TABLE IF EXISTS dbo.TipoMenu;
GO

DROP TABLE IF EXISTS FactElect.Comprobante_Sri_Config;
GO

DROP TABLE IF EXISTS dbo.Sucursal;
GO

DROP PROCEDURE IF EXISTS Almacen.Articulo_Get_Search;
GO
DROP PROCEDURE IF EXISTS Almacen.CodigoBarra_Delete;
GO
DROP PROCEDURE IF EXISTS Almacen.CodigoBarra_Get_Id;
GO
DROP PROCEDURE IF EXISTS Almacen.CodigoBarra_Insert;
GO
DROP PROCEDURE IF EXISTS Almacen.CodigoBarra_Update;
GO
DROP PROCEDURE IF EXISTS Almacen.Familia_Delete;
GO
DROP PROCEDURE IF EXISTS Almacen.Familia_Get;
GO
DROP PROCEDURE IF EXISTS Almacen.Familia_Update;
GO
DROP PROCEDURE IF EXISTS Almacen.Familia_Update_Cancel;
GO
DROP PROCEDURE IF EXISTS Almacen.Marca_Delete;
GO
DROP PROCEDURE IF EXISTS Almacen.Marca_Get;
GO
DROP PROCEDURE IF EXISTS Almacen.Marca_Insert;
GO
DROP PROCEDURE IF EXISTS Almacen.Marca_Update;
GO
DROP PROCEDURE IF EXISTS Almacen.Medida_Delete;
GO
DROP PROCEDURE IF EXISTS Almacen.Medida_Get;
GO
DROP PROCEDURE IF EXISTS Almacen.Medida_Insert;
GO
DROP PROCEDURE IF EXISTS Almacen.Medida_Update;
GO
DROP PROCEDURE IF EXISTS Almacen.Modelo_Delete;
GO
DROP PROCEDURE IF EXISTS Almacen.Modelo_Get;
GO
DROP PROCEDURE IF EXISTS Almacen.Modelo_Insert;
GO
DROP PROCEDURE IF EXISTS Almacen.Modelo_Update;
GO
DROP PROCEDURE IF EXISTS Almacen.SubFamilia_Delete;
GO
DROP PROCEDURE IF EXISTS Almacen.SubFamilia_Get;
GO
-- Skipping SubFamilia_Update_Cancel as requested
DROP PROCEDURE IF EXISTS Almacen.SubFamilia_Update;
GO
DROP PROCEDURE IF EXISTS Almacen.Tarifa_Get;
GO
DROP PROCEDURE IF EXISTS Almacen.Tarifa_Update;
GO

DROP PROC IF EXISTS ReporteEgresos.CarteraProveedor;
GO
DROP PROC IF EXISTS ReporteEgresos.ComprobanteEgreso;
GO

DROP PROC IF EXISTS Egresos.CarteraProveedor_Get;
GO
DROP SCHEMA IF EXISTS ReporteEgresos;
GO
DROP SCHEMA IF EXISTS Egresos;
GO

DROP PROC IF EXISTS ReporteFact.ComprobanteRetencion;
GO
DROP SCHEMA IF EXISTS ReporteFact;
GO

DROP PROC IF EXISTS ReporteIngresos.ComprobanteIngreso;
GO
DROP PROC IF EXISTS ReporteIngresos.Anticipo;
GO
DROP PROC IF EXISTS ReporteIngresos.Ingreso_Egreso_Caja;
GO
DROP SCHEMA IF EXISTS ReporteIngresos;
GO