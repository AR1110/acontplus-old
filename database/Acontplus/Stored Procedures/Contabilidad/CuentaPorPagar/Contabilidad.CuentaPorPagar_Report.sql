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
CREATE OR ALTER PROCEDURE Contabilidad.CuentaPorPagar_Report @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    --> Globales
	DECLARE @idEntidad INT ,@tipo INT

    --> Sql 
    DECLARE @sql NVARCHAR(MAX) ,@params NVARCHAR(MAX)

     --> Filters
    DECLARE @idProveedor INT ,@codEstab VARCHAR(25) ,@fechaInicio DATETIME2 ,@fechaFin DATETIME2 ,@ckFecha BIT ,@codEstado VARCHAR(15) ,@codDoc VARCHAR(10) 
           ,@idPuntoEmision INT 

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol
    
    --> Reporte De compras
    IF @tipo = 1
        BEGIN
            
            SELECT @idProveedor  = idProveedor  
                  ,@ckFecha      = ckFecha
                  ,@fechaInicio  = fechaInicio
                  ,@fechaFin     = fechaFin
                  ,@codEstab     = codEstab
                  ,@codEstado    = codEstado
                  ,@codDoc       = codDoc
            FROM OPENJSON(@json) WITH 
            (
                idProveedor  INT         
               ,ckFecha      BIT         
               ,fechaInicio  DATETIME2   
               ,fechaFin     DATETIME2   
               ,codEstab     VARCHAR(25) 
               ,codEstado    VARCHAR(15) 
               ,codDoc       VARCHAR(10) 
            )

            SET @params = '@idProveedor INT
                          ,@idEntidad   INT
                          ,@codEstab    VARCHAR(50)
                          ,@fechaInicio DATETIME2
                          ,@fechaFin    DATETIME2
                          ,@codEstado   VARCHAR(15)
                          ,@codDoc      VARCHAR(10)'

            SET @sql = 'SELECT idEstablecimiento
                              ,nombreComercial 
                              ,CASE codDoc WHEN ''01'' THEN ''Factura''  
										   WHEN ''FC'' THEN ''F.Fisica''
										   WHEN ''DH'' THEN ''Documento Imgreso''
										   WHEN ''03'' THEN ''Liquidación''
							   END as tipoDoc
                              ,razonSocialProveedor
                              ,serieComprobante
                              ,FORMAT(fechaEmision,''dd/MM/yyyy'')     as fechaEmision
                              ,FORMAT(fechaVencimiento,''dd/MM/yyyy'') as fechaVencimiento
                              ,CAST(importeTotal as numeric(18,2))     as importeTotal
                              ,CAST(abono as numeric(18,2))            as abono
                              ,CAST(saldo as numeric(18,2))            as saldo
                              ,estado 
                        FROM v_CuentaPorPagar cp WITH (NOLOCK)
                        WHERE idEntidad = @idEntidad '

            IF @codDoc IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND cp.codDoc = @codDoc '
                END

            IF @idPuntoEmision > 0
                BEGIN
                    SET @sql = @sql + 'AND cp.idPuntoEmision = @idPuntoEmision '
                END

            IF @codEstab IS NOT NULL 
                BEGIN
                    SET @sql = @sql + 'AND cp.codEstab = @codEstab '
                END 

            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(cp.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                END 

            IF @idProveedor > 0 
                BEGIN
                    SET @sql = @sql + 'AND cp.idProveedor = @idProveedor '
                END 

            IF @codEstado IS NOT NULL
                BEGIN
                    IF @codEstado = 'NPA'
                        BEGIN 
                            SET @sql = @sql + 'AND cp.codEstado IN (''PE'',''PP'') '
                        END 
                    ELSE
                        BEGIN
                            SET @sql = @sql + 'AND cp.codEstado = @codEstado '
                        END 
                END 


            SET @sql = @sql + 'ORDER BY cp.idProveedor,cp.codDoc,cp.fechaEmision,cp.secuencial ASC '

            SELECT entidad                                                                       as razonSocial
                  ,nombreComercial
                  ,rucEmpresa                                                                    as ruc
                  ,telefono
                  ,nombreUsuario                                                                 as usuario 
                  ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT( @fechaFin, 'dd/MM/yyyy') as filtroFechas
                  ,'Reporte de Compras'                                                          as nombreReporte
            FROM v_usuario WITH (NOLOCK)
            WHERE idUsuarioRol = @idUsuarioRol

            EXEC sp_executesql @sql
						      ,@params 
                              ,@codEstab    = @codEstab
                              ,@idProveedor = @idProveedor
                              ,@idEntidad   = @idEntidad
                              ,@fechaInicio = @fechaInicio
                              ,@fechaFin    = @fechaFin
                              ,@codEstado   = @codEstado
                              ,@codDoc      = @codDoc

            RETURN 
        END 
END
GO
