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
    --> Global
    DECLARE @tipo INT 

    --> Sql
    DECLARE @sql NVARCHAR(MAX) ,@params NVARCHAR(MAX)

    --> Filters
    DECLARE @idCliente INT ,@codEstab VARCHAR(25) ,@fechaInicio DATETIME ,@fechaFin DATETIME
           ,@ckFecha BIT 
    
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')

    --> Cartera Cliente
    IF @tipo = 1
        BEGIN
            
            SET @sql = 'SELECT codDoc
                              ,serieComprobante
                              ,fechaEmision
                              ,fechaVencimiento
                              ,importeTotal
                              ,abono
                              ,saldo
                              ,estado 
                        FROM v_CuentaPorCobrar WITH (NOLOCK)
                        WHERE codEstado IN (''PP'',''PE'') '

            SET @params = '@idCliente         INT
                          ,@codEstab  VARCHAR(25)
                          ,@fechaInicio  DATETIME
                          ,@fechaFin     DATETIME'

            SELECT @idCliente   = idCliente  
                  ,@ckFecha     = ckFecha
                  ,@fechaInicio = fechaInicio
                  ,@fechaFin    = fechaFin
            FROM OPENJSON(@json) WITH 
            (
                idCliente        INT '$.idCliente'
               ,ckFecha          BIT '$.ckFecha'
               ,fechaInicio DATETIME '$.fechaInicio'
               ,fechaFin    DATETIME '$.fechaFin'
            )

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

            EXEC sp_executesql  @sql
						       ,@params 
                               ,@codEstab    = @codEstab
                               ,@idCliente   = @idCliente
                               ,@fechaInicio = @fechaInicio
                               ,@fechaFin    = @fechaFin

        END 
END
GO
