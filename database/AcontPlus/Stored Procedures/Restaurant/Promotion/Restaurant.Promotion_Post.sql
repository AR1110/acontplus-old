GO 
USE Acontplus
GO
--- Author: Ignacio Manchu.
--- Description: Update 
--- Date: 2023-08-17
--- 
IF OBJECT_ID('Restaurant.Promotion_Post') IS NOT NULL
	DROP PROC Restaurant.Promotion_Post
GO
CREATE PROC Restaurant.Promotion_Post
@userRoleId INT
,@json VARCHAR(MAX)
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
    DECLARE @id             INT
    DECLARE @response       NVARCHAR(100)

    SET @userId     = (SELECT idUsuario FROM V_usuario WHERE idUsuarioRol = @userRoleId)
    SET @dateNow    = (SELECT dbo.ufnGetDateEcuador())
    
    SELECT  @codEstab           = codEstab
            ,@description       = description
            ,@startDate         = startDate
            ,@endDate           = endDate
            ,@promotionDays     = promotionDays
            ,@promotionMenus    = promotionMenus
    FROM OPENJSON(@json)
    WITH(codEstab      VARCHAR(50)      '$.codEstab'
        ,description   VARCHAR(100)     '$.description'
        ,startDate     DATETIME2        '$.startDate'
        ,endDate       DATETIME2        '$.endDate'
        ,promotionDays NVARCHAR(MAX)    '$.promotionDays'
        ,promotionMenus NVARCHAR(MAX)   '$.promotionMenus' AS JSON
    )
        
	BEGIN TRY
		BEGIN TRAN
            INSERT INTO Restaurant.Promotion([CodEstab], [Description], [StartDate], [EndDate], [CreatedAt]
                                            , [UpdatedAt], [Enabled], [Deleted], [UserId], [PromotionDays])

                                    VALUES(@codEstab, @description, @startDate, @endDate, @dateNow, 
                                            NULL, 1, NULL, @userId, @promotionDays)

            SET @id = @@IDENTITY

            EXEC Restaurant.Promotion_Menu_Insert @userRoleId, @id, @promotionMenus, @response 
            

		COMMIT TRAN
        SELECT Common.ufnSpResponse('1', 'Registrado exitosamente', NULL)
	END TRY
	BEGIN CATCH
		SELECT Common.ufnSpResponse('0', 'Error al registrar la Promoción', NULL)
        
        IF (@@TRANCOUNT > 0) ROLLBACK TRAN

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
        VALUES(NEWID(), 'Promotion/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH
END 