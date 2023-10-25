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
   
   -- Maintenance
    DECLARE @supportId INT, @CompanyId INT, @UserId INT, @jsonSupport VARCHAR(100) ,@jsonSupportDetails VARCHAR(MAX)
    
    -- Inventory 
	DECLARE @inventory VARCHAR(5)
       
    DECLARE @tbSupportDetail AS TABLE(
        ArticuloId INT NOT NULL
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
       ,[Status] INT DEFAULT 1 
       ,CreatedAt DATETIME2 DEFAULT GETDATE()
       ,[Enabled] BIT DEFAULT 1
    )

    BEGIN TRY 
        
        SELECT @jsonSupport = support ,@jsonSupportDetails = supportDetails FROM OPENJSON(@json) WITH (support  NVARCHAR(100) '$.support', supportDetails NVARCHAR(MAX) '$.supportDetails' as json)

        SELECT @supportId = supportId FROM OPENJSON(@jsonSupport) WITH ( supportId   INT '$.supportId')

        INSERT INTO @tbSupportDetail (ArticuloId,TarifaId,BodegaId,MedidaId,[Description],Quantity,Price,Cost,Total,CodePercentage,[Percentage],Inventory)
                                   SELECT ArticuloId,TarifaId,BodegaId,MedidaId,[Description],Quantity,Price,Cost,Total,CodePercentage,[Percentage],Inventory
                                   FROM OPENJSON(@jsonSupportDetails) WITH 
                                   (
                                        ArticuloId             INT '$.articuloId' 
                                       ,TarifaId               INT '$.tarifaId' 
                                       ,BodegaId               INT '$.bodegaId' 
                                       ,MedidaId               INT '$.medidaId' 
                                       ,[Description] VARCHAR(300) '$.description'
                                       ,Quantity     NUMERIC(18,5) '$.quantity'
                                       ,Price        NUMERIC(18,5) '$.price'
                                       ,Cost         NUMERIC(18,5) '$.cost'
                                       ,Total        NUMERIC(18,5) '$.total'
                                       ,CodePercentage VARCHAR(10) '$.codePercentage'
                                       ,[Percentage] NUMERIC(18,5) '$.percentage'
                                       ,Inventory              BIT '$.inventory'
                                   )

        -- ======================= VARIABLES ===============================

        SELECT TOP 1 @CompanyId = idEntidad , @UserId = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @inventory = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.llevaInventario') FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @CompanyId AND codConfig = 'CI'


        -- ======================= VALIDATION ===============================
        IF (SELECT COUNT(*) FROM @tbSupportDetail) = 0
            BEGIN
                SELECT [Common].[ufnSpResponse]('0', 'Error en el detalle del soporte', NULL)
                RETURN
            END

        BEGIN TRAN
           INSERT INTO [Mechanical].[SupportDetail]
                 ([SupportId],ArticuloId,TarifaId,BodegaId,MedidaId,[Description],Quantity,Price,Cost,Total,CodePercentage,[Percentage],[CreatedAt],[Enabled])
           SELECT @supportId ,ArticuloId,TarifaId,BodegaId,MedidaId,[Description],Quantity,Price,Cost,Total,CodePercentage,[Percentage],[CreatedAt],[Enabled] FROM @tbSupportDetail 

        COMMIT TRAN 

         IF (@supportId > 0) 
            SELECT [Common].[ufnSpResponse]('1', 'Éxitos al guardar', NULL)
         ELSE 
            SELECT [Common].[ufnSpResponse]('0', 'No se pudo guardar el Mantenimiento', NULL)

    END TRY

    BEGIN CATCH 
        IF (@@TRANCOUNT > 0) 
            BEGIN 
                ROLLBACK TRAN
            END 

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'Support/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	         
        SELECT [Common].[ufnSpResponse]('0', 'Error al guardar el detalle de Soporte', NULL)
    END CATCH 
END
