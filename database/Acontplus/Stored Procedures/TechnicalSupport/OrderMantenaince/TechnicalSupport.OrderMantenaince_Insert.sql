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
-- Description:	FOR INSERT AND UPDATE ORDERMANTENAINCE
-- =============================================
-- TechnicalSupport.OrderMantenaince_Insert 401, '{"order":{"id":12,"fechaEmision":"2024-04-15T05:00:00Z","establecimientoId":608,"puntoEmisionId":280,"uuid":"3856fb49-7c7e-4b03-87f0-c6645d6671e7","sequence":5,"serie":"001-002-000000005","tax":0,"discount":0,"tip":0,"total":600,"obs":"CHEVERE","enabled":true,"customerCompanyId":149070,"razonSocial":"SENGUANA WISUMA EMILIO YANKUAM","bodegaId":288,"feeId":1158,"subTotalSinImpuesto":600,"percentageDiscount":0,"codDoc":"FV"},"detalles":[{"rowguid":"0f44559e-b012-497e-981f-7f689a427d38","bodegaId":288,"feeId":1158,"medidaId":848,"orderDetailId":0,"productId":251478,"descripcion":"SERVICIOS INFORMÁTIVOS Y SOPORTE TÉCNICO","codigo":"SER1","taxId":1,"taxPercentId":1,"quantity":1,"cost":600,"precioConIva":600,"taxValue":0,"price":600,"percentageDiscount":0,"discount":0,"precioTotalSinImpuesto":600,"total":600,"obs":"","costoFraccionado":600,"conversion":1}]}'
CREATE OR ALTER PROC TechnicalSupport.OrderMantenaince_Insert
@userRoleId INT
, @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    
    DECLARE @date               DATETIME = (SELECT dbo.ufnGetDateEcuador())
        , @userId               INT
        , @order                NVARCHAR(500)
        , @detalles             NVARCHAR(MAX)
        , @orderId              INT
        , @bodegaId             INT
        , @customerCompanyId    INT
        , @establecimientoId    INT
        , @puntoEmisionId       INT
        , @percentageDiscount   NUMERIC(18,6)
        , @subTotalSinImpuesto  NUMERIC(18,6)
        , @tax                  NUMERIC(18,6)
        , @tip                  NUMERIC(18,6)
        , @total                NUMERIC(18,6)
        , @codDoc               VARCHAR(5)
        , @payload              NVARCHAR(MAX)
        
    BEGIN TRY
        DECLARE @orderMantenaince AS TABLE (
            id                          INT             NULL
            ,bodegaId                   INT             NOT NULL
            , codigo                    NVARCHAR(5)     NOT NULL
            , descripcion               NVARCHAR(500)   NOT NULL
            , costoFraccionado          NUMERIC(18,6)   NOT NULL
            , precioConIva              NUMERIC(18,6)   NOT NULL
            , precioTotalSinImpuesto    NUMERIC(18,6)   NOT NULL
            , orderDetailId             INT             NOT NULL
            , feeId                     INT             NOT NULL
            , medidaId                  INT             NOT NULL
            , productId                 INT             NOT NULL
            , taxId                     INT             NOT NULL
            , taxPercentId              INT             NOT NULL
            , quantity                  NUMERIC(18,6)   NOT NULL
            , cost                      NUMERIC(18,6)   NOT NULL
            , taxValue                  NUMERIC(18,6)   NOT NULL
            , price                     NUMERIC(18,6)   NOT NULL
            , discount                  NUMERIC(18,6)   NOT NULL
            , total                     NUMERIC(18,6)   NOT NULL
            , obs                       VARCHAR(500)    NULL
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
                , @puntoEmisionId       = puntoEmisionId
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
            , puntoEmisionId        INT             '$.puntoEmisionId'
        )
        
        INSERT INTO @orderMantenaince (bodegaId, codigo, descripcion, costoFraccionado, precioConIva, precioTotalSinImpuesto, feeId, medidaId, productId, taxId, taxPercentId, quantity, cost, taxValue, price, discount, total, obs, orderDetailId)
        SELECT bodegaId, codigo, descripcion, costoFraccionado, precioConIva, precioTotalSinImpuesto, feeId, medidaId, productId, taxId, taxPercentId, quantity, cost, taxValue, price, discount, total, obs, orderDetailId
        FROM OPENJSON(@detalles)
        WITH (
            bodegaId                        INT             '$.bodegaId',
            codigo                          VARCHAR(5)      '$.codigo',
            descripcion                     VARCHAR(500)    '$.descripcion',
            costoFraccionado                NUMERIC(18,6)   '$.costoFraccionado',
            precioConIva                    NUMERIC(18,6)   '$.precioConIva',
            precioTotalSinImpuesto          NUMERIC(18,6)   '$.precioTotalSinImpuesto',
            feeId                           INT             '$.feeId',
            medidaId                        INT             '$.medidaId',
            productId                       INT             '$.productId',
            taxId                           INT             '$.taxId',
            taxPercentId                    INT             '$.taxPercentId',
            quantity                        NUMERIC(18,6)   '$.quantity',
            cost                            NUMERIC(18,6)   '$.cost',
            taxValue                        NUMERIC(18,6)   '$.taxValue',
            price                           NUMERIC(18,6)   '$.price',
            discount                        NUMERIC(18,6)   '$.discount',
            total                           NUMERIC(18,6)   '$.total',
            obs                             VARCHAR(500)    '$.obs',
            orderDetailId                   INT             '$.orderDetailId'
        );

        IF NOT EXISTS(SELECT 1 FROM @orderMantenaince)
        BEGIN
            SELECT '0' AS code, 'No se pudo recuperar el detalle' AS 'message'
            RETURN
        END

        IF NOT EXISTS (SELECT TOP 1 1 FROM Config.v_ConfigDocumento cd
				                      INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab AND cd.idPuntoEmision = @puntoEmisionId
			                          WHERE pa.idUsuarioRol = @userRoleId
			                          AND cd.codDoc = 'OTS')
        BEGIN
            SELECT '0' AS code, 'Aun no se ha configurado el secuencial, para ordenes de Soporte de Técnico' AS 'message'
            RETURN
        END
        
        IF EXISTS(SELECT TOP 1 1 FROM TechnicalSupport.[Order] tso              WITH (NOLOCK)
                                 INNER JOIN TechnicalSupport.OrderStatus tsos   WITH (NOLOCK) ON tsos.Id = tso.OrderStatusId
                                 WHERE tso.Id = @orderId AND Finished = 1 AND tsos.Code = 'PE')
        BEGIN
            SELECT '0' as code, 'La orden ya ha sido convertida.' as 'message'
            RETURN
        END 

        BEGIN TRAN

            MERGE INTO TechnicalSupport.OrderMaintenance AS target
            USING @orderMantenaince AS source
            ON target.id = source.id
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
                    target.obs              = source.obs,
                    target.descripcion      = source.descripcion
            WHEN NOT MATCHED THEN
                INSERT (bodegaId, feeId, medidaId, orderDetailId, productId, taxId, taxPercentId, quantity, cost, taxValue, price, discount, total, obs, descripcion, createdAt, [enabled])
                VALUES (source.bodegaId, source.feeId, source.medidaId, source.orderDetailId, source.productId, source.taxId, source.taxPercentId, source.quantity, source.cost, source.taxValue, source.price, source.discount, source.total, source.obs, source.descripcion, @date, 1);

            ----- ========= Transformar el documento ========= --------
            IF (@codDoc IS NOT NULL OR @codDoc != '')
                BEGIN
                    EXEC TechnicalSupport.Order_Document_Insert @userRoleId, @orderId, @json, @payload OUTPUT
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