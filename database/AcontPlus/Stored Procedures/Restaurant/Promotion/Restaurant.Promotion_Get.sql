USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-08-10
-- Description: sp for get restaurant menus
-- Restaurant.Promotion_Get 139, '{"tipo": 2}', ''
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.Promotion_Get
@userRoleId INT
,@json NVARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
    SET LANGUAGE SPANISH;
	SET NOCOUNT ON;
   
    DECLARE @tipo           INT 
    DECLARE @dateNow        DATETIME = (SELECT dbo.ufnGetDateEcuador())
   
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH(tipo INT '$.tipo')

    IF @tipo = 1
        BEGIN
            SET @tableNames = 'promotions,days'
	        SELECT p.Id
                   ,p.CodEstab
                   ,p.Description
                   ,FORMAT(p.StartDate, 'yyyy-MM-dd')   AS StartDate
                   ,FORMAT(p.EndDate, 'yyyy-MM-dd')     AS EndDate
                   ,p.PromotionDays
	        FROM Restaurant.Promotion p WITH (NOLOCK)

            SELECT * FROM Dia
        END
        
    IF @tipo = 2
        BEGIN
             DECLARE @day            VARCHAR(15)
                    ,@hour           VARCHAR(5)
                    ,@dayForParam    VARCHAR(15)
                                       
            SET @day            = IIF(LOWER(TRIM((SELECT DATENAME(weekday, @dateNow))))='sábado', 'Sabado',  LOWER(TRIM((SELECT DATENAME(weekday, @dateNow)))))
            SET @hour           = (SELECT FORMAT(@dateNow, 'HH:mm'))
            SET @dateNow        = CONVERT(DATE, @dateNow)
                        
            SET @tableNames = 'promotions_pos'
            SELECT rp.Id
                ,rp.[Description]
            FROM Restaurant.Promotion rp
            WHERE  CAST(@dateNow as date) BETWEEN CAST(rp.StartDate as date) AND CAST(rp.EndDate as date)
            AND @day IN(SELECT [day] FROM dbo.ufnGetPromotionDay(rp.PromotionDays, @day))
          --  AND @hour BETWEEN(SELECT startHour FROM dbo.ufnGetPromotionDay(rp.PromotionDays, @day)) AND (SELECT endHour FROM dbo.ufnGetPromotionDay(rp.PromotionDays, @day))            
        END
END
GO

