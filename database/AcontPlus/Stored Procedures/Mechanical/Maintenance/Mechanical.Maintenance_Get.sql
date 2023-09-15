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
CREATE OR ALTER PROCEDURE Mechanical.Maintenance_Get 
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    
    DECLARE @tipo INT 
           ,@UserAssignedId INT 
           ,@SupportId INT

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')

    -- GET PARA TRAER LA BANDEJA DE SOPORTES DEL USUARIO
    IF @tipo = 2
        BEGIN
            
            SELECT TOP 1  @UserAssignedId = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

            SET @tableNames = 'trays'

            SELECT Id as SupportId
                  ,FORMAT([Date], 'dd/MM/yyyy HH:mm') as [Date]
                  ,[Common].[ufnGetSerieDocument](estab,ptoEmi,[Sequence],0) as [Sequence] 
                  ,TradeName
                  ,LicensePlate
                  ,Obs
            FROM Mechanical.v_Support 
            WHERE [Status] = 0
              AND UserAssignedId = @UserAssignedId
            ORDER BY Id DESC
        END 

    -- GET DATA FORM FOR INSPECTION 
    IF @tipo = 3
        BEGIN   
            SELECT @SupportId = SupportId FROM OPENJSON(@json) WITH (SupportId INT '$.supportId')

            SET @tableNames = 'support'

            SELECT [Common].[ufnGetSerieDocument](estab,ptoEmi,[Sequence],0) as [Sequence] 
                  ,Brand
                  ,VehicleType
            FROM Mechanical.v_Support 
            WHERE Id = @SupportId
        END 
END
