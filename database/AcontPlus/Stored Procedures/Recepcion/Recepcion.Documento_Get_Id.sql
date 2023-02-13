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
IF OBJECT_ID(N'Recepcion.Documento_Get_Id', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Documento_Get_Id
GO
CREATE PROCEDURE Recepcion.Documento_Get_Id @idRol INT
,@uniqueId UNIQUEIDENTIFIER
,@backendInfo VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT
	DECLARE @PageNumber AS INT
	DECLARE @RowsOfPage AS INT
	DECLARE @SortBy AS VARCHAR(50)
	DECLARE @OrderBy AS VARCHAR(50)
	DECLARE @totalRecords AS INT
	SET @PageNumber=2
	SET @RowsOfPage=4 

	--SELECT @PageNumber = pageNumber, @RowsOfPage = limit, @OrderBy= orderBy
	--,@SortBy = sortBy
	--FROM OPENJSON(@JSON) WITH(limit INT '$.limit'
	--, pageNumber INT '$.page' 
	--,orderBy VARCHAR(5) '$.orderBy'
	--,sortBy VARCHAR(100) '$.sortBy'
	--)

	SET @idUsuario = (SELECT idUsuario FROM dbo.Rol WHERE idRol = @idRol)
	--BEGIN TRY
	--	BEGIN TRAN
			IF EXISTS(SELECT 1 FROM Recepcion.DocumentoRecibido WHERE uniqueId = @uniqueId AND xmlDoc is null)
				BEGIN
					RETURN
				END
			--SELECT @totalRecords = COUNT(*) FROM Recepcion.ComprobanteImportacion
			SELECT uniqueId, codDoc, [xmlDoc]
			--,@totalRecords totalRecords
			FROM Recepcion.DocumentoRecibido
			WHERE uniqueId  = @uniqueId
			--ORDER BY idComprobanteImportacion DESC
			--CASE WHEN @SortBy = 'razonSocialEmisior' AND @OrderBy = 'ASC' THEN razonSocialEmisior END ASC, 
			--CASE WHEN @SortBy = 'razonSocialEmisior' AND @OrderBy = 'DESC' THEN razonSocialEmisior END DESC 

			--OFFSET (@PageNumber-1)*@RowsOfPage ROWS
			--FETCH NEXT @RowsOfPage ROWS ONLY

	--	COMMIT TRAN
	--END TRY
	--BEGIN CATCH
	--	SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
	--	IF (@@TRANCOUNT > 0)
	--		ROLLBACK TRAN
	--	DECLARE @method VARCHAR(200)
	--	SET @method = (SELECT method FROM OPENJSON(@backendInfo) WITH(method VARCHAR(200) '$.methodName'))
	--	INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
	--	VALUES (NEWID(), @method, ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	--END CATCH 
END
