USE [Acontplus]
GO 
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 8/15/2023
-- Description:	for the management of all data related to the vehicle.
-- =============================================
CREATE OR ALTER PROCEDURE Mechanical.VehicleCompany_Insert @userRoleId INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @tipo INT
	DECLARE @LicensePlate AS VARCHAR(15)
	DECLARE @userId AS INT
	DECLARE @Id AS INT
	DECLARE @VehicleId AS INT 
	DECLARE @CustomerId AS INT

	DECLARE @tbVehicle AS TABLE (
	    [VehicleTypeId] INT NOT NULL
	   ,[LicensePlate] VARCHAR(10) NOT NULL
	   ,[Brand] VARCHAR(150) NOT NULL
	   ,[Model] VARCHAR(150) NOT NULL
	   ,[Year] INT NOT NULL
	   ,[Color] VARCHAR(150) NOT NULL
	   ,[CustomerId] INT NOT NULL
       ,[CompanyId] INT NOT NULL
	   ,[UserId] INT NOT NULL
	   ,[Observation] VARCHAR(300) NULL
	   ,[Enabled] BIT NOT NULL
	   ,[CreatedAt] DATETIME2 NOT NULL
	)

	BEGIN TRY 
		    -- SAVING THE JSON DATA  --
			INSERT INTO @tbVehicle
				  ([VehicleTypeId],[LicensePlate],[Brand],[Model],[Year],[Color],[CustomerId],[CompanyId],[UserId],[Observation],[Enabled],[CreatedAt])
			SELECT [VehicleTypeId],[LicensePlate],[Brand],[Model],[Year],[Color],[CustomerId],[CompanyId],[UserId],[Observation],[Enabled],[CreatedAt]
			FROM OPENJSON(@json) WITH
			(
				[VehicleTypeId]        INT '$.vehicleTypeId'
			   ,[LicensePlate] VARCHAR(10) '$.licensePlate'
			   ,[Brand]       VARCHAR(150) '$.brand'
			   ,[Model]       VARCHAR(150) '$.model'
			   ,[Year]                 INT '$.year' 
			   ,[Color]       VARCHAR(150) '$.color' 
			   ,[CustomerId]           INT '$.customerId' 
			   ,[CompanyId]            INT '$.companyId' 
			   ,[UserId]               INT '$.userId'
			   ,[Observation] VARCHAR(300) '$.observation'
			   ,[Enabled]              BIT '$.enabled'
			   ,[CreatedAt]      DATETIME2 '$.createdAt'
			) as dt

			-- RUPERERATING IN VARIABLES --
			SELECT @LicensePlate = LicensePlate,@userId = UserId, @CustomerId = CustomerId FROM @tbVehicle

		BEGIN TRAN
			IF EXISTS (SELECT 1 FROM Mechanical.v_Vehicle WITH (NOLOCK) WHERE LicensePlate = @LicensePlate)
				BEGIN
					SELECT TOP 1 @VehicleId = VehicleId FROM Mechanical.v_Vehicle WITH (NOLOCK) WHERE LicensePlate = @LicensePlate
				END
			ELSE 
				BEGIN
					INSERT INTO [Mechanical].[Vehicle]
							([VehicleTypeId],[LicensePlate],[Brand],[Model],[Year],[Color],[CreatedAt],[Enabled])
					  SELECT [VehicleTypeId],[LicensePlate],[Brand],[Model],[Year],[Color],[CreatedAt],[Enabled] FROM @tbVehicle

					 SELECT @VehicleId = SCOPE_IDENTITY()
				END

			INSERT INTO [Mechanical].[VehicleCompany]
					([VehicleId],[CompanyId],[UserId],[CustomerId],[Observation],[CreatedAt],[Enabled])
			  SELECT  @VehicleId,[CompanyId],[UserId],[CustomerId],[Observation],[CreatedAt],[Enabled] FROM @tbVehicle

			SELECT @Id = SCOPE_IDENTITY()
		COMMIT TRAN 

		IF (@Id > 0) 
            SELECT dbo.ufn_spresponse('1', 'Éxitos al guardar', NULL)
        ELSE 
            SELECT dbo.ufn_spresponse('0', 'No se pudo guardar el Vehículo', NULL)

	END TRY 

	BEGIN CATCH
		SELECT dbo.ufn_spresponse('0', 'Error al guardar el Vehículo', NULL)
        
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN

       INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'Mechanical/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH 
END
GO

