use [Acontplus]
go 


--select * from Config.Reporte 

--insert into Config.Reporte (codigo,reportPath,contentType,storedProcedure,nombreReporte,fechaRegistro) 
--select 'RDEU','Contabilidad/Deudores.rdl','application/pdf','Contabilidad.CuentaPorCobrar_Report','Deudores',GETDATE()

--> 04-21-2025


select reportPath, REPLACE(reportPath,'GestionFinanciera','Contabilidad') from Config.reporte where reportPath like '%Contabilidad%' order by reportPath asc

--update Config.reporte set reportPath = REPLACE(reportPath,'GestionFinanciera','Contabilidad') where reportPath like '%GestionFinanciera%' 

--insert into Config.Reporte(codigo,reportPath,contentType,storedProcedure,nombreReporte,fechaRegistro)
--select 'RRND','/Compras/RecepcionNotaDebito.rdl','application/pdf','Recepcion.Documento_Report','Recepcion Nota Debito',GETDATE()

