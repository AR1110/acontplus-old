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

    --> Global  
	DECLARE @tipo INT ,@CompanyId INT

    --> DataJson
    DECLARE @customer VARCHAR(MAX) ,@vehicle VARCHAR(MAX) ,@support VARCHAR(MAX)

    --> Support
    DECLARE @Sequence INT ,@VehicleCompanyId INT ,@PuntoEmisionId INT 

    --> Customer
	DECLARE @CustomerId INT ,@IDCard VARCHAR(15) ,@CardTypeId INT ,@IDType VARCHAR(5)

    --> VehicleCompaby
	DECLARE @LicensePlate VARCHAR(15),@userId INT ,@VehicleId INT
	
    

    DECLARE @tbSupport AS TABLE (
        Id INT UNIQUE NOT NULL
       ,[Date] DATETIME2 NOT NULL
       ,VehicleCompanyId INT NOT NULL
       ,CustomerId INT NOT NULL
       ,UserAssignedId INT NOT NULL
       ,Obs VARCHAR(300) NOT NULL
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
        --> SAVING THE JSON DATA 
        SELECT @customer = customer
              ,@vehicle  = vehicle
              ,@support  = support
        FROM OPENJSON(@json)  WITH 
        (
            customer NVARCHAR(MAX) as json
           ,vehicle  NVARCHAR(MAX) as json
           ,support  NVARCHAR(MAX) as json
        )

        INSERT INTO @tbSupport
              (vehicleCompanyId,CustomerId,userAssignedId,Obs,[date])
        SELECT vehicleCompanyId,CustomerId,userAssignedId,Obs,[date]
        FROM OPENJSON(@support) WITH 
        (
            puntoEmisionId   INT 
           ,vehicleCompanyId INT 
           ,customerId       INT 
           ,supportTypeId    INT 
           ,userAssignedId   INT 
           ,obs              VARCHAR(300) 
           ,[date]           DATETIME2
        )

	    INSERT INTO @tbVehicle
			  ([VehicleTypeId],CountryId,[LicensePlate],[Brand],[Model],[Year],[Color],Engine,Chassis,Cylindraje)
		SELECT [VehicleTypeId],CountryId,[LicensePlate],[Brand],[Model],[Year],[Color],Engine,Chassis,Cylindraje
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
        )

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
			
            SELECT @LicensePlate = LicensePlate FROM @tbVehicle

            SELECT @CustomerId = CustomerId, @VehicleCompanyId = VehicleCompanyId FROM @tbSupport 
			
            SELECT @IDCard = tc.IDCard, @cardTypeId = (SELECT TOP 1 idTipoIdentificacion FROM TipoIdentificacion WITH (NOLOCK) WHERE codigoSri = tc.IDType ) FROM @tbCustomer tc

            SELECT TOP 1 @userId = idUsuario, @CompanyId = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId


            --> VALIDATION OF INFORMATION 
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
                --> EXISTENCE OF THE CUSTOMER OR DRIVER
                IF @VehicleCompanyId = 0
                    BEGIN 
                        --> Customer
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

                        --> Customer Company
                        IF EXISTS (SELECT 1 FROM dbo.Cliente WITH (NOLOCK) WHERE numeroIdentificacion = @IDCard AND idEntidad = @CompanyId)
                            BEGIN
                                SELECT @CustomerId = idCliente FROM dbo.Cliente WITH (NOLOCK) WHERE numeroIdentificacion = @IDCard AND idEntidad = @CompanyId
                            END 

                        ELSE 
                            BEGIN
                                INSERT INTO dbo.Cliente
                                       (idEntidad,idTipoIdentificacion,numeroIdentificacion,nombreFiscal,nombreComercial,direccion,correo,telefono,validationSri,customerId)
                                SELECT @CompanyId,@CardTypeId,IDCard,TradeName,BusinessName,[Address],Email ,telephone,SriValidation,@CustomerId 
                                FROM @tbCustomer

                                SELECT @CustomerId = SCOPE_IDENTITY()
                            END 
                 
                        --> Vehicle
			            IF EXISTS (SELECT 1 FROM Mechanical.Vehicle WITH (NOLOCK) WHERE LicensePlate = @LicensePlate)
				            BEGIN
					            SELECT TOP 1 @VehicleId = Id FROM Mechanical.Vehicle WITH (NOLOCK) WHERE LicensePlate = @LicensePlate
				            END
			            ELSE 
				            BEGIN
					            INSERT INTO [Mechanical].[Vehicle]
							          (CountryId,[VehicleTypeId],[LicensePlate],[Brand],[Model],[Year],[Color],Engine,Chassis,Cylindraje)
					            SELECT CountryId,[VehicleTypeId],[LicensePlate],[Brand],[Model],[Year],[Color],Engine,Chassis,Cylindraje 
                                FROM @tbVehicle

					            SELECT @VehicleId = SCOPE_IDENTITY()
				            END

                        INSERT INTO [Mechanical].[VehicleCompany]
					           (VehicleId ,CompanyId ,UserId ,CustomerId)
			            SELECT @VehicleId,@CompanyId,@userId,@CustomerId 

                        SELECT @VehicleCompanyId = SCOPE_IDENTITY()
                    END 
                
                -- CUSTOMER RECORD -- 
                UPDATE sp WITH (ROWLOCK)
                   SET [Date]             = ts.[Date]
                      ,[VehicleCompanyId] = ts.VehicleCompanyId
                      ,[CustomerId]       = ts.CustomerId
                      ,[UserAssignedId]   = ts.UserAssignedId
                      ,Obs                = ts.Obs
                      ,[UpdatedAt]        = GETDATE()
                FROM [Mechanical].[Support] sp
                INNER JOIN @tbSupport       ts ON ts.Id = sp.Id

		    COMMIT TRAN 
            SELECT [Common].[ufnSpResponse]('1', 'Éxitos al Editar', NULL)
	END TRY 

	BEGIN CATCH
        IF (@@TRANCOUNT > 0) 
            BEGIN 
                ROLLBACK TRAN
            END 

        INSERT INTO ErroresSistema
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'Support/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),dbo.ufnGetDateEcuador(),@userId
	         
        SELECT [Common].[ufnSpResponse]('0', 'Error en el procedimiento', NULL)
    END CATCH  
END
GO

