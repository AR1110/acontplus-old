GO 
USE Acontplus
GO
--- Author: Ignacio Manchu.
--- Description: Update 
--- Date: 2023-08-17
--- Restaurant.Promotion_Update, 139, 4, 
IF OBJECT_ID('Restaurant.Promotion_Update') IS NOT NULL
	DROP PROC Restaurant.Promotion_Update
GO
CREATE PROC Restaurant.Promotion_Update
@userRoleId INT
,@id INT
,@json VARCHAR(MAX)
,@s3ObjectUrl VARCHAR(800)
,@s3ObjectKey VARCHAR(500)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    DECLARE @userId         INT
    DECLARE @codEstab       VARCHAR(50)
    DECLARE @description    VARCHAR(100)
    DECLARE @startDate      DATETIME2
    DECLARE @endDate        DATETIME2
    DECLARE @promotionDays  NVARCHAR(MAX)
    DECLARE @promotionMenus NVARCHAR(MAX)
    DECLARE @dateNow        DATETIME    
    DECLARE @response       NVARCHAR(100)

    SET @userId     = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)
    SET @dateNow    = (SELECT dbo.ufnGetDateEcuador())
    
    SELECT  @codEstab           = codEstab
            ,@description       = description
            ,@startDate         = startDate
            ,@endDate           = endDate
            ,@promotionDays     = promotionDays
            ,@promotionMenus    = promotionMenus
    FROM OPENJSON(@json)
    WITH(codEstab       VARCHAR(50)      '$.codEstab'
        ,description    VARCHAR(100)     '$.description'
        ,startDate      DATETIME2        '$.startDate'
        ,endDate        DATETIME2        '$.endDate'
        ,promotionDays  NVARCHAR(MAX)    '$.promotionDays'
        ,promotionMenus NVARCHAR(MAX)    '$.promotionMenus' AS JSON
    )

    IF @s3ObjectUrl = '' OR @s3ObjectKey = ''
        BEGIN
            SELECT @s3ObjectUrl     = S3ObjectUrl
                    ,@s3ObjectKey   = S3ObjectKey 
            FROM Restaurant.Promotion
            WHERE Id = @id
        END
       
	BEGIN TRY
		BEGIN TRAN
			UPDATE Restaurant.Promotion 
			SET CodEstab		= @codEstab
				,Description	= @description
				,StartDate		= @startDate
				,EndDate		= @endDate
				,PromotionDays  = @promotionDays
				,UpdatedAt		= @dateNow
                ,S3ObjectUrl    = @s3ObjectUrl
                ,S3ObjectKey    = @s3ObjectKey
			WHERE Id = @id

            EXEC Restaurant.Promotion_Menu_Insert @userRoleId, @id, @promotionMenus, @response 
            
		COMMIT TRAN
        SELECT Common.ufnSpResponse('1', 'Actualizado exitosamente', NULL)
	END TRY
	BEGIN CATCH
		SELECT Common.ufnSpResponse('0', 'Error al registrar la Promoción', NULL)
        
        IF (@@TRANCOUNT > 0) ROLLBACK TRAN

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
        VALUES(NEWID(), 'Promotion/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH
END 