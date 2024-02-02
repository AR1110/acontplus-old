USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-01-16
-- Description:	SP FOR GET DEVICES OF TECHNICAL SUPPORT
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.Device_Get @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @tipo INT
        ,@textSearch VARCHAR(100)
    
    SELECT @tipo = tipo, @textSearch = textSearch FROM OPENJSON(@json) WITH(tipo INT '$.tipo', textSearch VARCHAR(100) '$.textSearch')

    IF (@tipo = 1)
        BEGIN
            SET @tableNames = 'establecimientos'
              SELECT idEstablecimiento
                      ,nombreComercial
                      ,codEstab
                      ,idPuntoEmision
                      ,ptoEmi + '-' + estab as ptoEmi
                      ,defaultEstab
                      ,defaultPtoEmi 
                FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC
            RETURN
        END

    IF (@tipo = 2)
        BEGIN
	        SET @tableNames = 'devices'
	        SELECT * FROM TechnicalSupport.Device
            RETURN
        END
     IF (@tipo = 3)
        BEGIN
            SELECT * FROM TechnicalSupport.Device WITH (NOLOCK) WHERE [Name] LIKE '%' + @textSearch + '%'
            RETURN
        END
END
GO
