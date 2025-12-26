use Acontplus
go
--select * from sri.establecimiento
--select * from erroressistema


SELECT TOP 2 * FROM Config.Estab_Asig ORDER BY idEstab_Asig DESC
SELECT TOP 2 * FROM Config.PtoEmi_Asig ORDER BY idPtoEmi_Asig DESC 
SELECT TOP 2 * FROM Config.Bodeg_Asig ORDER BY idBodeg_Asig DESC

SELECT TOP 2 * FROM dbo.Bodega ORDER BY idbodega DESC
SELECT TOP 2 * FROM dbo.PuntoEmision ORDER BY idPuntoEmision DESC
SELECT TOP 2 * FROM Sri.Establecimiento ORDER BY idEstablecimiento DESC

--select * from AcontplusAdmin.Config.demostep
--select * from AcontplusAdmin.Config.companydemostep 
--delete from acontplusadmin.config.companydemostep where id > 37

--delete from Config.Estab_Asig where idEstab_Asig = 578
--delete from Config.PtoEmi_Asig where idEstab_Asig = 536
--delete from Config.Bodeg_Asig where idEstab_Asig = 548

--declare @idestab int = 664
--delete from Acontplus.dbo.PuntoEmision where idEstablecimiento = @idestab
--delete from Acontplus.dbo.Bodega where idEstablecimiento = @idestab
--delete from Acontplus.Sri.Establecimiento where idEstablecimiento = @idestab