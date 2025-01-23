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
    SET LANGUAGE SPANISH;

    --> Global  
	DECLARE @tipo INT ,@VehicleId INT

    --> Json
    DECLARE @customer VARCHAR(MAX),@vehicle AS VARCHAR(MAX)

    --> VehicleCompaby
	DECLARE @userId INT, @CompanyId INT ,@LicensePlate VARCHAR(50)

    --> Customer
	DECLARE @CustomerId INT
    
    DECLARE @tbVehicle AS TABLE (
	    Id INT NOT NULL UNIQUE
       ,VehicleId INT NOT NULL UNIQUE
       ,[VehicleTypeId] INT NOT NULL
	   ,[CountryId] INT NOT NULL
       ,[LicensePlate] VARCHAR(10) NOT NULL
	   ,[Brand] VARCHAR(150) NOT NULL
	   ,[Model] VARCHAR(150) NOT NULL
	   ,[Year] INT NOT NULL
	   ,[Color] VARCHAR(150) NOT NULL
       ,[Engine] VARCHAR(150) NOT NULL
       ,[Chassis] VARCHAR(150) NOT NULL
       ,[Cylindraje] VARCHAR(150) NOT NULL
	   ,[CustomerId] INT NOT NULL
	   ,[Observation] VARCHAR(300) NULL
	   ,[Enabled] BIT DEFAULT 1 
	   ,[CreatedAt] DATETIME2 DEFAULT GETDATE() NOT NULL
	)

    DECLARE @tbCustomer AS TABLE(
        IDType VARCHAR(2) NOT NULL
       ,IDCard VARCHAR(15) UNIQUE NOT NULL
       ,BusinessName VARCHAR(300) NOT NULL
       ,TradeName VARCHAR(300) NOT NULL
       ,Email VARCHAR(500) NULL
       ,telephone VARCHAR(300) NULL
       ,[Address] VARCHAR(500) NULL
       ,SriValidation BIT DEFAULT 1 
    )
	  
    BEGIN TRY
        --> SAVING THE JSON DATA
        SELECT @customer = customer
              ,@vehicle  = vehicle
        FROM OPENJSON(@json) WITH 
        (
            customer   NVARCHAR(MAX) as json
           ,vehicle    NVARCHAR(MAX) as json
        )

        INSERT INTO @tbVehicle
			   (Id,vehicleId,VehicleTypeId,CountryId,LicensePlate,Brand,Model,[Year],Color,Engine,Chassis,Cylindraje,CustomerId,Observation)
		SELECT @id,vehicleId,VehicleTypeId,CountryId,LicensePlate,Brand,Model,[Year],Color,Engine,Chassis,Cylindraje,CustomerId,Observation
		FROM OPENJSON(@vehicle) WITH
        (
	         vehicleId     INT
            ,vehicleTypeId INT 
	        ,countryId     INT 
	        ,licensePlate  VARCHAR(10) 
	        ,brand         VARCHAR(150) 
	        ,model         VARCHAR(150) 
	        ,[year]        INT 
	        ,color         VARCHAR(150)  
	        ,engine        VARCHAR(150) 
	        ,chassis       VARCHAR(150)  
	        ,cylindraje    VARCHAR(150)  
	        ,customerId    INT  
	        ,observation   VARCHAR(300) 

        ) as dt

        INSERT INTO @tbCustomer 
              (IDType,IDCard,BusinessName,TradeName,email,telephone,[Address])
        SELECT IDType,IDCard,BusinessName,TradeName,email,telephone,[Address] 
        FROM OPENJSON(@customer) WITH 
        (
            idType       VARCHAR(2) 
           ,idCard       VARCHAR(15) 
           ,businessName VARCHAR(300) 
           ,tradeName    VARCHAR(300) 
           ,email        VARCHAR(500) 
           ,telephone    VARCHAR(300) 
           ,[address]    VARCHAR(500)
        )

        --> RUPERERATING IN VARIABLES 
		SELECT TOP 1  @CustomerId = CustomerId, @LicensePlate = LicensePlate FROM @tbVehicle


        --> VALIDATION OF INFORMATION 
        IF EXISTS(SELECT 1 FROM @tbVehicle)  
            BEGIN
                SELECT [Common].[ufnSpResponse]('0', 'Error en la informacion del vehiculo', NULL)
                RETURN
            END
            
        BEGIN TRAN 
            
            UPDATE ve WITH (ROWLOCK)
               SET ve.[VehicleTypeId] = tv.VehicleTypeId
                  ,ve.[CountryId]     = tv.CountryId
                  ,ve.[Brand]         = tv.Brand
                  ,ve.[Model]         = tv.Model
                  ,ve.[Year]          = tv.[Year]
                  ,ve.[Color]         = tv.Color
                  ,ve.[Engine]        = tv.Engine
                  ,ve.[Chassis]       = tv.Chassis
                  ,ve.[Cylindraje]    = tv.Cylindraje
                  ,ve.[UpdatedAt]     = GETDATE()
            FROM [Mechanical].[Vehicle] ve
            INNER JOIN @tbVehicle       tv ON tv.VehicleId = ve.Id 

            UPDATE [Mechanical].[VehicleCompany] WITH (ROWLOCK)
               SET [CustomerId] = @CustomerId
                  ,[UpdatedAt]  = GETDATE()
             WHERE Id = @id

             SELECT TOP 1 @LicensePlate = STRING_AGG(ve.LicensePlate,'|')
			 FROM Mechanical.VehicleCompany vc WITH (NOLOCK)
			 INNER JOIN Mechanical.Vehicle  ve WITH (NOLOCK) ON ve.Id = vc.VehicleId
			 WHERE vc.[Enabled] = 1
			   AND vc.Deleted IS NULl
               AND vc.CustomerId = @CustomerId

             UPDATE dbo.Cliente WITH (ROWLOCK) SET placa = @LicensePlate WHERE idCliente = @CustomerId

        COMMIT TRAN 
        SELECT [Common].[ufnSpResponse]('1', 'Actualizado exitosamente', NULL)
    END TRY 

    BEGIN CATCH
        IF (@@TRANCOUNT > 0) 
            BEGIN 
                ROLLBACK TRAN
            END 

        INSERT INTO ErroresSistema
            (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'Vehicle/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),dbo.ufnGetDateEcuador(),@userId
	         
        SELECT [Common].[ufnSpResponse]('0', 'Error en el procedimiento', NULL)
    END CATCH 

	  
END
GO
