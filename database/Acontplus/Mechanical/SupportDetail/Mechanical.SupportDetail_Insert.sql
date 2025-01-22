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
    DECLARE @CompanyId INT, @UserId INT ,@SupportStatusId INT ,@supportId INT
    
    --> Data json 
    DECLARE @support VARCHAR(MAX) ,@supportDetails VARCHAR(MAX)

    DECLARE @tbSupport AS TABLE(
        Id INT UNIQUE NOT NULL
       ,Total NUMERIC(18,5) NOT NULL
       ,Discount NUMERIC(18,5) NOT NULL
    )

    DECLARE @tbSupportDetail AS TABLE(
        orderIndex INT NOT NULL
       ,Id INT NOT NULL 
       ,ArticuloId INT NOT NULL
       ,TarifaId INT NOT NULL
       ,BodegaId INT NOT NULL
       ,MedidaId INT NOT NULL
       ,TaxId    INT NOT NULL
       ,TaxPercentId INT NOT NULL
       ,[Description] VARCHAR(300) NOT NULL
       ,Quantity NUMERIC(18,5) NOT NULL
       ,Price NUMERIC(18,5) NOT NULL
       ,Cost NUMERIC(18,5) NOT NULL
       ,TaxValue NUMERIC(18,5) NOT NULL
       ,Discount NUMERIC(18,5) NOT NULL 
       ,Total NUMERIC(18,5) NOT NULL
       ,Inventory BIT NOT NULL
       ,[Enabled] BIT NOT NULL
       ,Deleted BIT NULL
       ,Obs VARCHAR(300) NULL
    )

    BEGIN TRY 
        --> Variables Generales
        SELECT TOP 1 @CompanyId = idEntidad , @UserId = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json
        SELECT @support        = support
              ,@supportDetails = supportDetails 
        FROM OPENJSON(@json) WITH 
        (
            support        NVARCHAR(MAX) as json
           ,supportDetails NVARCHAR(MAX) as json
        )


        INSERT INTO @tbSupport 
              (Id,Total,Discount)
        SELECT Id,Total,Discount FROM
        OPENJSON(@support) WITH 
        (
            id       INT
           ,total    NUMERIC(18,5)
           ,discount NUMERIC(18,5)
        )

        INSERT INTO @tbSupportDetail 
              (orderIndex,Id,ArticuloId,TarifaId,BodegaId,MedidaId,TaxId,TaxPercentId,[Description],Quantity,Price,Cost,TaxValue,Discount,Total,Inventory,Obs,[Enabled],Deleted)
        SELECT orderIndex,Id,ArticuloId,TarifaId,BodegaId,MedidaId,TaxId,TaxPercentId,[Description],Quantity,Price,Cost,TaxValue,Discount,Total,Inventory,Obs,[Enabled],Deleted
        FROM OPENJSON(@supportDetails) WITH 
        (  
             orderIndex     INT
            ,id             INT
            ,articuloId     INT  
            ,tarifaId       INT 
            ,bodegaId       INT 
            ,medidaId       INT 
            ,taxId          INT
            ,taxPercentId   INT
            ,[description]  VARCHAR(300) 
            ,quantity       NUMERIC(18,5) 
            ,price          NUMERIC(18,5) 
            ,cost           NUMERIC(18,5)
            ,taxValue       NUMERIC(18,5)
            ,discount       NUMERIC(18,5)
            ,total          NUMERIC(18,5)  
            ,inventory      BIT
            ,[enabled]      BIT 
            ,deleted        BIT
            ,obs            VARCHAR(300)
        )

        --> VARIABLES
        SELECT TOP 1 @SupportStatusId = Id from Mechanical.SupportStatus WITH (NOLOCK) WHERE Code = 'PR'

        SELECT TOP 1 @supportId = Id FROM @tbSupport

        --> VALIDATION 
        IF NOT EXISTS(SELECT 1 FROM @tbSupportDetail)
            BEGIN
                SELECT [Common].[ufnSpResponse]('0', 'Error en el detalle del soporte', NULL)
                RETURN
            END

        IF NOT EXISTS(SELECT 1 FROM @tbSupport)
            BEGIN
                SELECT [Common].[ufnSpResponse]('0', 'Error en el soporte', NULL)
                RETURN
            END

        BEGIN TRAN
            
            UPDATE sp WITH (ROWLOCK)
               SET sp.SupportStatusId = @SupportStatusId 
                  ,sp.Total           = ts.Total
                  ,sp.Discount        = ts.Discount
            FROM Mechanical.Support sp 
            INNER JOIN @tbSupport   ts ON ts.Id = sp.Id

            UPDATE md WITH (ROWLOCK)
               SET md.TarifaId       = td.TarifaId
                  ,md.MedidaId       = td.MedidaId
                  ,md.BodegaId       = td.BodegaId
                  ,md.TaxId          = td.TaxId
                  ,md.TaxPercentId   = td.TaxPercentId
                  ,md.[Description]  = td.[Description]
                  ,md.Quantity       = td.Quantity
                  ,md.Price          = td.Price
                  ,md.Discount       = td.Discount
                  ,md.TaxValue       = td.TaxValue
                  ,md.Total          = td.Total
                  ,md.Deleted        = td.Deleted
                  ,md.[Enabled]      = td.[Enabled]
                  ,md.UpdatedAt      = GETDATE()
                  ,md.Obs            = td.Obs
            FROM Mechanical.SupportDetail md 
            INNER JOIN @tbSupportDetail   td ON td.Id = md.Id

            INSERT INTO [Mechanical].[SupportDetail]
                   (SupportId,ArticuloId,TarifaId,BodegaId,MedidaId,TaxId,TaxPercentId,[Description],Quantity,Price,Cost,Discount,TaxValue,Total,Obs)
            SELECT @supportId,ArticuloId,TarifaId,BodegaId,MedidaId,TaxId,TaxPercentId,[Description],Quantity,Price,Cost,Discount,TaxValue,Total,Obs 
            FROM @tbSupportDetail 
            WHERE Id = 0 
            ORDER BY orderIndex ASC

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
