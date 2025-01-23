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
CREATE OR ALTER PROCEDURE Mechanical.VehicleCompany_Get  
	 @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    
    --> Global
	DECLARE @tipo INT ,@CompanyId INT
    
    --> Filters
    DECLARE @Id INT ,@CustomerId INT

    --> Variables
    SELECT TOP 1 @CompanyId = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)


    BEGIN TRY 

        --> Get
	    IF @tipo = 1
		    BEGIN
			    SET @tableNames = 'vehicles'

			    SELECT Id
                      ,VehicleType
                      ,LicensePlate
                      ,TradeName
                      ,IDCard 
                      ,CASE Code WHEN 'CM' THEN 'fa fa-truck' 
                                 WHEN 'AB' THEN 'fa fa-bus'
                                 WHEN 'TR' THEN 'fa fa-bus'
                                 WHEN 'MC' THEN 'fa fa-motorcycle'
                                 WHEN 'AT' THEN 'fa fa-car'
                       END as icon
                      ,[Enabled]
                FROM Mechanical.v_Vehicle WITH (NOLOCK) 
                WHERE CompanyId = @CompanyId 
                  AND Deleted IS NULL
                ORDER BY Id DESC
            
                RETURN
		    END

        --> DataForm
	    IF @tipo = 2
		    BEGIN
			    SET @tableNames = 'vehicleTypes,countrys'

			    SELECT Id as vehicleTypeId, [Description] FROM Mechanical.VehicleType WITH (NOLOCK) WHERE Deleted IS NULL AND [Enabled] = 1

                SELECT Id as countryId, [Description] FROM Common.Country WITH (NOLOCK) WHERE Deleted IS NULL AND [Enabled] = 1 

                RETURN 
		    END 

        --> GET DATAFORM UPDATE O GET ID
        IF @tipo = 3
            BEGIN
                SET @tableNames = 'customer,vehicle'

                SELECT @Id = id FROM OPENJSON(@json) WITH (id INT)

                SELECT TOP 1 @CustomerId = CustomerId FROM Mechanical.v_Vehicle WITH (NOLOCK) WHERE Id = @Id

                SELECT idCliente as Id 
                      ,IDType
                      ,IDCard
                      ,BusinessName
                      ,TradeName
                      ,Email
                      ,Telephone
                      ,Address
                FROM v_Cliente WITH (NOLOCK)
                WHERE idCliente = @CustomerId

                SELECT Id
                      ,CountryId
                      ,VehicleTypeId
                      ,vehicleId 
                      ,CustomerId
                      ,LicensePlate
                      ,Brand
                      ,Model
                      ,[Year]
                      ,Color
                      ,Engine
                      ,Chassis
                      ,Cylindraje
                      ,[Enabled]
                FROM Mechanical.v_Vehicle WITH (NOLOCK) 
                WHERE Id = @Id

                RETURN 
            END
    END TRY 

    BEGIN CATCH
        DECLARE @userId INT

        SELECT TOP 1 @userId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
        
        INSERT INTO ErroresSistema
            (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'Vehicle/Get',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),dbo.ufnGetDateEcuador(),@userId
	         
        SELECT [Common].[ufnSpResponse]('0', 'Error en el procedimiento', NULL)
    END CATCH 
END
GO
