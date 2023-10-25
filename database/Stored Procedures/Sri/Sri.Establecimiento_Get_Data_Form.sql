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
IF OBJECT_ID(N'Sri.Establecimiento_Get_Data_Form', N'P') IS NOT NULL
DROP PROCEDURE Sri.Establecimiento_Get_Data_Form 
GO
CREATE PROCEDURE Sri.Establecimiento_Get_Data_Form
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	

	SELECT codigo,descripcion FROM Catalogo.Canton WHERE estado = 1

	SELECT codigo,descripcion,grupo FROM Sri.ActividadEconomica WHERE estado = 1

	SELECT resolucion,descripcion FROM Sri.AgenteRetencion WHERE estado = 1

	SELECT codigo,descripcion,contribuyenteRimpe FROM Sri.Contribuyente WHERE estado = 1

	SELECT ambiente = codigo, descripcion FROM Sri.Ambiente WHERE estado = 1
END
GO
