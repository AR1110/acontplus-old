-- ================================================
USE Acontplus
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		DANIS IGNACIO
-- Create date: 2024-04-12
-- Description:	For insert and update OrderMantenaince
-- =============================================
CREATE OR ALTER PROC TechnicalSupport.OrderMantenaince_Insert
@userRoleId INT
, @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    
    DECLARE @date               DATETIME = (SELECT dbo.ufnGetDateEcuador())
        , @userId               INT
        , @order                NVARCHAR(500)
        , @detalles             NVARCHAR(500)
        , @orderId              INT
        , @bodegaId             INT
        , @customerCompanyId    INT
        , @establecimientoId    INT
        , @percentageDiscount   NUMERIC(18,6)
        , @subTotalSinImpuesto  NUMERIC(18,6)
        , @tax                  NUMERIC(18,6)
        , @tip                  NUMERIC(18,6)
        , @total                NUMERIC(18,6)
        , @codDoc               VARCHAR(5)
        , @payload       NVARCHAR(MAX)
        
    BEGIN TRY
        DECLARE @orderMantenaince AS TABLE (
            id                      INT             NULL
            , bodegaId              INT             NOT NULL
            , codigo                NVARCHAR(5)     NOT NULL
            , costoFraccionado      NUMERIC(18,6)   NOT NULL
            , precioConIva          NUMERIC(18,6)   NOT NULL
            , precioTotalImpuesto   NUMERIC(18,6)   NOT NULL
            , feeId                 INT             NOT NULL
            , medidaId              INT             NOT NULL
            , orderDetailId         INT             NOT NULL
            , productId             INT             NOT NULL
            , taxId                 INT             NOT NULL
            , taxPercentId          INT             NOT NULL
            , quantity              NUMERIC(18,6)   NOT NULL
            , cost                  NUMERIC(18,6)   NOT NULL
            , taxValue              NUMERIC(18,6)   NOT NULL
            , price                 NUMERIC(18,6)   NOT NULL
            , discount              NUMERIC(18,6)   NOT NULL
            , total                 NUMERIC(18,6)   NOT NULL
            , subTotalSinImpuesto   NUMERIC(18,6)   NOT NULL
            , obs                   VARCHAR(500)    NULL
        )

        SELECT @order = orden, @detalles = detalles FROM OPENJSON(@json) WITH( orden NVARCHAR(MAX) '$.order' AS JSON, detalles NVARCHAR(MAX) '$.detalles' AS JSON)
        
        SELECT @orderId                 = orderId
                , @bodegaId             = bodegaId
                , @customerCompanyId    = customerCompanyId    
                , @percentageDiscount   = percentageDiscount
                , @subTotalSinImpuesto  = subTotalSinImpuesto
                , @codDoc               = codDoc
                , @tax                  = tax
                , @tip                  = tip
                , @total                = total
        FROM OPENJSON(@order) WITH (
            orderId                 INT             '$.id'
            , bodegaId              INT             '$.bodegaId'
            , customerCompanyId     INT             '$.customerCompanyId'
            , percentageDiscount    NUMERIC(18,6)   '$.percentageDiscount'
            , subTotalSinImpuesto   NUMERIC(18,6)   '$.subTotalSinImpuesto'
            , codDoc                VARCHAR(5)      '$.codDoc'
            , tax                   NUMERIC(18,6)   '$.tax'
            , tip                   NUMERIC(18,6)   '$.tip'
            , total                 NUMERIC(18,6)   '$.total'
        )

        INSERT INTO @orderMantenaince (id, bodegaId, codigo, costoFraccionado, precioConIva, precioTotalImpuesto, feeId, medidaId, orderDetailId, productId, taxId, taxPercentId, quantity, cost, taxValue, price, discount, total, subTotalSinImpuesto, obs)        
        SELECT id, bodegaId, codigo, costoFraccionado, precioConIva, precioTotalImpuesto, feeId, medidaId, orderDetailId, productId, taxId, taxPercentId, quantity, cost, taxValue, price, discount, total, subTotalSinImpuesto, obs
        FROM OPENJSON(@detalles)
        WITH (
            id                              INT             '$.id',
            bodegaId                        INT             '$.bodegaId',
            codigo                          VARCHAR(5)      '$.codigo',
            costoFraccionado                NUMERIC(18,6)   '$.costoFraccionado',
            precioConIva                    NUMERIC(18,6)   '$.precioConIva',
            precioTotalImpuesto             NUMERIC(18,6)   '$.precioTotalImpuesto',
            feeId                           INT             '$.feeId',
            medidaId                        INT             '$.medidaId',
            orderDetailId                   INT             '$.orderDetailId',
            productId                       INT             '$.productId',
            taxId                           INT             '$.taxId',
            taxPercentId                    INT             '$.taxPercentId',
            quantity                        NUMERIC(18,6)   '$.quantity',
            cost                            NUMERIC(18,6)   '$.cost',
            taxValue                        NUMERIC(18,6)   '$.taxValue',
            price                           NUMERIC(18,6)   '$.price',
            discount                        NUMERIC(18,6)   '$.discount',
            total                           NUMERIC(18,6)   '$.total',
            subTotalSinImpuesto             NUMERIC(18,6)   '$.subTotalSinImpuesto',
            obs                             VARCHAR(500)    '$.obs'
        );

        BEGIN TRAN
            IF EXISTS(SELECT TOP 1 1 FROM TechnicalSupport.OrderDetail tsod WITH(NOLOCK)
                      INNER JOIN TechnicalSupport.[Order] tso               WITH(NOLOCK) ON tso.Id = tsod.OrderId
                      WHERE tsod.OrderId = @orderId)
                BEGIN
                    UPDATE TechnicalSupport.[Order]
                    SET CustomerCompanyId   = @customerCompanyId
                        , Tax               = @tax
                        , Tip               = @tip
                        , Total             = @total
                    WHERE Id = @orderId
                    
                    MERGE INTO TechnicalSupport.OrderMaintenance AS target
                    USING @orderMantenaince AS source ON target.id = source.id
                    WHEN MATCHED THEN
                        UPDATE SET
                            target.bodegaId         = source.bodegaId,
                            target.feeId            = source.feeId,
                            target.medidaId         = source.medidaId,
                            target.orderDetailId    = source.orderDetailId,
                            target.productId        = source.productId,
                            target.taxId            = source.taxId,
                            target.taxPercentId     = source.taxPercentId,
                            target.quantity         = source.quantity,
                            target.cost             = source.cost,
                            target.taxValue         = source.taxValue,
                            target.price            = source.price,
                            target.discount         = source.discount,
                            target.total            = source.total,
                            target.obs              = source.obs
                    WHEN NOT MATCHED THEN
                        INSERT (bodegaId, feeId, medidaId, orderDetailId, productId, taxId, taxPercentId, quantity, cost, taxValue, price, discount, total, obs, createdAt, enabled)
                        VALUES (source.bodegaId, source.feeId, source.medidaId, source.orderDetailId, source.productId, source.taxId, source.taxPercentId, source.quantity, source.cost, source.taxValue, source.price, source.discount, source.total, source.obs, @date, 1);

                    SET  @payload = (SELECT orderId = @orderId)
                END
            ----- ========= Transformar el documento ========= --------
            IF @codDoc IS NOT NULL
                BEGIN
                    EXEC TechnicalSupport.Order_Document_Insert @userRoleId, @orderId, @codDoc, @subTotalSinImpuesto, @payload OUTPUT
                END
        COMMIT TRAN
        SELECT '1' AS code, 'Registrado exitosamente' AS 'message', @payload AS payload
    END TRY
    BEGIN CATCH
        IF (@@TRANCOUNT > 0) ROLLBACK TRAN

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'TSOM/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @date, @userId)

        SELECT '0' AS code, 'Error en store procedure' + ERROR_MESSAGE() AS 'message'
    END CATCH
END
GO