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
IF OBJECT_ID(N'Contabilidad.CuentaPorCobrar_Insert', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuentaPorCobrar_Insert
GO
CREATE PROCEDURE Contabilidad.CuentaPorCobrar_Insert 
	 @codDoc AS VARCHAR(5)
	,@idDocumento AS INT
	,@idPuntoEmision AS INT
	,@idTiempoCredito AS INT
	,@idCliente AS INT
	,@serieComprobante AS VARCHAR(50)
	,@fechaEmision AS DATETIME
	,@fechaVencimiento AS DATETIME 
	,@idEntidad AS INT 
	,@idUsuario AS INT
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT <@Param1, sysname, @p1>, <@Param2, sysname, @p2>
END
GO
