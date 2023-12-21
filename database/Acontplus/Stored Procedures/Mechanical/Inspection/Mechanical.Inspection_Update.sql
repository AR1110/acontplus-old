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
CREATE OR ALTER PROCEDURE Mechanical.Inspection_Update @userRoleId INT ,@id INT ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    
    DECLARE @CompanyId INT, @UserId INT , @jsonInspection VARCHAR(MAX)
    DECLARE @Date DATETIME2,
            @Mileage INT,
            @FuelLevel VARCHAR(150),
            @Engine VARCHAR(MAX),
            @Cabin VARCHAR(MAX),
            @Bearing VARCHAR(MAX),
            @Transmission VARCHAR(MAX),
            @Lighting VARCHAR(MAX),
            @Brake VARCHAR(MAX),
            @Steering VARCHAR(MAX),
            @Suspension VARCHAR(MAX),
            @Obs VARCHAR(300)
    
    DECLARE @tbInspection AS TABLE (
        [Date] DATETIME2 NOT NULL
       ,Mileage INT NOT NULL
       ,FuelLevel VARCHAR(150) NOT NULL
       ,Engine VARCHAR(MAX) NOT NULL
       ,Cabin VARCHAR(MAX) NOT NULL
       ,Bearing VARCHAR(MAX) NOT NULL
       ,Transmission VARCHAR(MAX) NOT NULL
       ,Lighting VARCHAR(MAX) NOT NULL
       ,Brake VARCHAR(MAX) NOT NULL
       ,Steering VARCHAR(MAX) NOT NULL
       ,Suspension VARCHAR(MAX) NOT NULL
       ,Obs VARCHAR(300) NULL
    )

    BEGIN TRY 
        
        SELECT @jsonInspection = inspection FROM OPENJSON(@json) WITH (inspection NVARCHAR(MAX) '$.inspection' as json)


        INSERT INTO @tbInspection 
              ([Date],Mileage,FuelLevel,Engine,Cabin,Bearing,Transmission,Lighting,Brake,Steering,Suspension,Obs)
        SELECT [Date],Mileage,FuelLevel,Engine,Cabin,Bearing,Transmission,Lighting,Brake,Steering,Suspension,Obs
        FROM OPENJSON(@jsonInspection) WITH 
        (
            [Date]          DATETIME2 '$.date' 
           ,Mileage               INT '$.mileage' 
           ,FuelLevel    VARCHAR(150) '$.fuelLevel' 
           ,Engine       VARCHAR(MAX) '$.engine'       
           ,Cabin        VARCHAR(MAX) '$.cabin'         
           ,Bearing      VARCHAR(MAX) '$.bearing'      
           ,Transmission VARCHAR(MAX) '$.transmission'  
           ,Lighting     VARCHAR(MAX) '$.lighting'     
           ,Brake        VARCHAR(MAX) '$.brake'        
           ,Steering     VARCHAR(MAX) '$.steering'     
           ,Suspension   VARCHAR(MAX) '$.suspension'
           ,Obs          VARCHAR(300) '$.obs'
        )

        -- ======================= VARIABLES ===============================

        SELECT TOP 1 @CompanyId = idEntidad , @UserId = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @Date = [Date],
                     @Mileage = Mileage,
                     @FuelLevel = FuelLevel,
                     @Engine = Engine,
                     @Cabin = Cabin,
                     @Bearing = Bearing,
                     @Transmission = Transmission,
                     @Lighting = Lighting,
                     @Brake = Brake,
                     @Steering = Steering,
                     @Suspension = Suspension,
                     @Obs = Obs
         FROM @tbInspection

        -- ======================= VALIDATION =============================== 
        IF (SELECT COUNT(*) FROM @tbInspection) = 0 
            BEGIN
                 SELECT [Common].[ufnSpResponse]('0', 'Error en la información al registrar', NULL)
                 RETURN
            END 

        BEGIN TRAN 

            UPDATE [Mechanical].[Inspection]
            SET [Date] = @Date ,
                [Mileage] = @Mileage ,
                [FuelLevel] = @FuelLevel ,
                [Engine] = @Engine ,
                [Cabin] = @Cabin ,
                [Bearing] = @Bearing ,
                [Transmission] = @Transmission ,
                [Lighting] = @Lighting ,
                [Brake] = @Brake ,
                [Steering] = @Steering ,
                [Suspension] = @Suspension ,
                [Obs] = @Obs ,
                [UpdatedAt] = GETDATE()
            WHERE Id = @id


        COMMIT TRAN 

        SELECT [Common].[ufnSpResponse]('1', 'Éxitos al Actualizar', NULL)

    END TRY 

    BEGIN CATCH 
        IF (@@TRANCOUNT > 0) 
            BEGIN 
                ROLLBACK TRAN
            END 

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'Inspection/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	         
        SELECT [Common].[ufnSpResponse]('0', 'Error al editar La Inspección', NULL)
    END CATCH 
END


