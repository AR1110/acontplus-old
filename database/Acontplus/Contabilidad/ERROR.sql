
USE [AcontPlus]
GO 
-- ================================================
-- Template generated from Template Explorer using:
-- Create Multi-Statement Function (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the function.
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
CREATE OR ALTER FUNCTION dbo.cobros_error
(
	@id INT 
)
RETURNS 
@table  TABLE
(
	idComprobanteIngreso INT NOT NULL
   ,idCobro INT NOT NULL
   ,idCuentaPorCobrar INT NOT NULL
   ,saldo NUMERIC(18,5) NOT NULL 
   ,abono NUMERIC(18,5) NOT NULL 
   ,diasMora NUMERIC(18,5) NOT NULL DEFAULT 0
   ,mora  NUMERIC(18,5) NOT NULL DEFAULT 0
)
AS
BEGIN
	
    DECLARE @idEntidad INT
           ,@fechaEmision DATETIME2
           ,@saldo NUMERIC(18,5)
           ,@abono NUMERIC(18,5)

    SELECT top 1 @idEntidad = idEntidad, @fechaEmision = fechaEmision,@saldo = importeTotal,@abono = abono FROM Contabilidad.CuentaPorCobrar where idCuentaPorCobrar = @id
        
    INSERT into @table 
          (idComprobanteIngreso,idCobro,saldo,abono,idCuentaPorCobrar)
    SELECT co.idComprobanteIngreso
          ,co.idCobro
          ,@saldo - SUM(co.abono) OVER (ORDER BY ci.fechaRegistro ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS saldoAcumulado
          ,co.abono
          ,@id
    FROM Cobro co WITH (NOLOCK)
    INNER JOIN ComprobanteIngreso ci with (nolock) on ci.idComprobanteIngreso = co.idComprobanteIngreso
    WHERE CAST(co.fechaEmision AS date) BETWEEN CAST(@fechaEmision AS date) AND CAST(@fechaEmision AS date)
      AND CAST(co.fechaEmision AS time) BETWEEN CAST(@fechaEmision AS time) AND CAST(DATEADD(MINUTE, 1, @fechaEmision) AS time)
      and co.abono = @abono
      AND ci.idEntidad = @idEntidad


	RETURN 
END
GO