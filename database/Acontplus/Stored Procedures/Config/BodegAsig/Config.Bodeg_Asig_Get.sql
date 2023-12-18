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
IF OBJECT_ID(N'Config.Bodeg_Asig_Get ', N'P') IS NOT NULL
DROP PROCEDURE Config.Bodeg_Asig_Get 
GO
CREATE PROCEDURE Config.Bodeg_Asig_Get @idRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @codEstab_Asig VARCHAR(150)
	DECLARE @codEstab VARCHAR(25)

	SELECT @codEstab_Asig = codEstab_Asig FROM OPENJSON(@json) WITH (codEstab_Asig VARCHAR(150) '$.codEstab_Asig')

	SELECT @codEstab = codEstab FROM Config.Estab_Asig WHERE codEstab_Asig = @codEstab_Asig

	SELECT 
		ab.idBodeg_Asig
	   ,ab.codEstab_Asig
	   ,ab.idBodega
	   ,bodega = b.descripcion
	   ,ab.predeterminado
	   ,ab.estado
	FROM Config.Bodeg_Asig ab
	INNER JOIN dbo.Bodega b ON b.idBodega = ab.idBodega
	WHERE ab.codEstab_Asig = @codEstab_Asig

	UNION ALL 

	SELECT 
		0
	   ,NULL
	   ,b.idBodega
	   ,b.descripcion
	   ,CAST(0 as bit)
	   ,CAST(0 as bit)
	FROM dbo.Bodega b 
	WHERE b.codEstab = @codEstab AND b.idBodega NOT IN (SELECT idBodega FROM Config.Bodeg_Asig WHERE codEstab_Asig = @codEstab_Asig )

END 
GO
