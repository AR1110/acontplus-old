USE ACONTPLUS 

--ALTER TABLE Ventas.HistoryInfoAdicional ADD idFacturaDetalle BIGINT CONSTRAINT fk_infoAdicional_Detalle FOREIGN KEY(idFacturaDetalle) REFERENCES dbo.FacturaDetalle(idFacturaDetalle)

SELECT * FROM Ventas.HistoryInfoAdicional  where idFacturaDetalle > 0

select * from FacturaDetalle where idFacturaDetalle = 738581

select * from Compra.InfoAdicional where idInfoAdicional = 1204

--SELECT top 10 * FROM Ventas.HistoryInfoAdicional

--select top 10  * from Compra.InfoAdicional
 
/**declare @json NVARCHAR(MAX)='[{"IMEI1":"353691174597004","IMEI2":"353691174597012"},{"IMEI1":"353691174597004","IMEI2":"353691174597012"}]'
--select * from openjson(@json)
 

			        SELECT j.[key] as nombre,  STRING_AGG(j.[value], ', ') WITHIN GROUP (ORDER BY j.[value]) AS valor
			        FROM  OPENJSON(@json) j
					GROUP BY j.[key]
 
select TOP 1  * from FacturaDetalle**/
 
--select * from v_CuentaPorCobrar where idCuentaPorCobrar = 85957
--select * from v_usuario WHERE idUsuario = 231 and idEntidad = 195
 
--SELECT ia.*  
--FROM Ventas.HistoryInfoAdicional hi WITH (NOLOCK) 
--inner join Compra.InfoAdicional  ia WITH (NOLOCK) ON ia.idInfoAdicional = hi.idInfoAdicional 
--inner join Articulo               a WITH (NOLOCK) ON a.idArticulo = ia.idArticulo
--CROSS APPLY OPENJSON(ia.jsonAdicional) j



--DECLARE @tb AS TABLE (
--	idFacturaDetalle INT 
--	,descripcion VARCHAR(500)
--	,cantidad NUMERIC(18,5)
--	,precioUnitario NUMERIC(18,5)
--	,precioTotalSinImpuesto NUMERIC(18,5)
--	,datajson varchar(max)	
--)

--insert into @tb

--SELECT idFacturaDetalle
--      ,descripcion
--	  ,cantidad
--	  ,precioUnitario
--	  ,precioTotalSinImpuesto 
--	  ,case when idFacturaDetalle = 161818 THEN '[{"IMEI1":"353691174598580","IMEI2":"353691174598598"},{"IMEI1":"353691174598580","IMEI2":"353691174598598"}]' END 
--FROM FacturaDetalle d WHERE idFactura = 85957 and estado = 1


--select td.descripcion,td.precioUnitario,sj.[key],sj.[value],cantidad from @tb td
--outer apply openjson(td.datajson) dt
--outer apply openjson(dt.[value]) sj



--declare @table as table(
--	descripcion varchar(100)
--	,idInfoAdicional VARCHAR(15)
--)


--insert into @table

--SELECT top 10 *
--FROM FacturaDetalle d WHERE idFactura = 85957 and estado = 1



--SELECT * FROM @table

--SELECT d.*
--FROM @table d
--CROSS APPLY dbo.SplitString(idInfoAdicional, ',');
--WHERE ids.Id IS NOT NULL[uuid]