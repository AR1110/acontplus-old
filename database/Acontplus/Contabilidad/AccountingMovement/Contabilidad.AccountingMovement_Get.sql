USE [Acontplus]
GO
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 03/14/2023
-- Description:	SP para lisatar las cuentas por pagar.
-- =============================================

--  Contabilidad.CuentaPorPagar_Get 44, '{"tipo":1}'
CREATE OR ALTER PROCEDURE Contabilidad.AccountingMovement_Get
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH 

	 --> Global
    DECLARE @idEntidad INT ,@tipo INT 
	
    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT

    --> Variables
	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT )

    --> Get
	IF @tipo = 1
		BEGIN
			SET @sql  = 'SELECT * FROM 
                        (
                            SELECT IIF(codDoc = ''01'',''Factura'',''Nota Entrega'') as descripcion
                                  ,SUM(cc.importeTotal)						         as ingreso
                                  ,0										         as egreso
                                  ,SUM(cc.abono)						             as abono
                                  ,SUM(cc.saldo)						             as saldo
                            FROM v_CuentaPorCobrar cc WITH (NOLOCK)
                            WHERE cc.idEntidad = 7
                              AND cc.codEstado NOT IN (''A'')
                              AND cc.convertToDoc = 0
                              and MONTH(cc.fechaEmision) = 3
                            GROUP BY codDoc

                            UNION ALL 

                                                SELECT ''Ingresos''   as descripcion
                                                      ,SUM(ci.abono)  as ingreso
                                                      ,0              as egreso
                                                      ,0              as abono
                                                      ,0              as saldo
                                                FROM ComprobanteIngreso ci WITH (NOLOCK) 
                                                WHERE ci.idComprobanteIngreso IN (
                                                                                      SELECT hc.idComprobanteIngreso
                                                                                      FROM Contabilidad.Historial_Cobro hc WITH (NOLOCK)
                                                                                      INNER JOIN dbo.Cobro              co WITH (NOLOCK) ON co.idCobro              = hc.idCobro
                                                                                      INNER JOIN v_CuentaPorCobrar      cc WITH (NOLOCK) ON cc.idCuentaPorCobrar    = hc.idCuentaPorCobrar
                                                                                      INNER JOIN dbo.ComprobanteIngreso ci WITH (NOLOCK) ON ci.idComprobanteIngreso = hc.idComprobanteIngreso
                                                                                      WHERE cc.idEntidad = 7
                                                                                        AND cc.codEstado NOT IN (''A'')
                                                                                        AND cc.convertToDoc = 0
                                                                                        AND MONTH(cc.fechaEmision) = 3
                                                                                        AND co.cobro = 1
                                                                                     )

                                                UNION ALL

                                                SELECT ISNULL(subcategoryName,''COMPRA'') as descripcion
                                                      ,0								  as ingreso
	                                                  ,SUM(cp.importeTotal)	              as egreso
                                                      ,SUM(cp.abono)						       as abono
                                                      ,SUM(cp.saldo)                        as saldo
                                                FROM v_CuentaPorPagar cp WITH (NOLOCK)
                                                WHERE cp.idEntidad = 7
                                                  AND cp.codEstado NOT IN (''A'')
                                                  and MONTH(cp.fechaEmision) = 3
                                                GROUP BY subcategoryName

                        UNION ALL

                         SELECT ''Egresos''     as descripcion
                              ,0              as ingreso
                              ,SUM(ce.total)  as egreso
                              ,0              as abono
                              ,0              as saldo
                        FROM ComprobanteEgreso ce WITH (NOLOCK) 
                        WHERE ce.idComprobanteEgreso IN (
                                                            SELECT hp.idComprobanteEgreso
                                                            FROM Contabilidad.Historial_Pago  hp WITH (NOLOCK)
                                                            INNER JOIN dbo.Pago               pa WITH (NOLOCK) ON pa.idPago               = hc.idCobro
                                                            INNER JOIN v_CuentaPorCobrar      cc WITH (NOLOCK) ON cc.idCuentaPorCobrar    = hc.idCuentaPorCobrar
                                                            INNER JOIN dbo.ComprobanteIngreso ci WITH (NOLOCK) ON ci.idComprobanteIngreso = hc.idComprobanteIngreso
                                                            WHERE cc.idEntidad = 7
                                                              AND cc.codEstado NOT IN (''A'')
                                                              AND cc.convertToDoc = 0
                                                              AND MONTH(cc.fechaEmision) = 3
                                                              AND co.cobro = 1
                                                        )

    
                    ) as dt '

			                    SET @params  = '@idEntidad   INT
						                       ,@codEstab    VARCHAR(100)
						                       ,@codDoc      VARCHAR(5)
						                       ,@codEstado   VARCHAR(10)
						                       ,@idProveedor INT
						                       ,@dateStart   DATETIME2
						                       ,@dateEnd     DATETIME2
                                               ,@pageIndex   INT
                                               ,@pageSize    INT
                                               ,@secuencial  INT'

			
			
			EXEC sp_executesql @sql
			                  ,@params 
			                  ,@idEntidad    = @idEntidad
            RETURN 
		END 
    
    --> Filters
    IF @tipo = 2
        BEGIN
            
            SET @tableNames = 'transactionType,subcategory'

            SELECT idTipoTransaccion,codigo,descripcion FROM dbo.TipoTransaccion WITH (NOLOCK) WHERE codigo IN ('C','V') AND estado = 1

            SELECT Id,Code,[Name] FROM Contabilidad.Subcategory WITH (NOLOCK) WHERE CompanyId = @idEntidad AND [Enabled] = 1

            RETURN 
        END
END
GO
