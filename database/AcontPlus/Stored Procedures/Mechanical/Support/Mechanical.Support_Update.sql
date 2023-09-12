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
CREATE OR ALTER PROCEDURE Mechanical.Support_Update @userRoleId INT,@id INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    DECLARE @LicensePlate VARCHAR(15)
	       ,@userId INT
           ,@Date DATETIME2
           ,@CompanyId INT
           ,@VehicleId INT
           ,@VehicleCompanyId INT
           ,@IDCard VARCHAR(15)
           ,@CustomerId INT
           

    DECLARE @jsonCustomer VARCHAR(MAX)
           ,@jsonVehicle  VARCHAR(MAX)
           ,@jsonSupport  VARCHAR(MAX)
           ,@cardTypeId   VARCHAR
	
    

    DECLARE @tbSupport AS TABLE (
        [Date] DATETIME2 NOT NULL
       ,SupportTypeId INT NOT NULL
       ,VehicleCompanyId INT NOT NULL
       ,CustomerId INT NOT NULL
       ,UserAssignedId INT NOT NULL
       ,CreatedAt DATETIME2 DEFAULT GETDATE()
    )

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
            
           

		    --=========================== SAVING THE JSON DATA ====================================================================== --
            SELECT @jsonCustomer = customer, @jsonVehicle = vehicle,@jsonSupport = jsonSupport
            FROM OPENJSON(@json)  WITH 
            (
                customer    NVARCHAR(MAX) '$.customer'as json
               ,vehicle     NVARCHAR(MAX) '$.vehicle' as json
               ,jsonSupport NVARCHAR(MAX) '$.support' as json
               ,cardTypeId            INT '$.cardTypeId'
            )

            INSERT INTO @tbSupport
                  (vehicleCompanyId,CustomerId,supportTypeId,userAssignedId,[date])
            SELECT vehicleCompanyId,CustomerId,ISNULL(supportTypeId,0),ISNULL(userAssignedId,0),[date]
            FROM OPENJSON(@jsonSupport) WITH 
            (
                vehicleCompanyId INT '$.vehicleCompanyId'
               ,customerId       INT '$.customerId'
               ,supportTypeId    INT '$.supportTypeId'
               ,userAssignedId   INT '$.userAssignedId'
               ,[date]     DATETIME2 '$.date'
            )

			INSERT INTO @tbVehicle
				  ([VehicleTypeId],CountryId,[LicensePlate],[Brand],[Model],[Year],[Color],Engine,Chassis,Cylindraje,[Observation])
			SELECT [VehicleTypeId],CountryId,[LicensePlate],[Brand],[Model],[Year],[Color],Engine,Chassis,Cylindraje,[Observation]
			FROM OPENJSON(@jsonVehicle) WITH
			(
				[VehicleTypeId]        INT '$.vehicleTypeId'
			   ,[CountryId]            INT '$.countryId'
			   ,[LicensePlate] VARCHAR(10) '$.licensePlate'
			   ,[Brand]       VARCHAR(150) '$.brand'
			   ,[Model]       VARCHAR(150) '$.model'
			   ,[Year]                 INT '$.year' 
			   ,[Color]       VARCHAR(150) '$.color' 
			   ,[Engine]      VARCHAR(150) '$.engine' 
			   ,[Chassis]     VARCHAR(150) '$.chassis' 
			   ,[Cylindraje]  VARCHAR(150) '$.cylindraje' 
			   ,[Observation] VARCHAR(300) '$.observation'
			) as dt

            INSERT INTO @tbCustomer 
                  (IDType,IDCard,BusinessName,TradeName,email,telephone,[Address])
            SELECT IDType,IDCard,BusinessName,TradeName,email,telephone,[Address] FROM OPENJSON(@jsonCustomer) WITH 
            (
                IDType         VARCHAR(2) '$.idType'
               ,IDCard        VARCHAR(15) '$.idCard'
               ,BusinessName VARCHAR(300) '$.businessName'
               ,TradeName    VARCHAR(300) '$.tradeName'
               ,Email        VARCHAR(500) '$.email'
               ,telephone    VARCHAR(300) '$.telephone'
               ,[Address]    VARCHAR(500) '$.address'
            )
			

            --=========================== RUPERERATING IN VARIABLES ======================================================================--
			
            SELECT @LicensePlate = LicensePlate FROM @tbVehicle

            SELECT @CustomerId = CustomerId, @VehicleCompanyId = VehicleCompanyId, @Date = [Date] FROM @tbSupport 
			
            SELECT @IDCard = tc.IDCard, @cardTypeId = (SELECT TOP 1 idTipoIdentificacion FROM TipoIdentificacion WITH (NOLOCK) WHERE codigoSri = tc.IDType ) FROM @tbCustomer tc

            SELECT TOP 1 @userId = idUsuario, @CompanyId = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId


            --=========================== VALIDATION OF INFORMATION ===================================================================== --
            IF @VehicleCompanyId = 0
                BEGIN 
                    IF EXISTS (SELECT 1 FROM Mechanical.v_Vehicle WHERE LicensePlate = @LicensePlate AND CompanyId = @CompanyId AND [Deleted] IS NULL)
                        BEGIN
                            SELECT [Common].[ufnSpResponse]('0', 'Ya se encuentra registrado', NULL)
                            RETURN
                        END 
                END 

            -- ========================= TRANSACTION ================================================================================
		    BEGIN TRAN
                
               
                -- EXISTENCE OF THE CUSTOMER OR DRIVER
                IF @CustomerId = 0
                    BEGIN 
                        IF EXISTS (SELECT 1 FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = @IDCard)
                            BEGIN
                                SELECT TOP 1 @CustomerId = Id FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = @IDCard
                            END 
                        ELSE
                            BEGIN 
                                INSERT INTO Customer.Customer
                                      (IDType, IDCard, BusinessName, TradeName, email, telephone, [Address], SriValidation)
                                SELECT IDType, IDCard, BusinessName, TradeName, email, telephone, [Address], SriValidation FROM @tbCustomer 

                                SELECT @CustomerId = SCOPE_IDENTITY()
                            END

                        IF EXISTS (SELECT 1 FROM dbo.Cliente WITH (NOLOCK) WHERE numeroIdentificacion = @IDCard AND idEntidad = @CompanyId)
                            BEGIN
                                SELECT @CustomerId = idCliente FROM dbo.Cliente WITH (NOLOCK) WHERE numeroIdentificacion = @IDCard AND idEntidad = @CompanyId
                            END 

                        ELSE 
                            BEGIN
                                INSERT INTO dbo.Cliente
                                        (idEntidad,idTipoIdentificacion,numeroIdentificacion,nombreFiscal,nombreComercial,direccion,correo,telefono,validationSri,customerId)
                                SELECT @CompanyId,@CardTypeId,IDCard,TradeName,BusinessName,[Address],Email ,telephone,SriValidation,@CustomerId FROM @tbCustomer

                                SELECT @CustomerId = SCOPE_IDENTITY()
                            END 
                    END 

                  -- EXISTENCE OF THE VEHICLE ---
                IF @VehicleCompanyId = 0 
                    BEGIN 
			            IF EXISTS (SELECT 1 FROM Mechanical.v_Vehicle WITH (NOLOCK) WHERE LicensePlate = @LicensePlate)
				            BEGIN
					            SELECT TOP 1 @VehicleId = VehicleId FROM Mechanical.v_Vehicle WITH (NOLOCK) WHERE LicensePlate = @LicensePlate
				            END
			            ELSE 
				            BEGIN
					             INSERT INTO [Mechanical].[Vehicle]
							           (CountryId,[VehicleTypeId],[LicensePlate],[Brand],[Model],[Year],[Color],Engine,Chassis,Cylindraje,[CreatedAt],[Enabled])
					             SELECT CountryId,[VehicleTypeId],[LicensePlate],[Brand],[Model],[Year],[Color],Engine,Chassis,Cylindraje,[CreatedAt],[Enabled] FROM @tbVehicle

					             SELECT @VehicleId = SCOPE_IDENTITY()
				            END

                        INSERT INTO [Mechanical].[VehicleCompany]
					           (VehicleId,CompanyId,UserId,CustomerId,Observation,CreatedAt,Enabled)
			            SELECT @VehicleId,@CompanyId,@userId,@CustomerId,[Observation],[CreatedAt],[Enabled] FROM @tbVehicle

                        SELECT @VehicleCompanyId = SCOPE_IDENTITY()
                    END 
                
                -- CUSTOMER RECORD -- 
                UPDATE [Mechanical].[Support]
                   SET [Date]             = GETDATE()
                      ,[VehicleCompanyId] = @VehicleCompanyId
                      ,[CustomerId]       = @CustomerId
                      ,[UserAssignedId]   = 1
                      ,[UpdatedAt]        = GETDATE()
                 WHERE Id = @Id

		    COMMIT TRAN 
            
            SELECT [Common].[ufnSpResponse]('1', 'Éxitos al Editar', NULL)
	END TRY 

	BEGIN CATCH
		
        IF (@@TRANCOUNT > 0) 
            BEGIN 
                ROLLBACK TRAN
            END 

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'Support/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	         
        SELECT [Common].[ufnSpResponse]('0', 'Error al editar La ficha de Soporte', NULL)

    END CATCH 
END
GO

