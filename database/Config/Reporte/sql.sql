use [Acontplus]
go 


--select * from Config.Reporte 

--insert into Config.Reporte (codigo,reportPath,contentType,storedProcedure,nombreReporte,fechaRegistro) 
--select 'RDEU','Contabilidad/Deudores.rdl','application/pdf','Contabilidad.CuentaPorCobrar_Report','Deudores',GETDATE()

--> 04-21-2025


--update Config.reporte set reportPath = REPLACE(reportPath,'GestionFinanciera','Contabilidad') where reportPath like '%GestionFinanciera%' 

--insert into Config.Reporte(codigo,reportPath,contentType,storedProcedure,nombreReporte,fechaRegistro)
--select 'RRND','/Compras/RecepcionNotaDebito.rdl','application/pdf','Recepcion.Documento_Report','Recepcion Nota Debito',GETDATE()


--insert into Config.Reporte(codigo,reportPath,contentType,storedProcedure,nombreReporte,fechaRegistro)
--select 'RAPTR','/Ventas/AprobTrackingReport.rdl','application/pdf','Ventas.Aprob_Document_Report','Reporte de transacciones de aprobaciones de ventas.',GETDATE()

--SELECT * FROM Config.Reporte where codigo = 'RAPTR'

----insert into Config.ReporteDataSource (idReporte,position,dataSource,estado,fechaRegistro)
----select 94,0,'headerDs',1,GETDATE()

----insert into Config.ReporteDataSource (idReporte,position,dataSource,estado,fechaRegistro)
----select 94,1,'detalleDs',1,GETDATE()

--select * from Config.ReporteDataSource where idReporte = 94



SELECT * FROM Config.Reporte where codigo = 'LCRG'

--UPDATE Config.Reporte set reportPath = '/FactElect/LiquidacionRG.rdl', storedProcedure = 'FactElect.Doc_Elect_Report' where idReporte = 22

--UPDATE Config.ReporteDataSource set dataSource = 'headerDs' where idReporteDataSource = 22

--UPDATE Config.ReporteDataSource set dataSource = 'detalleDs' where idReporteDataSource = 37

select * from Config.ReporteDataSource where idReporte = 22