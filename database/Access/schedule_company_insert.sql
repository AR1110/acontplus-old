USE AcontplusAdmin
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ignacio Manchu.
-- Create date: 2024-04-01
-- Description:	Insert schedule company.
-- =============================================
CREATE OR ALTER PROC Seguridad.ScheduleCompany_Insert
	@UserId	INT
	, @Json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;
	DECLARE @Schedules	VARCHAR(MAX)
	DECLARE @CreatedAt	DATETIME = (SELECT GETDATE())
	DECLARE @IsActive	BIT = 1

	DECLARE @ScheduleTable AS TABLE(
		ScheduleId	INT		NOT NULL
		, CompanyId INT		NOT NULL
		, StartTime	TIME(7) NOT NULL
		, EndTime	TIME(7) NOT NULL
	);
	
	DECLARE @MainJson VARCHAR(MAX) 
	
	SELECT @MainJson = schedules FROM OPENJSON(@Json) WITH
	(
		schedules	nvarchar(max) '$.schedules' as json
	);

	INSERT INTO @ScheduleTable (ScheduleId, CompanyId, StartTime, EndTime)
	SELECT ScheduleId, CompanyId, StartTime, EndTime
	FROM OPENJSON(@MainJson) WITH
	(
		scheduleId	INT		'$.scheduleId'
		, companyId INT		'$.companyId'
		, startTime TIME(7) '$.startTime'
		, endTime	TIME(7) '$.endTime'
	);

	IF EXISTS(SELECT TOP 1 1 FROM Seguridad.ScheduleCompany WHERE CompanyId = (SELECT TOP 1 CompanyId FROM @ScheduleTable))
		BEGIN 
			SELECT '50001' code, 'La empresa ya tiene configurada su horario de acceso' as 'message'
			RETURN
		END

	BEGIN  TRY
		BEGIN TRAN
			INSERT INTO Seguridad.ScheduleCompany (ScheduleId, CompanyId, StartTime, EndTime, CreatedAt, IsActive)
			SELECT ScheduleId, CompanyId, StartTime, EndTime, @CreatedAt, @IsActive FROM @ScheduleTable
		COMMIT TRAN
		SELECT '0' code, 'Registrado correctamente' as 'message'
        RETURN
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END

		SET @ResponseTime = DATEDIFF_BIG(MILLISECOND, @StartTime, SYSUTCDATETIME());
        EXEC dbo.LogError
            @ModuleName = 'SEGURIDAD',
            @BusinessProcess = 'SCHEDULE_COMPANY_INSERT',
            @ErrorCategory = 'BUSINESS_RULE',
            @ErrorSeverityLevel = 'HIGH',
            @ResponseTime = @ResponseTime,
            @EnvironmentName = 'PROD',
            @BuildVersion = '3.0.0';
		SELECT '50001' code, 'Error en el procedimiento ' as 'message'
        RETURN
	END CATCH
END
GO