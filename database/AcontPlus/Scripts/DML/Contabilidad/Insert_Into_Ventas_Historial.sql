use [AcontPlus]
go 

--INSERT INTO Contabilidad.Historial_Cobro (idComprobanteIngreso,idCuentaPorCobrar,abono)
--SELECT cd.idComprobanteIngreso
--	  ,idCuentaPorCobrar = (select cc.idCuentaPorCobrar from Contabilidad.CuentaPorCobrar cc where cc.codDoc = '01' and cc.idDocumento = cd.idComprobante)
--	  ,cd.abono
--FROM dbo.CobroDocumento cd 
--INNER JOIN TipoDocumento td ON td.idTipoDocumento = cd.idTipoDocumento
--WHERE td.codigo = 'FV'


--INSERT INTO Contabilidad.Historial_Cobro (idComprobanteIngreso,idCuentaPorCobrar,abono)
--SELECT cd.idComprobanteIngreso
--	  ,idCuentaPorCobrar = (select cc.idCuentaPorCobrar from Contabilidad.CuentaPorCobrar cc where cc.codDoc = 'NE' and cc.idDocumento = cd.idComprobante)
--	  ,cd.abono
--FROM dbo.CobroDocumento cd 
--INNER JOIN TipoDocumento td ON td.idTipoDocumento = cd.idTipoDocumento
--WHERE td.codigo = 'NE'




SELECT COUNT(*) FROM Contabilidad.Historial_Cobro


select COUNT(*) from CobroDocumento where idTipoDocumento IN (7,6)

