USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ignacio Manchu
-- Create date: 2023-08-30
-- Description:	sp for update order restaurant
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.Order_Update 
@userRoleId INT
,@id		INT
,@json		NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @uuid UNIQUEIDENTIFIER    
    ,@paymentsJson NVARCHAR(MAX)
    ,@establecimientoId INT
    ,@puntoEmisionId INT
    ,@bodegaId INT
    ,@tableId INT
    ,@sequence INT    
    ,@fechaEmision DATETIME2
    ,@customerCompanyId INT
    ,@subtotalSinImpuestos NUMERIC(18,5)
    ,@tax NUMERIC(18,5)
    ,@taxPercent NUMERIC(4,2)
    ,@discount NUMERIC(18,5)
    ,@tip NUMERIC(18,5)
    ,@total NUMERIC(18,5)
    ,@obs VARCHAR(500)
    ,@codDoc VARCHAR(2)
    ,@quickSale BIT
    ,@userId INT
    ,@estadoPagoId INT
    ,@ambiente INT
    ,@autoSriAuth BIT
    ,@saveDoc BIT
    ,@updateOrder BIT
    ,@response NVARCHAR(MAX)
    ,@payload NVARCHAR(MAX)

     SELECT @uuid               = uuid
        ,@paymentsJson          = payments
        ,@establecimientoId     = establecimientoId
        ,@puntoEmisionId        = puntoEmisionId
        ,@bodegaId              = bodegaId
        ,@tableId               = tableId
        ,@fechaEmision          = fechaEmision
        ,@customerCompanyId     = customerCompanyId
        ,@subtotalSinImpuestos  = subtotalSinImpuestos
        ,@taxPercent            = taxPercent
        ,@tax                   = tax
        ,@discount              = discount
        ,@tip                   = tip
        ,@total                 = total
        ,@obs                   = obs
        ,@codDoc                = codDoc
        ,@quickSale             = quickSale
        ,@saveDoc               = saveDoc
        ,@updateOrder           = updateOrder
    FROM OPENJSON(@json)
    WITH(
        uuid UNIQUEIDENTIFIER '$.uuid',            
        payments NVARCHAR(MAX) '$.payments' AS JSON,
        establecimientoId INT '$.establecimientoId',
        puntoEmisionId INT '$.puntoEmisionId',
        bodegaId INT '$.bodegaId',
        tableId INT '$.tableId',
        fechaEmision DATETIME2 '$.fechaEmision',
        customerCompanyId INT '$.customerCompanyId',
        subtotalSinImpuestos NUMERIC(18,5) '$.subtotalSinImpuestos',
        tax NUMERIC(18,5) '$.tax',
        taxPercent NUMERIC(4,2) '$.taxPercent',
        discount NUMERIC(18,5) '$.discount',
        tip NUMERIC(18,5) '$.tip',
        total NUMERIC(18,5) '$.total',
        obs VARCHAR(500) '$.obs',
        codDoc VARCHAR(2) '$.codDoc',
        quickSale BIT '$.quickSale',
        saveDoc BIT '$.saveDoc',
        updateOrder BIT '$.updateOrder'
    )

    IF NOT EXISTS (SELECT 1 FROM Config.v_ConfigDocumento cd 
                   INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab AND cd.idPuntoEmision = @puntoEmisionId
			       WHERE pa.idUsuarioRol = @userRoleId
			       AND cd.codDoc = 'OR')
        BEGIN
            SELECT Common.ufnSpResponse('0', 'Aun no se ha configurado el secuencial, para ordenes de restaurante',  DEFAULT)
            RETURN
        END

    BEGIN TRY
        BEGIN TRAN
            IF @updateOrder = 1
                BEGIN 
                    UPDATE Restaurant.[Order]
                    SET EstablecimientoId   = @establecimientoId
                        ,PuntoEmisionId     = @puntoEmisionId
                        ,TableId            = @tableId
                        ,[Sequence]         = @sequence                      
                        ,CustomerCompanyId  = @customerCompanyId
                        ,Tax                = @Tax
                        ,Discount           = @Discount
                        ,Total              = @Total
                        ,[Enabled]          = 1
                    WHERE Id = @id
                END

            IF @saveDoc = 1
                EXEC Restaurant.Order_Document_Insert @userRoleId, @id, @json, @response
                SET @payload = @response 
                
        COMMIT TRAN
        SELECT Common.ufnSpResponse('1', 'Exitos al actualizar', @payload)
    END TRY
    BEGIN CATCH
        SELECT Common.ufnSpResponse('0', 'Error al guardar el orden', NULL)
        
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'Order/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
    END CATCH
END