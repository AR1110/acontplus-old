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


	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')

	IF @tipo = 1
		BEGIN
			SET @tableNames = 'Vehicles'
			SELECT Id,VehicleType,LicensePlate,TradeName,IDCard FROM Mechanical.v_Vehicle WITH (NOLOCK) WHERE CompanyId = 7 AND Deleted IS NULL
		END

	IF @tipo = 2
		BEGIN
			SET @tableNames = 'VehicleType'
			SELECT Id as VehicleTypeId, [Description] FROM Mechanical.VehicleType WITH (NOLOCK) WHERE Deleted IS NULL AND [Enabled] = 1
		END 
END
GO
