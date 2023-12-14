USE AcontPlus
--go
--IF OBJECT_ID(N'Config.ReporteDataSource', N'U') IS NOT NULL
--DROP TABLE Config.ReporteDataSource 
--GO
CREATE TABLE Config.ReporteDataSource(
idReporteDataSource INT NOT NULL CONSTRAINT pk_rds PRIMARY KEY IDENTITY(1,1)
,idReporte INT NOT NULL CONSTRAINT fk_reporte_rds FOREIGN KEY (idReporte) REFERENCES Config.Reporte(idReporte)
,position INT NOT NULL
,dataSource VARCHAR(150) NOT NULL
,estado BIT NOT NULL DEFAULT 1
,idUsuario INT NULL
,fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
) 