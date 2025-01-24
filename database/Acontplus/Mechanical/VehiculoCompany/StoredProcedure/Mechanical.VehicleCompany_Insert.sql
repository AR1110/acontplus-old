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
    
    --> Global  
	DECLARE @tipo INT ,@Id INT ,@VehicleId INT ,@CompanyId INT ,@payload VARCHAR(MAX)

    --> Json
    DECLARE @customer VARCHAR(MAX),@vehicle AS VARCHAR(MAX)

    --> VehicleCompaby
	DECLARE @LicensePlate VARCHAR(15),@userId INT

    --> Customer
	DECLARE @CustomerId INT, @CustomerCompanyId INT ,@IDCard VARCHAR(15) ,@CardTypeId INT ,@IDType VARCHAR(5)


	DECLARE @tbVehicle AS TABLE (
	    [VehicleTypeId] INT NOT NULL
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
            customer NVARCHAR(MAX) as json
           ,vehicle  NVARCHAR(MAX) as json
        )


		INSERT INTO @tbVehicle
			  ([VehicleTypeId],CountryId,[LicensePlate],[Brand],[Model],[Year],[Color],Engine,Chassis,Cylindraje,[CustomerId],[Observation])
		SELECT [VehicleTypeId],CountryId,[LicensePlate],[Brand],[Model],[Year],[Color],Engine,Chassis,Cylindraje,[CustomerId],[Observation]
		FROM OPENJSON(@vehicle) WITH
		(
			vehicleTypeId INT 
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
		SELECT TOP 1 @LicensePlate = LicensePlate, @CustomerId = CustomerId FROM @tbVehicle
			
        SELECT TOP 1 @IDCard = IDCard ,@IDType = IDType  FROM @tbCustomer

        SELECT TOP 1 @userId = idUsuario, @CompanyId = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @CardTypeId = idTipoIdentificacion FROM dbo.TipoIdentificacion WITH (NOLOCK) WHERE codigoSri = @IDType

        --> VALIDATION OF INFORMATION 
        IF NOT EXISTS(SELECT 1 FROM @tbVehicle)   
            BEGIN
                SELECT '0' as code, 'Error en la informacion del vehiculo' as 'message'
                RETURN
            END 

        IF NOT EXISTS(SELECT 1 FROM @tbCustomer)   
            BEGIN
                SELECT '0' as code, 'Error en la informacion del Cliente' as 'message'
                RETURN
            END

        IF EXISTS (SELECT 1 FROM Mechanical.v_Vehicle WITH (NOLOCK) WHERE LicensePlate = @LicensePlate AND CompanyId = @CompanyId AND [Deleted] IS NULL)
            BEGIN
                SELECT '0' as code, 'Ya se encuentra registrado' as 'message'
                RETURN
            END 
            
        --> TRANSACTION 
		BEGIN TRAN
                
            -->EXISTENCE OF THE VEHICLE
			IF EXISTS (SELECT 1 FROM Mechanical.Vehicle WITH (NOLOCK) WHERE LicensePlate = @LicensePlate)
				BEGIN
					SELECT TOP 1 @VehicleId = Id FROM Mechanical.Vehicle WITH (NOLOCK) WHERE LicensePlate = @LicensePlate
				END
			ELSE 
				BEGIN
					INSERT INTO [Mechanical].[Vehicle]
						  (CountryId,[VehicleTypeId],[LicensePlate],[Brand],[Model],[Year],[Color],Engine,Chassis,Cylindraje,[CreatedAt],[Enabled])
					SELECT CountryId,[VehicleTypeId],[LicensePlate],[Brand],[Model],[Year],[Color],Engine,Chassis,Cylindraje,[CreatedAt],[Enabled] 
                    FROM @tbVehicle

					SELECT @VehicleId = SCOPE_IDENTITY()
				END

            -->EXISTENCE OF THE CUSTOMER OR DRIVER
            IF EXISTS (SELECT 1 FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = @IDCard)
                BEGIN
                    SELECT TOP 1 @CustomerId = Id FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = @IDCard
                END 
            ELSE
                BEGIN 
                    INSERT INTO Customer.Customer
                          (IDType,IDCard,BusinessName,TradeName,email,telephone,[Address],SriValidation)
                    SELECT IDType,IDCard,BusinessName,TradeName,email,telephone,[Address],SriValidation 
                    FROM @tbCustomer 

                    SELECT @CustomerId = SCOPE_IDENTITY()
                END 
                
            IF NOT EXISTS (SELECT 1 FROM dbo.Cliente WITH (NOLOCK) WHERE CustomerId = @CustomerId AND idEntidad = @CompanyId)
                BEGIN
                    INSERT INTO dbo.Cliente
                           (idEntidad,idTipoIdentificacion,direccion,correo,telefono,customerId)
                    SELECT @CompanyId,@CardTypeId,[Address],Email,telephone,@CustomerId
                    FROM @tbCustomer

                    SELECT @CustomerCompanyId = SCOPE_IDENTITY()
                END 
            ELSE 
                BEGIN
                    SELECT TOP 1 @CustomerCompanyId = idCliente FROM dbo.Cliente WITH (NOLOCK) WHERE CustomerId = @CustomerId AND idEntidad = @CompanyId
                END 

            -- CUSTOMER RECORD -- 
			INSERT INTO [Mechanical].[VehicleCompany]
				   (VehicleId ,CompanyId ,UserId ,CustomerId,Observation)
			SELECT @VehicleId,@CompanyId,@userId,@CustomerId,Observation
            FROM @tbVehicle

            SELECT TOP 1 @LicensePlate = STRING_AGG(ve.LicensePlate,'|')
			FROM Mechanical.VehicleCompany vc WITH (NOLOCK)
			INNER JOIN Mechanical.Vehicle  ve WITH (NOLOCK) ON ve.Id = vc.VehicleId
			WHERE vc.[Enabled] = 1
			  AND vc.Deleted IS NULl
              AND vc.CustomerId = @CustomerId

            UPDATE dbo.Cliente WITH (ROWLOCK) SET placa = @LicensePlate WHERE idCliente = @CustomerId

			SELECT @Id = SCOPE_IDENTITY()

            SET @payload = (SELECT @Id as id FOR JSON PATH)

		COMMIT TRAN 
        SELECT '1' as code, 'Guadado Correctamente' as 'message', @payload as payload
	END TRY 

	BEGIN CATCH
        IF (@@TRANCOUNT > 0) 
            BEGIN 
                ROLLBACK TRAN
            END 

        INSERT INTO ErroresSistema
            (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'Vehicle/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),dbo.ufnGetDateEcuador(),@userId
	         
        SELECT '0' as code, 'Error en el procedimiento' as 'message'
    END CATCH 
END
GO

