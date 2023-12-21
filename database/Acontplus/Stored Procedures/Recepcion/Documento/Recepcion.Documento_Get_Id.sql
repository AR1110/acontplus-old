USE ACONTPLUS
GO
/****** Object:  StoredProcedure [Recepcion].[ASPComprobanteImportacionGetId]    Script Date: 9/15/2022 9:28:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-07-31
-- Description:	SP PARA LISTAR POR ID LOS COMPROBANTES ELECTRONICOS DEL SRI IMPORTADOS
-- =============================================
--Recepcion.Documento_Get_Id 38, '16160bc8-541a-44e9-92a7-53a4bffb7713'

CREATE OR ALTER PROCEDURE Recepcion.Documento_Get_Id @idRol INT
,@idDocumento INT
,@backendInfo VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    IF EXISTS(SELECT 1 FROM Recepcion.DocumentoRecibido WHERE idDocumento = @idDocumento AND xmlCompressed is null)
    	BEGIN
    		RETURN
    	END
    SELECT idDocumento, codDoc, CONVERT(XML, DECOMPRESS(xmlCompressed)) xmlDoc
    FROM Recepcion.DocumentoRecibido
    WHERE idDocumento  = @idDocumento 
END
