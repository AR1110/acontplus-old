USE AcontPlus
GO
/****** Object:  StoredProcedure [Recepcion].[ASPComprobanteImportacionInsert]    Script Date: 8/4/2022 9:30:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2023-05-08
-- Description:	 
-- =============================================
IF OBJECT_ID(N'Config.WhatsAppSession_Get', N'P') IS NOT NULL
DROP PROCEDURE Config.WhatsAppSession_Get
GO
CREATE PROCEDURE Config.WhatsAppSession_Get @idUsuarioRol INT 
AS
BEGIN
	SET NOCOUNT ON;
	SELECT TOP 1 idSession id
	FROM Config.WhatsAppSession WHERE idUsuarioRol = @idUsuarioRol  AND estado = 1 ORDER BY idSession DESC
END
