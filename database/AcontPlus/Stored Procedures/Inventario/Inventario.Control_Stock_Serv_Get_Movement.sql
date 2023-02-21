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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Inventario.Control_Stock_Serv_Get_Movement', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Control_Stock_Serv_Get_Movement 
GO
CREATE PROCEDURE Inventario.Control_Stock_Serv_Get_Movement @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @table TABLE 
	(
		id INT NOT NULL
	   ,fechaEmision DATETIME NOT NULL
	   ,cantidad DECIMAL(15,5) NOT NULL
	   ,particion INT NOT NULL
	)

    -- Insert statements for procedure here
	INSERT @table
	(
		id
	   ,fechaEmision
	   ,cantidad
	   ,particion

	)
	
	SELECT 
		id
	   ,fechaEmision
	   ,cantidad
	   ,particion
	FROM OPENJSON(@json)
	WITH 
	(
		id INT '$.id'
	   ,fechaEmision DATETIME '$.fechaEmision'
	   ,cantidad DECIMAL(15,5) '$.cantidad'
	   ,particion INT '$.particion'
	)


	SELECT 
		saldo = SUM(SUM(cantidad)) OVER (PARTITION BY particion ORDER BY fechaEmision,id ASC) 
	FROM @table 
	GROUP BY cantidad,particion,fechaEmision,id

END
GO
