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
-- TechnicalSupport.OrderMantenaince_Insert 401, '{"order":{"id":7,"bodegaId":288,"fechaEmision":"2024-04-19 00:00:00 AM","establecimientoId":608,"customerCompanyId":149070,"percentageDiscount":0,"subTotalSinImpuesto":606,"codDoc":"FV","tax":0,"tip":0,"total":690.72,"puntoEmisionId":280,"discount":0},"detalles":[{"rowguid":"9627a5f2-fa66-4dfa-bd50-ee724538356d","id":0,"descripcion":"SERVICIOS INFORMÁTIVOS Y SOPORTE TÉCNICO","orderIndex":1,"bodegaId":288,"orderDetailId":10,"codigo":"SER1","costoFraccionado":600,"precioConIva":684,"precioTotalSinImpuesto":600,"feeId":1158,"medidaId":848,"productId":251478,"taxId":1,"taxPercentId":3,"quantity":1,"cost":600,"taxValue":84,"price":600,"discount":0,"percentageDiscount":0,"total":684,"obs":null,"conversion":1,"cantidadTransaccion":1,"envioSri":true},{"rowguid":"863cb2e8-a950-491a-87fa-04626ccfa500","id":0,"descripcion":"INVENTARIO PRUEBA","orderIndex":2,"bodegaId":288,"orderDetailId":10,"codigo":"*SER2","costoFraccionado":2,"precioConIva":6.72,"precioTotalSinImpuesto":6,"feeId":1158,"medidaId":848,"productId":259089,"taxId":1,"taxPercentId":2,"quantity":1,"cost":2,"taxValue":0.72,"price":6,"discount":0,"percentageDiscount":0,"total":6.72,"obs":null,"conversion":1,"cantidadTransaccion":1,"envioSri":true}]}'
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
        , @customerCompanyId    INT
        , @establecimientoId    INT
        , @puntoEmisionId       INT
        , @percentageDiscount   NUMERIC(18,6)
        , @subTotalSinImpuesto  NUMERIC(18,6)
        , @discount             NUMERIC(18,6)
        , @tax                  NUMERIC(18,6)
        , @tip                  NUMERIC(18,6)
        , @total                NUMERIC(18,6)
        , @codDoc               VARCHAR(5)
        , @payload              NVARCHAR(MAX)
        
    BEGIN TRY
        DECLARE @orderMantenaince AS TABLE (
            id                          INT             NULL
            , bodegaId                  INT             NOT NULL
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
            , isGroup                   BIT             NULL
        )

        SELECT @order = orden, @detalles = detalles 
        FROM OPENJSON(@json) 
        WITH( orden NVARCHAR(MAX) '$.order' AS JSON, detalles NVARCHAR(MAX) '$.detalles' AS JSON)
        
        SELECT @orderId                 = orderId
                , @customerCompanyId    = customerCompanyId    
                , @percentageDiscount   = percentageDiscount
                , @subTotalSinImpuesto  = subTotalSinImpuesto
                , @codDoc               = codDoc
                , @tax                  = tax
                , @tip                  = tip
                , @total                = total
                , @puntoEmisionId       = puntoEmisionId
                , @establecimientoId    = establecimientoId
                , @discount             = discount
        FROM OPENJSON(@order) WITH (
            orderId                 INT             '$.id'
            , customerCompanyId     INT             '$.customerCompanyId'
            , percentageDiscount    NUMERIC(18,6)   '$.percentageDiscount'
            , subTotalSinImpuesto   NUMERIC(18,6)   '$.subTotalSinImpuesto'
            , codDoc                VARCHAR(5)      '$.codDoc'
            , discount              NUMERIC(18,6)   '$.discount'
            , tax                   NUMERIC(18,6)   '$.tax'
            , tip                   NUMERIC(18,6)   '$.tip'
            , total                 NUMERIC(18,6)   '$.total'
            , puntoEmisionId        INT             '$.puntoEmisionId'
            , establecimientoId     INT             '$.establecimientoId'
        )
        
        INSERT INTO @orderMantenaince (id,bodegaId, codigo, descripcion, costoFraccionado, precioConIva, precioTotalSinImpuesto, feeId, medidaId, productId, taxId, taxPercentId, quantity, cost, taxValue, price, discount, total, obs, orderDetailId, isGroup)
        SELECT ISNULL(id, 0),bodegaId, codigo, descripcion, costoFraccionado, precioConIva, precioTotalSinImpuesto, feeId, medidaId, productId, taxId, taxPercentId, quantity, cost, taxValue, price, discount, total, obs, orderDetailId, isGroup
        FROM OPENJSON(@detalles)
        WITH (
            id                              INT             '$.id',
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
            orderDetailId                   INT             '$.orderDetailId',
            isGroup                         BIT             '$.isGroup'
        );

        IF NOT EXISTS(SELECT TOP 1 1 FROM @orderMantenaince)
        BEGIN
            SELECT '0' AS code, 'No se pudo recuperar el detalle del orden mantenimiento' + @json AS 'message'
            RETURN
        END

        IF @establecimientoId IS NULL OR @establecimientoId = 0
        BEGIN
            SELECT '0' AS code, 'El establecimiento es nulo' AS 'message'
            RETURN
        END

        IF @customerCompanyId IS NULL OR @customerCompanyId = 0
        BEGIN
            SELECT '0' AS code, 'El customerCompanyId es nulo' AS 'message'
            RETURN
        END

        IF @puntoEmisionId IS NULL OR @puntoEmisionId = 0
        BEGIN
            SELECT '0' AS code, 'El puntoEmisionId es nulo' AS 'message'
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
            UPDATE TechnicalSupport.[Order]
            SET EstablecimientoId   = @establecimientoId
                , PuntoEmisionId    = @puntoEmisionId
                , CustomerCompanyId = @customerCompanyId
                , Tax               = @tax
                , Discount          = @discount
                , Total             = @total
            WHERE Id = @orderId
                       
            ----- Primero eliminamos los registros de la tabla fisico cuando no exista en la tabla temporal ----
            DELETE FROM TechnicalSupport.OrderMaintenance 
            WHERE id NOT IN (SELECT id FROM @orderMantenaince) 
            AND OrderDetailId = (SELECT TOP 1 OrderDetailId FROM @orderMantenaince )
            
            ----- Realizar la actualización
            UPDATE principal
            SET
                principal.bodegaId          = source.bodegaId,
                principal.feeId             = source.feeId,
                principal.medidaId          = source.medidaId,
                principal.orderDetailId     = source.orderDetailId,
                principal.productId         = source.productId,
                principal.taxId             = source.taxId,
                principal.taxPercentId      = source.taxPercentId,
                principal.quantity          = source.quantity,
                principal.cost              = source.cost,
                principal.taxValue          = source.taxValue,
                principal.price             = source.price,
                principal.discount          = source.discount,
                principal.total             = source.total,
                principal.obs               = source.obs,
                principal.descripcion       = source.descripcion
            FROM TechnicalSupport.OrderMaintenance AS principal
            JOIN @orderMantenaince AS source ON principal.id = source.id
            WHERE ISNULL(source.isGroup, 0) = 0
            
            -- Procedemos a la inserción solamente cuando no existan en la tabla física.
            INSERT INTO TechnicalSupport.OrderMaintenance (bodegaId, feeId, medidaId, orderDetailId, productId, taxId, taxPercentId, quantity, cost, taxValue, price, discount, total, obs, descripcion, createdAt, [enabled])
        
            SELECT source.bodegaId, source.feeId, source.medidaId, source.orderDetailId, source.productId, source.taxId, source.taxPercentId, source.quantity, source.cost, source.taxValue, source.price, source.discount, source.total, source.obs, source.descripcion, @date, 1 as bit
            FROM @orderMantenaince AS source
            WHERE NOT EXISTS (SELECT 1 FROM TechnicalSupport.OrderMaintenance AS target WHERE target.id = source.id)
            AND ISNULL(source.isGroup, 0) = 0
        
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