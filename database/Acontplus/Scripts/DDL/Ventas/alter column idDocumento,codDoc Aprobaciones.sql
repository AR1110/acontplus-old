--USE [Acontplus]
--go 


--ALTER TABLE Ventas.Aprob_Document_Audit ADD codDoc VARCHAR(10) 

--ALTER TABLE Ventas.Aprob_Document_Audit ADD idDocumento INT 

select  * from Ventas.Aprob_Document_Audit aa

--update aa set
--	codDoc = (SELECT ad.codDoc FROM Ventas.Aprob_Document ad where ad.uniqueId = aa.uniqueId)
--from  Ventas.Aprob_Document_Audit aa

--ALTER TABLE Ventas.Aprob_Document_Audit ALTER COLUMN codDoc VARCHAR(10) NOT NULL


--update aa set
--	aa.idDocumento = (
--						select cc.idDocumento from v_CuentaPorCobrar cc
--						inner join dbo.PuntoEmision pe on pe.idPuntoEmision = cc.idPuntoEmision
--						inner join Sri.Establecimiento es on es.codEstab = pe.codEstab
--						WHERE es.estab = aa.estab
--						  and pe.ptoEmi = aa.ptoEmi
--						  and cc.secuencial = aa.secuencial
--						  and cc.idEntidad = aa.idEntidad
--						  and cc.codDoc  = aa.codDoc

--					 )
--from Ventas.Aprob_Document_Audit aa

--ALTER TABLE Ventas.Aprob_Document_Audit ALTER COLUMN idDocumento INT NOT NULL





						  