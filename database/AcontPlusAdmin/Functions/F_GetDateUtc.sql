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
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION F_GetDateUtc
(
	
)
RETURNS DATETIME
AS
BEGIN
	DECLARE
	@FechaHoraEcuador DATETIME

	/* OBTIENE HORA MEDIANTE ZONA HORARIA EST */
	--SET @FechaHoraEcuador = GETDATE() AT TIME ZONE 'Eastern Standard Time' AT TIME ZONE 'UTC' AS OrderDate_TimeZoneUTC 

	/* OBTIENE HORA MEDIANTE ZONA HORARIA UTC (+00:00) Y AGREGANDO LA ZONA HORARIA DE ECUADOR */	
	--SET @FechaHoraEcuador = TODATETIMEOFFSET(GETUTCDATE(), '+05:00') AT TIME ZONE 'UTC' Hora_Ecuador

	/* OBTIENE HORA MEDIANTE RESTA DE 5 HORAS A LA HORA DE GRENWICH UTC */
	SET @FechaHoraEcuador = DATEADD(HOUR, -5, GETUTCDATE())
	
	RETURN @FechaHoraEcuador;

END
GO

