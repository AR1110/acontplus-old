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
CREATE OR ALTER PROCEDURE Mechanical.Inspection_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    
    DECLARE @Id INT, @CompanyId INT, @UserId INT 
    
    DECLARE @SupportId INT ,@SupportStatusId INT
    
    DECLARE @tbInspection AS TABLE (
        SupportId INT NOT NULL
       ,[Date] DATETIME2 NOT NULL
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
       ,[Status] INT DEFAULT 0 NOT NULL
       ,CreatedAt DATETIME2 DEFAULT GETDATE() NOT NULL
       ,[Enabled] BIT DEFAULT 1 NOT NULL
    )

    BEGIN TRY 
        
        INSERT INTO @tbInspection 
              (SupportId,[Date],Mileage,FuelLevel,Engine,Cabin,Bearing,Transmission,Lighting,Brake,Steering,Suspension,Obs)
        SELECT SupportId,[Date],Mileage,FuelLevel,Engine,Cabin,Bearing,Transmission,Lighting,Brake,Steering,Suspension,Obs
        FROM OPENJSON(@json) WITH 
        (
            supportId    INT  
           ,[date]       DATETIME2  
           ,mileage      INT  
           ,fuelLevel    VARCHAR(150)  
           ,engine       VARCHAR(MAX)      
           ,cabin        VARCHAR(MAX)      
           ,bearing      VARCHAR(MAX)    
           ,transmission VARCHAR(MAX)
           ,lighting     VARCHAR(MAX)  
           ,brake        VARCHAR(MAX)      
           ,steering     VARCHAR(MAX)    
           ,suspension   VARCHAR(MAX)
           ,obs          VARCHAR(300) 
        )

        -- ======================= VARIABLES ===============================

        SELECT TOP 1 @CompanyId = idEntidad , @UserId = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @SupportId = SupportId FROM @tbInspection

        SELECT TOP 1 @SupportStatusId = Id from Mechanical.SupportStatus WITH (NOLOCK) WHERE Code = 'PR'

        -- ======================= VALIDATION =============================== 
        IF (SELECT COUNT(*) FROM @tbInspection) = 0 
            BEGIN
                 SELECT [Common].[ufnSpResponse]('0', 'Error en la información al registrar', NULL)
                 RETURN
            END 

        IF EXISTS (SELECT 1 FROM Mechanical.Inspection WITH (NOLOCK) WHERE SupportId = @SupportId)
            BEGIN
                 SELECT [Common].[ufnSpResponse]('0', 'Ya se encuentra realizado la inspeccion de esta Ficha', NULL)
                 RETURN
            END 

        BEGIN TRAN 
            
            UPDATE Mechanical.Support WITH (ROWLOCK) SET SupportStatusId = @SupportStatusId WHERE Id = @SupportId

            INSERT INTO [Mechanical].[Inspection]
                  (SupportId,[Date],Mileage,FuelLevel,Engine,Cabin,Bearing,Transmission,Lighting,Brake,Steering,Suspension,Obs, CompanyId, UserId,[Status],CreatedAt,[Enabled])
            SELECT SupportId,[Date],Mileage,FuelLevel,Engine,Cabin,Bearing,Transmission,Lighting,Brake,Steering,Suspension,Obs,@CompanyId,@UserId,[Status],CreatedAt,[Enabled]
            FROM @tbInspection

            SELECT @Id = SCOPE_IDENTITY()

        COMMIT TRAN 
        SELECT [Common].[ufnSpResponse]('1', 'Éxitos al guardar', NULL)
    END TRY 

    BEGIN CATCH 
        IF (@@TRANCOUNT > 0) 
            BEGIN 
                ROLLBACK TRAN
            END 

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'Inspection/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	         
        SELECT [Common].[ufnSpResponse]('0', 'Error al guardar La Inspección', NULL)
    END CATCH 
END
