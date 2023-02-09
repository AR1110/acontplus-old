
/*
----------------------------------------NOTA CREDITO-------------------------------------------
SELECT * FROM ReporteParametro WHERE codigo='RNCC'
SELECT * FROM ReporteDataSource where idReporteParametro = 13

INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(13, 1, 'NotaCreditoClienteDetalleDs')
INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(13, 2, 'InfoAdicionalDs')
INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(13, 3, 'NormativaDs')
*/

/*
----------------------------------------INGRESO BODEGA-------------------------------------------
SELECT * FROM ReporteParametro WHERE codigo='RIB'
SELECT * FROM ReporteDataSource where idReporteParametro = 8

INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(8, 1, 'TipoDocDetalleDs')
*/

/*
----------------------------------------LIQUIDACION DE COMPRA-------------------------------------------
SELECT * FROM ReporteParametro WHERE codigo='RLC'
SELECT * FROM ReporteDataSource where idReporteParametro = 10

INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(10, 1, 'FormaPagoDs')
INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(10, 2, 'TipoDocDetalleDs')
INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(10, 3, 'InfoAdicionalDs')
INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(10, 4, 'NormativaDs')
*/


/*
----------------------------------------NOTA DE CREDITO PROVEEDOR-------------------------------------------
SELECT * FROM ReporteParametro WHERE codigo='RNCP'
SELECT * FROM ReporteDataSource where idReporteParametro = 15

INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(15, 1, 'TipoDocDetalleDs')
*/



/*
----------------------------------------ORDEN DE COMPRA-------------------------------------------
DROP PROCEDURE dbo.ASPOrdenCompraReport

SELECT * FROM ReporteParametro WHERE codigo='ROC'
SELECT * FROM ReporteDataSource where idReporteParametro = 9

INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(9, 0, 'OrdenCompraDetalleDs')
UPDATE ReporteDataSource SET position = 1 WHERE idReporteDataSource = 83
*/


/*
----------------------------------------RETENCION DE COMPRA-------------------------------------------
SELECT * FROM ReporteParametro WHERE codigo='RRC'
SELECT * FROM ReporteDataSource where idReporteParametro = 12

INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(12, 1, 'RetencionCompraDs')
INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(12, 2, 'InfoAdicionalDs')
INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(12, 3, 'NormativaDs')

UPDATE ReporteDataSource SET dataSource='RetencionCompraDetalleDs' WHERE idReporteDataSource = 124


*/

/*
----------------------------------------CONTROL CAJA-------------------------------------------
SELECT * FROM ReporteParametro WHERE codigo='RCC'
SELECT * FROM ReporteDataSource where idReporteParametro = 11

UPDATE ReporteDataSource SET position = 4 WHERE idReporteDataSource=131

INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(11, 1, 'PayDocumentDs')
INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(11, 2, 'HistoryDocumentDs')
INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(11, 3, 'DocumentAdicionalDs')
INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(11, 4, 'InfoCajaDs')
INSERT INTO ReporteDataSource (idReporteParametro, position, dataSource) VALUES(11, 5, 'TotalesDs')


*/




/*
---------------------------------------------------DROPP PROCEDURE---------------------------------
	DROP PROCEDURE ASPControlCajaReport
*/



