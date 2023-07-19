USE [Acontplus]
go
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
-- Create date: 03/18/2023
-- Description: FT para encontrar el estado de la cuota.
-- =============================================
ALTER FUNCTION Helper.F_Status_Document
(
	-- Add the parameters for the function here
	 @importeTotal AS NUMERIC(18,5)
	,@abono AS NUMERIC(18,5)
)
RETURNS INT
AS
BEGIN
	-- Declare the return variable here
	DECLARE @idEstadoPago AS INT 
	DECLARE @residuo AS NUMERIC(18,5)

	SELECT @residuo = @importeTotal - @abono

	IF @residuo = 0  
		BEGIN
			SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PA'
		END 

	IF @residuo > 0 
		BEGIN
			SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PP'
		END

	IF @abono = 0 
		BEGIN
			SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'
		END 

	
		



	RETURN @idEstadoPago

END
GO

