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
CREATE OR ALTER PROCEDURE Contabilidad.AccountingMovement_Report
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
    DECLARE @idEntidad INT ,@tipo INT ,@idUsuario INT
	
    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT

    --> Filters
    DECLARE @fromDate DATETIME2 ,@toDate DATETIME2

    --> Variables
	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT )

    --> Get
	IF @tipo = 1
		BEGIN
            
            SET @tableNames = 'headerDs,saleDs,cobroDs,docRelacionadoDs,movimientoDs,controlCajaDs,compraDs,docRelCompraDs,subcategoriaDs'

            SELECT @fromDate = fromDate ,@toDate = toDate FROM OPENJSON(@json) WITH (fromDate DATETIME2 ,toDate DATETIME2)

            SELECT e.ruc
				  ,e.razonSocial 
				  ,e.nombreComercial	
				  ,ISNULL(e.telefono, '')                                                    as telefonoEntidad
				  ,ISNULL(e.direccion, '')                                                   as direccionEntidad			
				  ,'RESUMEN CONTABLE MENSUAL'                                                as tituloReporte
				  ,'alex'                                                                    as usuario
				  ,FORMAT(GETDATE(), 'dd/MM/yyyy') +' - ' +  FORMAT(GETDATE(), 'dd/MM/yyyy') as filtroFecha
			FROM Entidad e WITH (NOLOCK)
			WHERE e.idEntidad = @idEntidad

            --> Ventas
			SELECT CASE codDoc WHEN '01' THEN 'Factura'
		                       WHEN 'NE' THEN 'N.Entrega'
	               END               as tipo            
                  ,COUNT(*)                                 as cant
                  ,CAST(SUM(importeTotal) as numeric(18,2)) as total 
                  ,CAST(SUM(abono) as numeric(18,2))        as abono
                  ,CAST(SUM(saldo) as numeric(18,2))        as saldo
            FROM v_CuentaPorCobrar WITH (NOLOCK)
            WHERE idEntidad = @idEntidad
              AND codDoc IN ('01','NE') 
              AND codEstado NOT IN ('A')
              AND convertToDoc = 0
              AND CAST(fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
            GROUP BY codDoc

            SELECT ef.descripcion as tipo , CAST(SUM(co.abono)as numeric(18,2)) as valor
            FROM dbo.Cobro                    co WITH (NOLOCK)
            INNER JOIN dbo.ComprobanteIngreso ci WITH (NOLOCK) ON ci.idComprobanteIngreso = co.idComprobanteIngreso
            INNER JOIN dbo.EntidadFinanciera  ef WITH (NOLOCK) ON ef.idEntidadFinanciera  = co.idEntidadFinanciera
            INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.idEstablecimiento    = ci.idEstablecimiento
            WHERE ci.estado = 1
              AND es.idEntidad = @idEntidad
              AND co.cobro = 1
              AND CAST(ci.fechaRegistro as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
            GROUP BY ef.descripcion

            SELECT CASE codDoc WHEN 'A'  THEN 'Anticipo'
				               WHEN '04' THEN 'Devolución'
				               WHEN '07' THEN 'Comprobante de Renteción'
	               END                                      as tipo            
                  ,COUNT(*)                                 as cant
                  ,CAST(SUM(importeTotal) as numeric(18,2)) as valor 
            FROM v_CuentaPorCobrar WITH (NOLOCK)
            WHERE idEntidad = @idEntidad
              AND codDoc IN ('07','04','A') 
              AND codEstado NOT IN ('A')
              AND CAST(fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
            GROUP BY codDoc

            SELECT td.descripcion                                                    as tipo
                  ,CAST(SUM(mc.valor) as numeric(18,2)) * IIF(td.codigo = 'EC',-1,1) as valor
                  ,COUNT(*)                                                         as cant
            FROM MovimientoCaja               mc WITH (NOLOCK)
            INNER JOIN dbo.TipoDocumento      td WITH (NOLOCK) ON td.idTipoDocumento      = mc.idTipoDocumento
            INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.idEstablecimiento    = mc.idEstablecimiento
            WHERE es.idEntidad = @idEntidad
              AND CAST(mc.fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
            GROUP BY td.descripcion,td.codigo

            SELECT CAST(SUM(cc.entrada) as numeric(18,2))     as entrada
                  ,CAST(SUM(cc.totalArqueo) as numeric(18,2)) as totalArqueo
            FROM dbo.ControlCaja cc WITH (NOLOCK)
            INNER JOIN dbo.Caja  ca WITH (NOLOCK) ON ca.idCaja = cc.idCaja
            WHERE cc.estado = 0
              AND ca.idEntidad = @idEntidad
              AND CAST(cc.fechaApertura as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)

            --> Compra
            SELECT CASE codDoc WHEN '01' THEN 'Factura'
		                       WHEN '07' THEN 'Liquidacion'
		                       WHEN 'DH' THEN 'Compra Habitual'
		                       WHEN 'FC' THEN 'F.Fisica'
	               END               as tipo            
                  ,COUNT(*)                                 as cant
                  ,CAST(SUM(importeTotal) as numeric(18,2)) as total 
                  ,CAST(SUM(abono) as numeric(18,2))        as abono
                  ,CAST(SUM(saldo) as numeric(18,2))        as saldo
            FROM v_CuentaPorPagar cp WITH (NOLOCK)
            WHERE cp.idEntidad = @idEntidad
              AND cp.codDoc IN ('01','07','DH','FC')
              AND cp.codEstado NOT IN ('A')
              AND CAST(fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
            GROUP BY codDoc

            SELECT CASE codDoc WHEN '04' THEN 'Devolución'
				               WHEN '07' THEN 'Comprobante de Renteción'
	               END                                      as tipo  
                  ,COUNT(*)                                 as cant 
                  ,CAST(SUM(importeTotal) as numeric(18,2)) as valor 
            FROM v_CuentaPorPagar WITH (NOLOCK)
            WHERE idEntidad = @idEntidad
              AND codDoc IN ('07','04') 
              AND codEstado NOT IN ('A')
              AND CAST(fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
            GROUP BY codDoc

            SELECT ISNULL(cp.subcategoryName,'Compra')      as tipo            
                  ,COUNT(*)                                 as cant
                  ,CAST(SUM(importeTotal) as numeric(18,2)) as total 
                  ,CAST(SUM(abono) as numeric(18,2))        as abono
                  ,CAST(SUM(saldo) as numeric(18,2))        as saldo
            FROM v_CuentaPorPagar cp WITH (NOLOCK)
            WHERE cp.idEntidad = @idEntidad
              AND cp.codDoc IN ('01','07','DH','FC')
              AND cp.codEstado NOT IN ('A')
              AND CAST(fechaEmision as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date)
            GROUP BY subcategoryName

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
