USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Almacen].[Articulo_Get]    Script Date: 12/14/2022 8:56:06 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-25
-- Description:	SP Para leer los datos e la tabla articulo
-- =============================================
CREATE OR ALTER PROCEDURE Mechanical.Inspection_Get
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    
    DECLARE @tipo INT ,@SupportId INT ,@UserId INT ,@Id INT

    SELECT TOP 1 @UserId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    BEGIN TRY
        
        --> GET 
        IF @tipo = 1 
            BEGIN
                SET @tableNames = 'inspection'

                SELECT Id
                      ,SupportId
                      ,Mileage
	                  ,Fuellevel
	                  ,BusinessName
	                  ,LicensePlate
	                  ,Brand + '-' + Model as Brand 
	                  ,VehicleType 
                      ,CodEstab            as codEstab
                FROM Mechanical.v_Inspection WITH (NOLOCK)
                WHERE UserId = @UserId
                ORDER BY Id DESC
                
                RETURN 
            END 

        --> GET DATA FORM FOR INSPECTION 
        IF @tipo = 2
            BEGIN   
                SELECT @SupportId = SupportId FROM OPENJSON(@json) WITH (supportId INT)

                SET @tableNames = 'support,VehiclePartType,VehiclePart'

                SELECT id as SupportId
                      ,[Common].[ufnGetSerieDocument](estab,ptoEmi,[Sequence],0) as [Sequence] 
                      ,Brand
                      ,VehicleType
                      ,[Model]
                      ,Color
                      ,Engine
                FROM Mechanical.v_Support WITH (NOLOCK)
                WHERE Id = @SupportId

                SELECT Id
                      ,Code
                      ,[Description] 
                FROM Mechanical.VehiclePartType 
                WHERE [Enabled] = 1
                  AND Deleted IS NULL 

                SELECT Id
                      ,VehiclePartTypeId
                      ,Code
                      ,[Description] 
                FROM Mechanical.VehiclePart 
                WHERE [Enabled] = 1
                  AND Deleted IS NULL 
                ORDER BY VehiclePartTypeId ASC

                RETURN
            END 

        --> GET FOR EDIT 
        IF @tipo = 3
            BEGIN
            
                SELECT @Id = id FROM OPENJSON(@json) WITH (id INT)

                SELECT @SupportId =  SupportId FROM Mechanical.v_Inspection WITH (NOLOCK) WHERE Id = @Id

                SET @tableNames = 'inspection'

                SELECT Id
                      ,[Date]
                      ,Mileage
                      ,FuelLevel
                      ,obs
                      ,Engine
                      ,Cabin
                      ,Bearing
                      ,Transmission
                      ,Lighting
                      ,Brake
                      ,Steering
                      ,Suspension
                FROM Mechanical.v_Inspection WITH (NOLOCK) WHERE Id = @Id

                RETURN 
            END 
    
    END TRY

    BEGIN CATCH 
        INSERT INTO ErroresSistema
            (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'Inspection/Get',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),dbo.ufnGetDateEcuador(),@userId
	         
        SELECT [Common].[ufnSpResponse]('0', 'Error en el procedimiento', NULL)
    END CATCH 

    

END
