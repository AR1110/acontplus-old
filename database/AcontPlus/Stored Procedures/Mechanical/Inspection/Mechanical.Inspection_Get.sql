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
    
    DECLARE @tipo INT 
           ,@SupportId INT

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')


    -- GET DATA FORM FOR INSPECTION 
    IF @tipo = 3
        BEGIN   
            SELECT @SupportId = SupportId FROM OPENJSON(@json) WITH (SupportId INT '$.supportId')

            SET @tableNames = 'support,vehicleParts'

            SELECT id as SupportId
                  ,[Common].[ufnGetSerieDocument](estab,ptoEmi,[Sequence],0) as [Sequence] 
                  ,Brand
                  ,VehicleType
                  ,[Model]
                  ,Color
                  ,Engine
            FROM Mechanical.v_Support WITH (NOLOCK)
            WHERE Id = @SupportId

            SELECT Id,Part,CodePart,CodeTypePart FROM Mechanical.v_VehiclePart WITH (NOLOCK) WHERE Deleted IS NULL AND [Enabled] = 1

        END 
END
