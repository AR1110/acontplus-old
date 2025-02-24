use [Acontplus]
go 


select * from Config.Reporte where codigo = 'ROC'

select * from Config.ReporteDataSource where idReporte = 9


--insert into Config.ReporteDataSource (idReporte,position,dataSource,estado,fechaRegistro) values (9,4,'infoAdicionalDs',1,GETDATE())