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
CREATE OR ALTER PROCEDURE Mechanical.Maintenance_Update @userRoleId INT ,@id INT ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    
    DECLARE @UserId INT ,@jsonMaintenance VARCHAR(MAX) ,@jsonMaintenanceDetails VARCHAR(MAX)
    DECLARE @Date DATETIME2 ,@Obs VARCHAR(300)
    

    DECLARE @tbMaintenance AS TABLE (
        [Date] DATETIME2 NOT NULL
       ,Obs VARCHAR(300) NOT NULL
    )

    DECLARE @tbMaintenanceDetail AS TABLE(
        Id INT NOT NULL
       ,ArticuloId INT NOT NULL
       ,[Description] VARCHAR(300) NOT NULL
       ,Quantity NUMERIC(18,5) NOT NULL
       ,[Status] INT DEFAULT 1 
       ,CreatedAt DATETIME2 DEFAULT GETDATE()
       ,[Enabled] BIT DEFAULT 1
    )

    BEGIN TRY 
        

        SELECT @jsonMaintenance = maintenance ,@jsonMaintenanceDetails = maintenanceDetails FROM OPENJSON(@json) WITH (maintenance NVARCHAR(MAX) '$.maintenance' as json ,maintenanceDetails NVARCHAR(MAX) '$.maintenanceDetails' as json)

      
        INSERT INTO @tbMaintenance ([Date],Obs)
                             SELECT [Date],Obs
                             FROM OPENJSON(@jsonMaintenance) WITH 
                             ( 
                                [Date]          DATETIME2 '$.date'
                               ,Obs          VARCHAR(300) '$.obs'
                             )

        INSERT INTO @tbMaintenanceDetail (Id,ArticuloId,[Description],Quantity)
                                   SELECT Id,ArticuloId,[Description],Quantity
                                   FROM OPENJSON(@jsonMaintenanceDetails) WITH 
                                   (
                                        Id                     INT '$.id' 
                                       ,ArticuloId             INT '$.articuloId' 
                                       ,[Description] VARCHAR(300) '$.description'
                                       ,Quantity      VARCHAR(300) '$.quantity'
                                   )



        -- ======================= VARIABLES ===============================

        SELECT TOP 1 @UserId = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
        
        SELECT TOP 1 @Date = [Date] ,@Obs = Obs FROM @tbMaintenance 

        -- ======================= VALIDATION =============================== 
        IF (SELECT COUNT(*) FROM @tbMaintenance) = 0 
            BEGIN
                SELECT [Common].[ufnSpResponse]('0', 'Error en el mantenimiento', NULL)
                RETURN
            END 

        IF (SELECT COUNT(*) FROM @tbMaintenanceDetail) = 0
            BEGIN
                SELECT [Common].[ufnSpResponse]('0', 'Error en el detalle del mantenimiento', NULL)
                RETURN
            END

        BEGIN TRAN 
            
            UPDATE [Mechanical].[Maintenance]
               SET [Date]      = @Date
                  ,[Obs]       = @Obs
                  ,[UpdatedAt] = GETDATE()
             WHERE Id = @id
           
            UPDATE Mechanical.MaintenanceDetail SET [Deleted] = 1 WHERE MaintenanceId = @id

            UPDATE md 
                SET md.Quantity = td.Quantity
                   ,md.[Deleted] = NULL
                   ,md.UpdatedAt = GETDATE()
            FROM Mechanical.MaintenanceDetail md WITH (NOLOCK)
            INNER JOIN @tbMaintenanceDetail   td ON td.Id = md.Id
            WHERE md.MaintenanceId = @id

            INSERT INTO [Mechanical].[MaintenanceDetail]
                 ([MaintenanceId],[ArticuloId],[Description],[Quantity],[CreatedAt],[Enabled])
            SELECT @Id           ,[ArticuloId],[Description],[Quantity],[CreatedAt],[Enabled] FROM @tbMaintenanceDetail WHERE Id = 0

            DELETE FROM Mechanical.MaintenanceDetail WHERE MaintenanceId = @id AND [Deleted] = 1

        COMMIT TRAN 

        SELECT [Common].[ufnSpResponse]('1', 'Éxitos al editar', NULL)

    END TRY 

    BEGIN CATCH 
        IF (@@TRANCOUNT > 0) 
            BEGIN 
                ROLLBACK TRAN
            END 

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'Maintenance/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	         
        SELECT [Common].[ufnSpResponse]('0', 'Error al editar el Mantenimiento', NULL)
    END CATCH 
END
