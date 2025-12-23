USE [AcontPlus]
GO
-- =============================================
-- Author:		Ignacio Manchu
-- Create date: 2025-10-14
-- Description:	SP para listar datos de las ventas para un uso generico
-- =============================================
CREATE OR ALTER PROCEDURE Purchases.GetLookups @Filters VARCHAR(MAX) = NULL
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> DataJson
    DECLARE @IdEntidad INT ,@UserId INT ,@UserRoleId INT;

    --> Variables especiales
    DECLARE @TableNames VARCHAR(MAX) ,@Module NVARCHAR(50) ,@Context NVARCHAR(20);


       --> Tabla Temporal
    CREATE TABLE #LookupResults
    (
        TableName    NVARCHAR(128) NOT NULL
       ,Id           INT NULL
       ,Code         NVARCHAR(100) NULL
       ,[Value]      NVARCHAR(400) NULL
       ,DisplayOrder INT NULL
       ,ParentId     INT NULL
       ,IsDefault    BIT DEFAULT 0
       ,IsActive     BIT DEFAULT 1
       ,[Description] NVARCHAR(MAX) DEFAULT ''
       ,Metadata     NVARCHAR(MAX) NULL
       ,INDEX IX_Temp_TableName CLUSTERED (TableName, Id)
       ,INDEX IX_Temp_TableName_Value NONCLUSTERED (TableName, [Value])
       ,INDEX IX_Temp_TableName_Order NONCLUSTERED (TableName, DisplayOrder)
    );

    BEGIN TRY

        --> Inicializacion de variables
        SET @Module = 'Purchases';
        SET @Context = 'Lookups';

        --> Obtener los nombres de las tablas a consultar
        SET @TableNames = dbo.Common.GetLookupTableNames(@Module, @Context);

        --> Insertar los datos en la tabla temporal
        EXEC dbo.Common.InsertLookupData
            @TableNames = @TableNames,
            @Filters = @Filters,
            @TargetTable = '#LookupResults';

        --> Devolver los resultados
        SELECT *
        FROM #LookupResults
        ORDER BY TableName, DisplayOrder, [Value];

    END TRY
    BEGIN CATCH
        IF OBJECT_ID('tempdb..#LookupResults') IS NOT NULL DROP TABLE #LookupResults;

		--> Variables locales para el error
        DECLARE @ErrorNumber    INT            = ERROR_NUMBER()
               ,@ErrorSeverity  INT            = ERROR_SEVERITY()
               ,@ErrorState     INT            = ERROR_STATE()
               ,@ErrorProcedure NVARCHAR(128)  = 'Purchases.GetLookups'
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Purchases/Lookups';

        SELECT @ErrorDetails = (
            SELECT JSON_QUERY(@Filters) AS Filters
            FOR JSON PATH
        );

		INSERT INTO ErroresSistema WITH (ROWLOCK)
            (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/PurchasesApi/Lookups',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),'Purchases.GetLookups',ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@UserId;

    END CATCH

END
