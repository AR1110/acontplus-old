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
-- Create date: 2022-08-12
-- Description:	SP PARA ARMAR XML DAT TO SRI
-- =============================================
ALTER PROCEDURE FactElect.ASPDocumentoElectronicoGetToAuth
	 @idRol int 
	,@codDoc CHAR(2)
	,@idDocumento BIGINT
AS
BEGIN
	SET NOCOUNT ON;
	IF (@codDoc = '01')
		BEGIN
			EXEC ASPFacturaXml @idRol, @idDocumento
		END
	IF (@codDoc = '03')
		BEGIN
			EXEC ASPLiquidacionCompraXml @idRol, @idDocumento
		END
	IF (@codDoc = '04')
		BEGIN
			EXEC ASPNotaCreditoXml @idRol, @idDocumento
		END
	IF (@codDoc = '06')
		BEGIN
			EXEC ASPGuiaRemisionXml @idRol, @idDocumento
		END
	IF (@codDoc = '07')
		BEGIN
			EXEC ASPRetencionCompraXml @idRol, @idDocumento
		END 
END
GO
