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
   

    DECLARE @tipo       INT 
    DECLARE @dateNow    DATETIME = (SELECT dbo.ufnGetDateEcuador())
    DECLARE @dia        VARCHAR(15)
    DECLARE @hora       VARCHAR(5)    

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
            SET @dia        = (SELECT DATENAME(weekday, GETDATE()))
            SET @hora       = (SELECT FORMAT(GETDATE(), 'HH:mm'))
            SET @dateNow    = CONVERT(date, @dateNow)

                     
            SELECT rp.Id
                ,rp.[Description]
            FROM Restaurant.Promotion rp
            WHERE NOT (CAST(rp.StartDate AS DATE) > @dateNow OR CAST(rp.EndDate AS DATE) < @dateNow
            AND (SELECT [day] FROM dbo.ufnGetDayHourPromotion(rp.PromotionDays)) != (LOWER(@dia)))
            ---AND (SELECT [day] FROM dbo.ufnGetDayHourPromotion(rp.PromotionDays)) IN (LOWER(@dia))
            --AND (SELECT startHour FROM dbo.ufnGetDayHourPromotion(rp.PromotionDays)) >= @hora
            --AND (SELECT endHour FROM dbo.ufnGetDayHourPromotion(rp.PromotionDays)) <= @hora
        END
END
GO

---select * from Restaurant.Promotion
