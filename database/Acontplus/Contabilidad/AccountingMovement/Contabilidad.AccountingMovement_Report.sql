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
    DECLARE @idEntidad INT ,@tipo INT 
	
    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT

    --> Variables
	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT )

    --> Get
	IF @tipo = 1
		BEGIN
            
            SET @tableNames = 'headerDs,detalleDs'

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

			SELECT CASE codDoc WHEN '01' THEN 'Factura'
		                       WHEN 'NE' THEN 'N.Entrega'
				               WHEN '04' THEN 'Devolución'
				               WHEN '07' THEN 'Comprobante de Renteción'
	               END as tipo            
                  ,CASE WHEN codDoc IN('01','NE') THEN SUM(importeTotal)
									              ELSE 0
	               END as ingreso 
	              ,CASE WHEN codDoc IN('04','07') THEN SUM(importeTotal)
									              ELSE 0
	               END as egreso
	  
            FROM v_CuentaPorCobrar
            WHERE idEntidad = 7 
              AND codDoc NOT IN ('A') 
              AND codEstado NOT IN ('A')
            GROUP BY codDoc

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
