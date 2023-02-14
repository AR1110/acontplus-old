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
-- Author:		ALEXIS RAMIREZ
-- Create date: 2/13/2023
-- Description:	SP PARA TRAER LA DATA DE LA CONFIGURACION DE IMPRESORAS
-- =============================================
IF OBJECT_ID(N'ApiPrinter.Impresora_Get_Id', N'P') IS NOT NULL
DROP PROCEDURE ApiPrinter.Impresora_Get_Id
GO
CREATE PROCEDURE ApiPrinter.Impresora_Get_Id @id INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT 
		i.idImpresora
	   ,i.nombreImpresora
	   ,i.nombreEquipo
	   ,i.nroIdentificacion
	   ,i.predeterminada
	   ,asignar = IIF(i.nombreEquipo IS NULL,CAST(0 AS BIT),CAST(1 AS BIT))
	   ,ti.codigo
	   ,ti.idTipoImpresora
	   ,ti.descripcion
	   ,s.codEstab
	   ,s.estab
	   ,s.nombreComercial
	FROM ApiPrinter.Impresora i WITH (NOLOCK) 
	LEFT JOIN Sri.Establecimiento s WITH (NOLOCK) ON s.codEstab = i.codEstab
	LEFT JOIN ApiPrinter.TipoImpresora ti WITH (NOLOCK) ON ti.idTipoImpresora = i.idTipoImpresora
	WHERE i.idImpresora = @id

	SELECT 
		idConfig_Document 
	   ,descripcion = IIF(codDoc = 'F','FACTURA','NOTA DE ENTREGA')
	   ,codDoc
	   ,estado
	   ,copyPrint = IIF(copyPrint = 1,CAST(0 AS BIT),CAST(1 AS BIT))
	FROM ApiPrinter.Config_Document WITH (NOLOCK)
	WHERE idImpresora = @id


END
GO
