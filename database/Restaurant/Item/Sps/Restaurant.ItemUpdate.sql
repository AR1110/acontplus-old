USE [Acontplus]
GO
/****** Object:  StoredProcedure [Restaurant].[Item_Update]    Script Date: 6/10/2025 16:07:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--- Author: Ignacio Manchu.
--- Description: Update 
--- Date: 2023-08-17
--- Restaurant.Item_Update 139, 17, '{"itemJson": {"id": 17,"summary": "","cooking": true,"recipe": "* 100 GRAMOS DE CARNE\n* 1 PAN DE HAMBURGUESA\n* 1/2 ONZA DE LECHUGA\n* 1/2 ONZA DE TOCINO",   "instructions": "","content": "","createdAt": "2023-09-05T08:56:34.6466667","updatedAt": null,"enabled": true,"deleted": false,"userId": 115,"productId": 77491,"descripcion": "HAMBURGUESA DOBLE CARNE","s3ObjectUrl": "https://s3.us-east-2.amazonaws.com/0703885640001/articulos/7b54a4cb-799b-49d2-9621-d1694f5bc15a.PNG","stockMinimo": 0,"stock": 18,"codigo": "COMR1","codigoAuxiliar": "AUX-COMR1","tipoIva": "12%","tipoArticulo": "Ninguna","style": "","productionAreaId": 1,"descripcionProductionArea": "COCINA","pvp": "{\"idArticuloPvP\":367360,\"idTarifa\":528,\"precioVenta\":4.46429,\"precioConIva\":5.00000,\"porcentajeUtilidad\":123.21429,\"precioPredeterminado\":true,\"tarifa\":\"PVP1\",\"porcentajeIva\":12.00000}","totalRecords": 9},"productionAreaJson": {"productionAreaId": 1},"recipeJson": [{"id": 10,"itemId": 17,"quantity": 1,"unit": 0,"instructions": "MANCHU","weight": 0,"netWeight": 0,"enabled": true,"ingredientId": 5,"summary": "TOCINO X LIBRA"},{"id": 11,"itemId": 17,"quantity": 1,"unit": 0,"instructions": "TUMINK","weight": 0,"netWeight": 0,"enabled": true,"ingredientId": 6,"summary": "PAN DE HAMBURGUESA"}, ]}'
CREATE OR ALTER PROCEDURE Restaurant.ItemUpdate
     @UserRoleId INT
    ,@Id INT
    ,@Json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Variables Globales
    DECLARE @UserId INT

    --> Data Json
    DECLARE @Compositions NVARCHAR(MAX)
            
    --> Tablas temporales
    DECLARE @TbItem AS TABLE
    (
        Id                        INT NOT NULL
       ,[Summary]                 VARCHAR(500) NULL
       ,[PreparationTimeMinutes]  INT NULL
       ,[RequiresCooking]         BIT NOT NULL
       ,[PreparationInstructions] VARCHAR(MAX) NULL
       ,IsActive                  BIT NOT NULL
       ,UpdatedAt                 DATETIME2 DEFAULT GETDATE()
       ,UpdatedByUserId           INT NOT NULL
    )
   
    DECLARE @TbItemComposition AS TABLE
    (
        [Id]                  INT NOT NULL
       ,[ParentItemId]        INT NOT NULL
       ,[ChildItemId]         INT NOT NULL
       ,[ParentCompositionId] INT NULL
       ,[FeeId]               INT NULL
       ,[MeasureId]           INT NULL
       ,[Quantity]            NUMERIC(18,5) NOT NULL
       ,[SalePrice]           NUMERIC(18,5) NOT NULL
       ,[UnitPrice]           NUMERIC(18,5) NOT NULL
       ,[TotalPrice]          NUMERIC(18,5) NOT NULL
       ,[TotalCost]           NUMERIC(18,5) NOT NULL
       ,[WastePercentage]     NUMERIC(18,5) NULL
       ,[IsOptional]          BIT NOT NULL
       ,[ExtraCharge]         NUMERIC(18,5) NULL
       ,[UniqueId]            VARCHAR(MAX) NULL
       ,[IsActive]            BIT NOT NULL
       ,[IsDeleted]           BIT NOT NULL
       ,[UpdatedAt]           DATETIME2 DEFAULT GETDATE()
       ,[CompositionLevel]    INT NOT NULL DEFAULT 1
       ,[CreatedByUserId]     INT NOT NULL
       ,[UpdatedByUserId]     INT NOT NULL
    )

	BEGIN TRY
        --> Variables Globales
        SELECT TOP 1 @UserId = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        --> DataJson
        SELECT @Compositions = compositions FROM OPENJSON(@json) WITH (compositions NVARCHAR(MAX) AS JSON)

        INSERT INTO @tbItem
              ( Id, Summary, PreparationTimeMinutes, RequiresCooking, PreparationInstructions, IsActive, UpdatedByUserId)
        SELECT @Id, Summary, PreparationTimeMinutes, RequiresCooking, PreparationInstructions, IsActive, @UserId
        FROM OPENJSON(@Json) WITH
        (
             summary                    VARCHAR(500)
            ,preparationTimeMinutes     INT
            ,requiresCooking            BIT
            ,preparationInstructions    VARCHAR(MAX)
            ,isActive                   BIT
        )

        INSERT INTO @TbItemComposition
              (Id,ParentItemId,ChildItemId,ParentCompositionId,FeeId,MeasureId,Quantity,UnitPrice,SalePrice,TotalCost,TotalPrice,WastePercentage,IsOptional,ExtraCharge,UniqueId,IsActive,IsDeleted,CreatedByUserId,UpdatedByUserId)
        SELECT id,@Id         ,childItemId,parentCompositionId,feeId,measureId,quantity,unitPrice,salePrice,totalCost,totalPrice,wastePercentage,isOptional,extraCharge,uniqueId,isActive,isDeleted,@UserId       ,@UserId
        FROM OPENJSON(@Compositions) WITH
        (
             [id]                    INT
            ,[childItemId]           INT
            ,[parentCompositionId]   INT
            ,[feeId]                 INT
            ,[measureId]             INT
            ,[quantity]              NUMERIC(18,5)
            ,[unitPrice]             NUMERIC(18,5)
            ,[salePrice]             NUMERIC(18,5)
            ,[totalCost]             NUMERIC(18,5)
            ,[totalPrice]            NUMERIC(18,5)
            ,[wastePercentage]       NUMERIC(18,5)
            ,[isOptional]            BIT
            ,[extraCharge]           NUMERIC(18,5)
            ,[uniqueId]              VARCHAR(MAX)
            ,[isActive]              BIT
            ,[isDeleted]             BIT
        )

        --> Validation
        IF NOT EXISTS (SELECT 1 FROM @tbItem)
            BEGIN
                SELECT '0' code, 'Error en la informacion del item' as 'message'
                RETURN
            END

        IF NOT EXISTS (SELECT 1 FROM @TbItemComposition)
            BEGIN
                SELECT '0' code, 'Error en la informacion del detalle' as 'message'
                RETURN
            END

		BEGIN TRAN
            --> Item
            UPDATE it SET 
                   it.summary                 = ti.summary 
                  ,it.PreparationTimeMinutes  = ti.PreparationTimeMinutes 
                  ,it.RequiresCooking         = ti.RequiresCooking
                  ,it.PreparationInstructions = ti.PreparationInstructions
                  ,it.IsActive                = ti.IsActive
                  ,it.UpdatedAt               = ti.UpdatedAt
                  ,it.UpdatedByUserId         = ti.UpdatedByUserId
            FROM Restaurant.Item it
            INNER JOIN @tbItem   ti ON ti.Id = it.Id
            
            --> INSERT RECIPE IF NOT EXISTS
            INSERT INTO Restaurant.ItemComposition
                  (ParentItemId,ChildItemId,ParentCompositionId,FeeId,MeasureId,Quantity,UnitPrice,SalePrice,TotalCost,TotalPrice,WastePercentage,IsOptional,ExtraCharge,[CompositionLevel],UniqueId,IsActive,IsDeleted,CreatedByUserId)
            SELECT ParentItemId,ChildItemId,ParentCompositionId,FeeId,MeasureId,Quantity,UnitPrice,SalePrice,TotalCost,TotalPrice,WastePercentage,IsOptional,ExtraCharge,[CompositionLevel],UniqueId,IsActive,IsDeleted,CreatedByUserId
            FROM @TbItemComposition
            WHERE Id = 0

            --> UPDATE RECIPE 
            UPDATE rr SET
                   rr.ParentItemId        = tr.ParentItemId
                  ,rr.ChildItemId         = tr.ChildItemId
                  ,rr.ParentCompositionId = tr.ParentCompositionId
                  ,rr.FeeId               = tr.FeeId
                  ,rr.MeasureId           = tr.MeasureId
                  ,rr.Quantity            = tr.Quantity
                  ,rr.UnitPrice           = tr.UnitPrice
                  ,rr.SalePrice           = tr.SalePrice
                  ,rr.TotalCost           = tr.TotalCost
                  ,rr.WastePercentage     = tr.WastePercentage
                  ,rr.IsOptional          = tr.IsOptional
                  ,rr.ExtraCharge         = tr.ExtraCharge
                  ,rr.UniqueId            = tr.UniqueId
                  ,rr.IsActive            = tr.IsActive
                  ,rr.IsDeleted           = tr.IsDeleted
            FROM Restaurant.ItemComposition rr
            INNER JOIN @TbItemComposition tr ON tr.Id = rr.Id;

            IF EXISTS (SELECT 1 FROM Restaurant.ItemComposition rr WHERE rr.ParentItemId = @Id AND rr.IsOptional = 0 AND rr.UniqueId IS NOT NULL )
                BEGIN 
                    UPDATE rr SET
                           rr.ParentCompositionId = (SELECT TOP 1 sc.Id FROM Restaurant.ItemComposition sc WHERE sc.UniqueId = rr.UniqueId AND sc.ParentItemId = @Id AND sc.IsOptional = 1)
                          ,rr.UniqueId            = NULL
                    FROM Restaurant.ItemComposition rr
                    WHERE rr.ParentItemId = @Id
                      AND rr.IsOptional = 0
                      AND rr.UniqueId IS NOT NULL

                    UPDATE Restaurant.ItemComposition SET UniqueId = NULL WHERE ParentItemId = @Id AND IsOptional = 1
                END 
              
		COMMIT TRAN
        SELECT '1' code, 'Actualizado exitosamente' as 'message'
	END TRY

	BEGIN CATCH
        --> Variables locales para el error
        DECLARE @ErrorNumber    INT            = ERROR_NUMBER()
               ,@ErrorSeverity  INT            = ERROR_SEVERITY()
               ,@ErrorState     INT            = ERROR_STATE()
               ,@ErrorProcedure NVARCHAR(128)  = ERROR_PROCEDURE()
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Restaurant/item/Put'

        SELECT @ErrorDetails = (
            SELECT @Id                  AS ItemId
                  ,@UserRoleId          AS PageSize
                  ,@Json                as dataJson
            FOR JSON PATH
        );

        IF (@@TRANCOUNT > 0) ROLLBACK TRAN

        INSERT INTO ErroresSistema
               (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage,errorDate,idUsuario,errorDetails)
        SELECT @Token,@Method,@ErrorNumber,@ErrorSeverity,@ErrorState,@ErrorProcedure,@ErrorLine,@ErrorMessage,GETDATE(),@UserId, @ErrorDetails;

        SELECT '0' code, 'Error al actualizar el item' as 'message'
     END CATCH
END 
