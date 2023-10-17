USE AcontPlus
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-07-0
-- Description:	sp for get clients to validate in SRI
-- =============================================
CREATE OR ALTER PROCEDURE Customer.Customer_Serv_Val_Get @top INT
AS
BEGIN
	SET NOCOUNT ON;

	--SELECT TOP(@top)
	--id idCliente,idcard numeroIdentificacion, IDType codigoSri 
	--FROM Customer.Customer c with(NOLOCK)  
	--WHERE SriValidation = 0
	--AND NOT EXISTS (SELECT * FROM ClienteError cr where c.idcard = cr.numeroIdentificacion)
	--AND c.IDType IN ('04', '05');


	--SELECT
	--idCliente, numeroIdentificacion, codigoSri
	--into #temp
	--FROM Cliente c with(NOLOCK)  
	--INNER JOIN TipoIdentificacion ti ON c.idTipoIdentificacion = ti.idTipoIdentificacion
	--WHERE validationSri = 0
	--AND c.numeroIdentificacion NOT IN (SELECT cr.numeroIdentificacion FROM ClienteError cr where c.numeroIdentificacion = cr.numeroIdentificacion)
	--AND c.numeroIdentificacion NOT IN (SELECT cc.IDCard FROM Customer.Customer cc)
	--AND ti.codigoSri IN ('04', '05')

 
	--INSERT into #temp
	--SELECT
	--idProveedor, numeroIdentificacion, codigoSri 
	--FROM Proveedor c with(NOLOCK)  
	--INNER JOIN TipoIdentificacion ti ON c.idTipoIdentificacion = ti.idTipoIdentificacion
	--WHERE validationSri = 0
	--AND c.numeroIdentificacion NOT IN (SELECT cr.numeroIdentificacion FROM ClienteError cr where c.numeroIdentificacion = cr.numeroIdentificacion)
	--AND ti.codigoSri IN ('04', '05')
	--AND c.numeroIdentificacion NOT IN (SELECT cc.IDCard FROM Customer.Customer cc)
	--AND c.numeroIdentificacion NOT IN (SELECT t.numeroIdentificacion from #temp t)

	--SELECT TOP(@top) * FROM #temp

	--DROP TABLE #temp

	SELECT TOP (@top)
	Id idCliente, IDCard numeroIdentificacion, IDType codigoSri
	FROM Customer.Customer 
	WHERE (BusinessNameUpdated is null OR SriValidation is null)
	AND IDType IN ('04', '05')
	AND Deleted is null
	END
GO


--Customer.Customer_Serv_Val_Get 20