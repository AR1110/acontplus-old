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
-- Create date: 2022-11-17
-- Description:	TABLA TEMPORAL PARA LISTAR LOS TIPOS DE IMPORTACION.
-- =============================================
IF OBJECT_ID(N'Importaciones.TipoImportacion_Get', N'P') IS NOT NULL
DROP PROCEDURE Importaciones.TipoImportacion_Get 
GO
CREATE PROCEDURE Importaciones.TipoImportacion_Get @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @table TABLE
	(
		id INT IDENTITY(1,1) NOT NULL
	   ,codigo VARCHAR(10) UNIQUE NOT NULL
	   ,descripcion VARCHAR(100) NOT NULL
	   ,urlDocument VARCHAR(MAX) NULL
	)

	INSERT INTO @table (codigo,descripcion,urlDocument)
	SELECT 'AR','ARTICULOS',urlDocument = 'https://acortar.link/2bUbXy'
	UNION ALL
	SELECT 'SF','SUBFAMILIAS',urlDocument = 'https://acortar.link/KbrlAl'
	UNION ALL
	SELECT 'ME','MEDIDAS',urlDocument = 'https://acortar.link/7U4Nr3'
	UNION ALL
	SELECT 'MA','MARCAS',urlDocument = 'https://acortar.link/7U4Nr3'
	UNION ALL
	SELECT 'MO','MODELOS',urlDocument = 'https://acortar.link/7U4Nr3'
	UNION ALL
	SELECT 'CL','CLIENTES',urlDocument = 'https://acortar.link/9FHSgB'
	UNION ALL
	SELECT 'PR','PROVEEDORES',urlDocument = 'https://acortar.link/9FHSgB'
	UNION ALL
	SELECT 'AF','ARTICULOS FRACCIONADOS',urlDocument = 'https://n9.cl/articulofraccionado'


	SELECT * FROM @table

END
GO
