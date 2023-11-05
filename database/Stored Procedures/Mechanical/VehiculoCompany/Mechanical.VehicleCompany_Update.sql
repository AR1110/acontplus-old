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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Mechanical.VehicleCompany_Update
	@userRoleId INT,
    @id INT,
    @json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    DECLARE @VehicleTypeId INT 
	       ,@CountryId INT 
	       ,@VehicleId INT 
           ,@LicensePlate VARCHAR(10)
	       ,@Brand VARCHAR(150) 
	       ,@Model VARCHAR(150)
	       ,@Year INT 
	       ,@Color VARCHAR(150)
           ,@Engine VARCHAR(150)
           ,@Chassis VARCHAR(150)
           ,@Cylindraje VARCHAR(150)
	       ,@CustomerId INT 

    DECLARE @userId INT

    DECLARE @jsonCustomer VARCHAR(MAX)
           ,@jsonVehicle AS VARCHAR(MAX)
	  
    BEGIN TRY
            
          --=========================== SAVING THE JSON DATA ====================================================================== --
          SELECT @jsonCustomer = customer, @jsonVehicle = vehicle  FROM OPENJSON(@json) WITH (customer NVARCHAR(MAX) '$.customer' as json,vehicle NVARCHAR(MAX) '$.vehicle' as json)


          SELECT @VehicleTypeId = [VehicleTypeId]
                ,@CountryId     = [CountryId]
                ,@VehicleId     = [VehicleId]
                ,@LicensePlate  = [LicensePlate]
                ,@Brand         = [Brand]
                ,@Model         = [Model]
                ,@Year          = [Year]
                ,@Color         = [Color]
                ,@Engine        = [Engine]
                ,@Chassis       = [Chassis]
                ,@Cylindraje    = [Cylindraje]
                ,@CustomerId    = [CustomerId]
			FROM OPENJSON(@jsonVehicle) WITH
			(
				[VehicleTypeId]        INT '$.vehicleTypeId'
			   ,[VehicleId]            INT '$.vehicleId'
               ,[CountryId]            INT '$.countryId'
			   ,[LicensePlate] VARCHAR(10) '$.licensePlate'
			   ,[Brand]       VARCHAR(150) '$.brand'
			   ,[Model]       VARCHAR(150) '$.model'
			   ,[Year]                 INT '$.year' 
			   ,[Color]       VARCHAR(150) '$.color' 
               ,[Engine]      VARCHAR(150) '$.engine' 
			   ,[Chassis]     VARCHAR(150) '$.chassis' 
			   ,[Cylindraje]  VARCHAR(150) '$.cylindraje' 
			   ,[CustomerId]           INT '$.customerId'
			) as dt

        BEGIN TRAN 
            
            UPDATE [Mechanical].[Vehicle]
               SET [VehicleTypeId] = @VehicleTypeId
                  ,[CountryId]     = @CountryId
                  ,[LicensePlate]  = @LicensePlate
                  ,[Brand]         = @Brand
                  ,[Model]         = @Model
                  ,[Year]          = @Year
                  ,[Color]         = @Color
                  ,[Engine]        = @Engine
                  ,[Chassis]       = @Chassis
                  ,[Cylindraje]    = @Cylindraje
                  ,[UpdatedAt]     = GETDATE()
            WHERE Id = @VehicleId

            UPDATE [Mechanical].[VehicleCompany]
                 SET [CustomerId] = @CustomerId
                    ,[UpdatedAt]  = GETDATE()
             WHERE Id = @id

        COMMIT TRAN 
        SELECT [Common].[ufnSpResponse]('1', 'Actualizado exitosamente', NULL)
    END TRY 

    BEGIN CATCH 
        SELECT [Common].[ufnSpResponse]('0', 'Error al Actualizar el Vehículo', NULL)
        
        IF (@@TRANCOUNT > 0)
            BEGIN 
                ROLLBACK TRAN

                INSERT INTO ErroresSistema
                (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
	            VALUES
                (NEWID(), 'Mechanical/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
            END 
    END CATCH

	  
END
GO
