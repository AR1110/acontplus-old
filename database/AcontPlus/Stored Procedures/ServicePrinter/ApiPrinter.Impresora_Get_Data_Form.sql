-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
USE [AcontPlus]
GO
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
IF OBJECT_ID(N'ApiPrinter.Impresora_Get_Data_Form', N'P') IS NOT NULL
DROP PROCEDURE ApiPrinter.Impresora_Get_Data_Form
GO
CREATE PROCEDURE ApiPrinter.Impresora_Get_Data_Form @idRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	SELECT 
		ar.codEstab
	   ,e.nombreComercial
	   ,ar.predeterminado
	FROM Config.Estab_Asig ar WITH (NOLOCK)
	INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON e.codEstab = ar.codEstab
	WHERE ar.idUsuarioRol = @idRol
	ORDER BY ar.predeterminado DESC

	SELECT idTipoImpresora,codigo,descripcion FROM ApiPrinter.TipoImpresora WITH (NOLOCK) WHERE estado = 1

	--SELECT 'FV'codDoc,'FACTURA' descripcion,CAST(1 AS BIT)estado, CAST(0 AS BIT) copyPrint
	--UNION ALL
	--SELECT 'NE'codDoc,'NOTA DE ENTREGA' descripcion,CAST(1 AS BIT)estado, CAST(0 AS BIT) copyPrint
	--UNION ALL
	--SELECT 'NE'codDoc, 'PROFORMA'
	SELECT 
		codDoc = codigo,
		descripcion = UPPER(descripcion),
		estado = CAST(1 AS BIT),
		copyPrint = CAST(0 AS BIT)
	FROM TipoDocumento WHERE codigo IN ('FV', 'NE', 'PR')
END
GO
