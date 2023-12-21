USE [Acontplus]
go 
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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Contabilidad.CuentaPorCobrar_Report @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN
    
    SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT ,@usuario VARCHAR(150) 

    --> Sql
    DECLARE @sql NVARCHAR(MAX) ,@params NVARCHAR(MAX)

    --> Filters
    DECLARE @idCliente INT ,@codEstab VARCHAR(25) ,@fechaInicio DATETIME ,@fechaFin DATETIME ,@ckFecha BIT ,@codEstado VARCHAR(15) ,@ckCxcVencida BIT
           ,@codDoc VARCHAR(10) ,@idPuntoEmision INT 
    
    --> Variables
    SELECT TOP 1 @idEntidad = idEntidad ,@usuario = nombreUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Cartera Cliente
    IF @tipo = 1
        BEGIN
            
            SELECT @idCliente    = idCliente  
                  ,@ckFecha      = ckFecha
                  ,@fechaInicio  = fechaInicio
                  ,@fechaFin     = fechaFin
                  ,@codEstab     = codEstab
                  ,@codEstado    = codEstado
                  ,@ckCxcVencida = ckCxcVencida
            FROM OPENJSON(@json) WITH 
            (
                idCliente         INT '$.idCliente'
               ,ckFecha           BIT '$.ckFecha'
               ,fechaInicio  DATETIME '$.fechaInicio'
               ,fechaFin     DATETIME '$.fechaFin'
               ,codEstab  VARCHAR(25) '$.codEstab'
               ,codEstado VARCHAR(15) '$.codEstado'
               ,ckCxcVencida      BIT '$.ckCxcVencida'
            )

            SET @sql = 'SELECT codDoc
                              ,razonSocialComprador
                              ,serieComprobante
                              ,fechaEmision
                              ,fechaVencimiento
                              ,CAST(importeTotal as numeric(18,2)) as importeTotal
                              ,CAST(abono as numeric(18,2))        as abono
                              ,CAST(saldo as numeric(18,2))        as saldo
                              ,estado 
                        FROM v_CuentaPorCobrar WITH (NOLOCK)
                        WHERE idCuentaPorCobrar > 0 '

            SET @params = '@idCliente         INT
                          ,@codEstab  VARCHAR(25)
                          ,@fechaInicio  DATETIME
                          ,@fechaFin     DATETIME
                          ,@codEstado VARCHAR(15)'


            IF @ckCxcVencida = 1
                BEGIN
                    SET @sql = 'SELECT cc.idCuentaPorCobrar
                                      ,cc.codDoc
                                      ,cc.razonSocialComprador
                                      ,cc.serieComprobante
                                      ,cc.fechaEmision
                                      ,cc.fechaVencimiento
                                      ,CAST(cc.importeTotal as numeric(18,2)) as importeTotal
                                      ,CAST(cc.abono as numeric(18,2))        as abono
                                      ,CAST(cc.saldo as numeric(18,2))        as saldo
                                      ,cc.estado 
                                      ,cp.idCuotaPorCobrar
		                              ,cp.nroCuota
		                              ,CAST(cp.cuota as numeric(8,2))         as cuota
		                              ,cp.fechaVencimiento                    as fechaEmisionCuota
		                              ,CAST(cp.abono as numeric(8,2))         as abonoCuota
		                              ,CAST(cp.saldo as numeric(8,2))         as saldoCuota
		                              ,ep.descripcion                         as estadoCuota
                                FROM v_CuentaPorCobrar                 cc WITH (NOLOCK) 
                                INNER JOIN Contabilidad.CuotaPorCobrar cp WITH (NOLOCK) ON cp.idCuentaPorCobrar = cc.idCuentaPorCobrar
                                INNER JOIN dbo.EstadoPago              ep WITH (NOLOCK) ON ep.idEstadoPago      = cp.idEstadoPago
                                WHERE cc.idCuentaPorCobrar > 0 '
                   
                    SET @sql = @sql + 'AND cc.mora > 0 '

                END 

            IF @codEstab IS NOT NULL 
                BEGIN
                    SET @sql = @sql + 'AND codEstab = @codEstab '
                END 

            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                END 

            IF @idCliente > 0 
                BEGIN
                    SET @sql = @sql + 'AND idCliente = @idCliente '
                END 

            IF @codEstado IS NOT NULL
                BEGIN
                    IF @codEstado = 'NCBR'
                        BEGIN 
                            SET @sql = @sql + 'AND codEstado IN (''PE'',''PP'') '
                        END 
                    ELSE
                        BEGIN
                            SET @sql = @sql + 'AND codEstado = @codEstado '
                        END 
                END 

            SELECT en.razonSocial
                  ,es.nombreComercial
                  ,es.ruc
                  ,es.telefono
                  ,es.dirEstablecimiento
                  ,@usuario             as usuario 
                  ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT( @fechaFin, 'dd/MM/yyyy') as filtroFechas
                  ,'Cartera de Cliente' as nombreReporte
            FROM Sri.Establecimiento es WITH (NOLOCK)
            INNER JOIN dbo.Entidad   en WITH (NOLOCK) ON en.ruc = es.ruc
            WHERE codEstab = @codEstab

            EXEC sp_executesql @sql
						      ,@params 
                              ,@codEstab    = @codEstab
                              ,@idCliente   = @idCliente
                              ,@fechaInicio = @fechaInicio
                              ,@fechaFin    = @fechaFin
                              ,@codEstado   = @codEstado

            RETURN 

        END 

    --> Reporte Ventas
    IF @tipo = 2
        BEGIN
            
            SELECT @codDoc         = codDoc 
                  ,@idCliente      = idCliente
                  ,@codEstab       = codEstab
                  ,@idPuntoEmision = idPuntoEmision
                  ,@codEstado      = codEstado
                  ,@ckFecha        = ckFecha
                  ,@fechaInicio    = fechaInicio
                  ,@fechaFin       = fechaFin
            FROM OPENJSON(@json) WITH 
            ( 
                codDoc     VARCHAR(10)
               ,idCliente          INT
               ,codEstab  VARCHAR(100)
               ,idPuntoEmision     INT
               ,codEstado   VARCHAR(10)
               ,ckFecha            BIT
               ,fechaInicio  DATETIME2
               ,fechaFin     DATETIME2
            )
            
            SET @params = '@idEntidad      INT
                          ,@codEstab       VARCHAR(100)
                          ,@idPuntoEmision INT
                          ,@idCliente      INT
                          ,@codEstado      VARCHAR(10)
                          ,@fechaInicio    DATETIME2
                          ,@fechaFin       DATETIME2
                          ,@codDoc         VARCHAR(10)'

            SET @sql = 'SELECT idEstablecimiento
                              ,nombreComercial
                              ,codDoc
                              ,razonSocialComprador
                              ,serieComprobante
                              ,Format(fechaEmision,''dd/MM/yyyy'')     as fechaEmision
                              ,Format(fechaVencimiento,''dd/MM/yyyy'') as fechaVencimiento
                              ,CAST(importeTotal as numeric(18,2))     as importeTotal
                              ,CAST(abono as numeric(18,2))            as abono
                              ,CAST(saldo as numeric(18,2))            as saldo
                              ,estado 
                              ,nombreUsuario                           as usuario
                        FROM v_CuentaPorCobrar WITH (NOLOCK)
                        WHERE idEntidad = @idEntidad '

            IF @codDoc IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND codDoc = @codDoc '
                END 

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND codEstab = @codEstab '
                END 

            IF @idPuntoEmision > 0
                BEGIN
                    SET @sql = @sql + 'AND idPuntoEmision = @idPuntoEmision '
                END 

            IF @idCliente >  0
                BEGIN
                    SET @sql = @sql + 'AND idCliente = @idCliente '
                END 

            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                END 

            IF @codEstado IS NOT NULL
                BEGIN
                    IF @codEstado = 'NCBR'
                        BEGIN 
                            SET @sql = @sql + 'AND codEstado IN (''PE'',''PP'') '
                        END 
                    ELSE
                        BEGIN
                            SET @sql = @sql + 'AND codEstado = @codEstado '
                        END 
                END 

            SET @sql = @sql + 'ORDER BY fechaEmision DESC '

            SELECT razonSocial
                  ,ruc
                  ,telefono
                  ,direccion 
                  ,@usuario  as usuario 
                  ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT( @fechaFin, 'dd/MM/yyyy') as filtroFechas
                  ,'Reporte de Ventas' as nombreReporte
            FROM dbo.Entidad WITH (NOLOCK)
            WHERE idEntidad = @idEntidad

            EXEC sp_executesql @sql,@params 
                                   ,@idEntidad      = @idEntidad
                                   ,@codDoc         = @codDoc
                                   ,@codEstab       = @codEstab
                                   ,@idPuntoEmision = @idPuntoEmision
                                   ,@idCliente      = @idCliente
                                   ,@fechaInicio    = @fechaInicio
                                   ,@fechaFin       = @fechaFin
                                   ,@codEstado      = @codEstado

            RETURN 
        END 

END
GO
