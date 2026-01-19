USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-09-25
-- Description:	sp for validate ats data before download
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.Ats_CheckValidation @userRoleId INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @idEntidad INT,
        @rucReceptor VARCHAR(25),
        @codDoc VARCHAR(25),
        @fromDate DATETIME2,
        @toDate DATETIME2

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId
	SELECT @rucReceptor = ruc FROM dbo.Entidad WITH(NOLOCK) WHERE idEntidad = @idEntidad

	SELECT @fromDate  = fromDate
          ,@toDate    = toDate
    FROM OPENJSON(@json) WITH 
    (
        fromDate  DATETIME2 
       ,toDate    DATETIME2
    )

	IF EXISTS(SELECT 1 FROM FactElect.v_DocElectronico de
						 WHERE de.idEntidad = @idEntidad
						    AND CAST(de.fechaEmision as date) BETWEEN CAST(@fromDate as date) 
							AND CAST(@toDate as date)
						    AND de.codEstado NOT IN (4,6,8) )
	 	BEGIN
			SELECT '0' code, 'Aun existen documentos sin autorizar' as 'message'
		END
	ELSE
		BEGIN
			SELECT '1' code
		END
	
END
GO
