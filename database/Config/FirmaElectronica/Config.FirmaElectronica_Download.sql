USE [AcontPlus]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2025-03-2025
-- Description:	sp para descargar certificado
-- =============================================

CREATE OR ALTER PROCEDURE Config.FirmaElectronica_Download @userRoleId INT, 
@id INT,
@tableNames VARCHAR(500) OUT
AS
BEGIN 
	SET NOCOUNT ON;  
	
	SET @tableNames = 'signatures'

	SELECT firma AS 'Signature'
		,nombreArchivo AS 'FileName'
	FROM dbo.FirmaElectronica f WITH (NOLOCK) 
	WHERE f.idFirmaElectronica = @id
 
END
