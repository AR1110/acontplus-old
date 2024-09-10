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

    DECLARE @estabId INT
    DECLARE @codEstab VARCHAR(200)

    SELECT @tipo = tipo,@estabId = estabId FROM OPENJSON(@json) WITH(tipo INT , estabId INT)

    SELECT @codEstab = codEstab FROM Sri.Establecimiento WHERE idEstablecimiento = @estabId


    IF @tipo = 1
        BEGIN
            SET @tableNames = 'promotions,days'

	        SELECT p.Id
                   ,p.CodEstab
                   ,p.Description
                   ,FORMAT(p.StartDate, 'yyyy-MM-dd')   AS StartDate
                   ,FORMAT(p.EndDate, 'yyyy-MM-dd')     AS EndDate
                   ,p.PromotionDays
                   ,ISNULL(p.S3ObjectUrl, '')           AS S3ObjectUrl                   
	        FROM Restaurant.Promotion p WITH (NOLOCK)
            WHERE p.codEstab = @codEstab ORDER by p.id DESC

            SELECT * FROM Dia
        END
        
    IF @tipo = 2
        BEGIN
            SET @tableNames = 'promotions_pos'

            SELECT rp.Id
                  ,rp.[Description]
                  ,rp.S3ObjectUrl
            FROM Restaurant.Promotion              rp WITH (NOLOCK)
            CROSS APPLY OPENJSON(rp.PromotionDays) dt
			INNER JOIN dbo.Dia                     ds WITH (NOLOCK) ON ds.idDia = JSON_VALUE(dt.[value],'$.idDia')
			WHERE rp.CodEstab = @codEstab
			  AND CAST(GETDATE() as date) BETWEEN cast(rp.StartDate as date) AND cast(rp.EndDate as date)
			  AND ds.diaSemana = (SELECT DATEPART(WEEKDAY, GETDATE()))
			  AND CAST(GETDATE() as time) BETWEEN CAST(JSON_VALUE(dt.[value],'$.horaInicio') as time) AND CAST(JSON_VALUE(dt.[value],'$.horaFin') as time)
            ORDER by rp.id DESC         
        END
END
GO

