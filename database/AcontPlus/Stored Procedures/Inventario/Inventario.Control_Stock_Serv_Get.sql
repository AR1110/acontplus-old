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
IF OBJECT_ID(N'Inventario.Control_Stock_Serv_Get', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Control_Stock_Serv_Get 
GO
CREATE PROCEDURE Inventario.Control_Stock_Serv_Get  @cantArticles INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT TOP (@cantArticles) idControlStock,idArticulo,idBodega FROM Inventario.ControlStock  WITH (NOLOCK) WHERE estado = 'PE'
END
GO
