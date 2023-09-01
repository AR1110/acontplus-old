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
	DECLARE @tipo INT
    DECLARE @CompanyId INT
    DECLARE @Id INT
    DECLARE @CustomerId INT

    SELECT TOP 1 @CompanyId = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')

    -- GET LIST -- 
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
            FROM Mechanical.v_Vehicle 
            WITH (NOLOCK) 
            WHERE CompanyId = @CompanyId AND Deleted IS NULL
            ORDER BY Id DESC
            
            RETURN
		END

    -- GET DATAFORM -- 
	IF @tipo = 2
		BEGIN
			SET @tableNames = 'vehicleTypes,countrys'
			SELECT Id as vehicleTypeId, [Description] FROM Mechanical.VehicleType WITH (NOLOCK) WHERE Deleted IS NULL AND [Enabled] = 1

            SELECT Id as countryId, [Description] FROM Common.Country WITH (NOLOCK) WHERE Deleted IS NULL AND [Enabled] = 1 
            RETURN 
		END 

    -- GET DATAFORM UPDATE O GET ID -- 
    IF @tipo = 3
        BEGIN
            SET @tableNames = 'customer,vehicle'

            SELECT @Id = Id FROM OPENJSON(@json) WITH (Id INT '$.id')

            SELECT TOP 1 @CustomerId = CustomerId FROM Mechanical.v_Vehicle WITH (NOLOCK) WHERE Id = @Id

            SELECT numeroIdentificacion as idCard
                  ,nombreFiscal as businessName
                  ,correo as email
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
END
GO
