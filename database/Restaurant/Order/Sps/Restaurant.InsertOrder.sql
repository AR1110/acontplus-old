USE [Acontplus]
GO
/****** Object:  StoredProcedure [Restaurant].[Order_Get]    Script Date: 15/9/2025 15:17:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE Restaurant.InsertOrder
     @UserRoleId INT
    ,@Json VARCHAR(MAX)

AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Varialbles BD
    DECLARE @UserId INT ,@Sequence INT ,@PuntoEmisionId INT ,@Serie VARCHAR(18)

    DECLARE @TbOrder AS TABLE
    (
        [PuntoEmisionId] INT NOT NULL
       ,[CustomerCompanyId] INT NOT NULL
       ,[Discount] NUMERIC(18,5) NULL
       ,[Tip] NUMERIC(18,5) NULL
       ,[Total] NUMERIC(18,5) NOT NULL
       ,[Obs] VARCHAR(500) NULL
       ,[IsDivided] BIT NOT NULL
       ,[IsFinished] BIT NOT NULL
       ,[CreatedByUserId] INT NOT NULL
    )

    DECLARE @TbOrderDetails AS TABLE
    (
        [ItemId] INT NOT NULL
       ,[TaxPercentId] INT NOT NULL
    )

    BEGIN TRY

        --> Data json
        INSERT INTO @TbOrder
              ([puntoEmisionId],[customerCompanyId],[discount],[tip],[total],[obs],[isdivided],[isfinished],[CreatedByUserId])
        SELECT [puntoEmisionId],[customerCompanyId],[discount],[tip],[total],[obs],[isdivided],[isfinished],[CreatedByUserId]
        FROM OPENJSON(@json)
        WITH
        (
            [puntoEmisionId]    INT
           ,[customerCompanyId] INT
           ,[createdByUserId]   INT
           ,[discount]          NUMERIC(18,5) 
           ,[tip]               NUMERIC(18,5) 
           ,[total]             NUMERIC(18,5)
           ,[obs]               VARCHAR(500) 
           ,[isDivided]           BIT
           ,[isFinished]          BIT
        )

        --> Variables dependientes
        SELECT TOP 1 @PuntoEmisionId = PuntoEmisionId FROM @TbOrder

        SELECT TOP 1 @Sequence = ultimaSecuencia
                    ,@Serie    = es.estab + '-' + pe.ptoEmi + '-' +  FORMAT(cd.ultimaSecuencia, 'D9')
        FROM dbo.ConfiguracionDocumento cd
        INNER JOIN dbo.TipoDocumento    td ON td.idTipoDocumento   = cd.idTipoDocumento
        INNER JOIN dbo.PuntoEmision     pe ON pe.idPuntoEmision    = cd.idPuntoEmision
        INNER JOIN Sri.Establecimiento  es ON es.idEstablecimiento = pe.idEstablecimiento
        WHERE td.codigo = 'OR'

        --> Validaciones
        IF NOT EXISTS (SELECT 1 FROM @TbOrder)
            BEGIN
                SELECT '0' code, 'Error en la informacion de la orden' as 'message'
                RETURN
            END

        IF @Serie IS NULL OR @Sequence IS NULL
            BEGIN
                SELECT '0' code, 'Error en la informacion de la serie del comprobante' as 'message'
                RETURN
            END

        IF EXISTS (SELECT 1 FROM Restaurant.[Order] WHERE PuntoEmisionId = @PuntoEmisionId AND [Sequence] = @Sequence)
            BEGIN
                SELECT '0' code, 'Error, ya se encuentra registrado esta serie del comprobante' as 'message'
                RETURN
            END

        BEGIN TRAN
            INSERT INTO Restaurant.[Order]
                  ([puntoEmisionId],[customerCompanyId],[discount],[tip],[total],[obs],[isDivided],[isFinished],[CreatedByUserId],[Sequence],[Serie])
            SELECT [puntoEmisionId],[customerCompanyId],[discount],[tip],[total],[obs],[isDivided],[isFinished],[CreatedByUserId], @Sequence,@Serie
            FROM @TbOrder

        COMMIT TRAN
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
               ,@Method         VARCHAR(200)   = 'Restaurant/order/Post'

        SELECT @ErrorDetails = (
            SELECT @Json as [json]
            FOR JSON PATH
        );

        IF (@@TRANCOUNT > 0) ROLLBACK TRAN

        INSERT INTO ErroresSistema
               (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage,errorDate,idUsuario,errorDetails)
        SELECT @Token,@Method,@ErrorNumber,@ErrorSeverity,@ErrorState,@ErrorProcedure,@ErrorLine,@ErrorMessage,GETDATE(),@UserId, @ErrorDetails;

    END CATCH
END
