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
-- DROP PROC Mechanical.SupportDetail_Insert
CREATE OR ALTER PROCEDURE Mechanical.SupportDetail_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
   
    --> Maintenance
    DECLARE @supportId INT, @CompanyId INT, @UserId INT ,@supportDetails VARCHAR(MAX)
    
    DECLARE @tbSupportDetail AS TABLE(
        Id INT NOT NULL 
       ,ArticuloId INT NOT NULL
       ,TarifaId INT NOT NULL
       ,BodegaId INT NOT NULL
       ,MedidaId INT NOT NULL
       ,[Description] VARCHAR(300) NOT NULL
       ,Quantity NUMERIC(18,5) NOT NULL
       ,Price NUMERIC(18,5) NOT NULL
       ,Cost NUMERIC(18,5) NOT NULL
       ,Total NUMERIC(18,5) NOT NULL
       ,CodePercentage VARCHAR(10) NOT NULL
       ,[Percentage] NUMERIC(18,5)
       ,Inventory BIT NOT NULL
       ,CreatedAt DATETIME2 DEFAULT GETDATE()
       ,[Enabled] BIT NOT NULL
       ,Deleted BIT NULL
    )

    BEGIN TRY 
        --> Variables Generales
        SELECT TOP 1 @CompanyId = idEntidad , @UserId = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json
        SELECT @supportId      = supportId
              ,@supportDetails = supportDetails 
        FROM OPENJSON(@json) WITH 
        (
            supportId   INT
           ,supportDetails NVARCHAR(MAX) as json
        )


        INSERT INTO @tbSupportDetail 
              (Id,ArticuloId,TarifaId,BodegaId,MedidaId,[Description],Quantity,Price,Cost,Total,CodePercentage,[Percentage],Inventory,[Enabled],Deleted)
        SELECT Id,ArticuloId,TarifaId,BodegaId,MedidaId,[Description],Quantity,Price,Cost,Total,CodePercentage,[Percentage],Inventory,[Enabled],Deleted
        FROM OPENJSON(@supportDetails) WITH 
        (
             id             INT
            ,articuloId     INT  
            ,tarifaId       INT 
            ,bodegaId       INT 
            ,medidaId       INT 
            ,[description]  VARCHAR(300) 
            ,quantity       NUMERIC(18,5) 
            ,price          NUMERIC(18,5) 
            ,cost           NUMERIC(18,5) 
            ,total          NUMERIC(18,5) 
            ,codePercentage VARCHAR(10) 
            ,[percentage]   NUMERIC(18,5) 
            ,inventory      BIT
            ,[enabled]      BIT 
            ,deleted        BIT
        )


        --> VALIDATION 
        IF (SELECT COUNT(*) FROM @tbSupportDetail) = 0
            BEGIN
                SELECT [Common].[ufnSpResponse]('0', 'Error en el detalle del soporte', NULL)
                RETURN
            END

        BEGIN TRAN
            
            UPDATE Mechanical.Support WITH (ROWLOCK) SET [Status] =  1 WHERE Id = @supportId

            UPDATE md WITH (ROWLOCK)
               SET md.Quantity       = td.Quantity
                  ,md.TarifaId       = td.TarifaId
                  ,md.MedidaId       = td.MedidaId
                  ,md.BodegaId       = td.BodegaId
                  ,md.[Description]  = td.[Description]
                  ,md.Price          = td.Price
                  ,md.CodePercentage = td.CodePercentage
                  ,md.[Percentage]   = td.[Percentage]
                  ,md.Deleted        = td.Deleted
                  ,md.[Enabled]      = td.[Enabled]
                  ,md.UpdatedAt      = GETDATE()
            FROM Mechanical.SupportDetail md 
            INNER JOIN @tbSupportDetail   td ON td.Id = md.Id

            INSERT INTO [Mechanical].[SupportDetail]
                   (SupportId,ArticuloId,TarifaId,BodegaId,MedidaId,[Description],Quantity,Price,Cost,Total,CodePercentage,[Percentage],[CreatedAt],[Enabled])
            SELECT @supportId,ArticuloId,TarifaId,BodegaId,MedidaId,[Description],Quantity,Price,Cost,Total,CodePercentage,[Percentage],[CreatedAt],[Enabled] 
            FROM @tbSupportDetail 
            WHERE Id = 0 

        COMMIT TRAN 
        SELECT [Common].[ufnSpResponse]('1', 'Éxitos al guardar', NULL)
    END TRY

    BEGIN CATCH 
        IF (@@TRANCOUNT > 0) 
            BEGIN 
                ROLLBACK TRAN
            END 

        INSERT INTO ErroresSistema
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'SupportDetail/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),dbo.ufnGetDateEcuador(),@userId
	         
        SELECT [Common].[ufnSpResponse]('0', 'Error en el procedimiento', NULL)
    END CATCH 
END
