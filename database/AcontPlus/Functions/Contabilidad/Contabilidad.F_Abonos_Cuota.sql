-- ================================================
-- Template generated from Template Explorer using:
-- Create Scalar Function (New Menu).SQL
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
-- Author:		Alexis Ramirez
-- Create date: 3/18/2023
-- Description:	SP para obtener los abonos y estados de las cuotas por pagar
-- =============================================
ALTER FUNCTION Contabilidad.F_Abonos_Cuota
(
	-- Add the parameters for the function here
	@idCuotaPorPagar AS INT
)
RETURNS NUMERIC(18,5)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @abono decimal(15,5) = (SELECT SUM(pd.abono) 
									FROM PagoDetalle pd
									INNER JOIN  Pago P on P.idPago = pd.idPago  
									INNER JOIN ComprobanteEgreso ce ON ce.idComprobanteEgreso = P.idComprobanteEgreso
									WHERE pd.idCuotaPorPagar = @idCuotaPorPagar AND p.cobro = 1 AND ce.estado = 1)
			
	-- Add the T-SQL statements to compute the return value here

	RETURN ISNULL(@abono,0)

END
GO

