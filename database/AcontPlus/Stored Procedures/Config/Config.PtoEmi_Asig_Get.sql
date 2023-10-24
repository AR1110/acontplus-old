use Acontplus
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
IF OBJECT_ID(N'Config.PtoEmi_Asig_Get ', N'P') IS NOT NULL
DROP PROCEDURE Config.PtoEmi_Asig_Get 
GO
CREATE PROCEDURE Config.PtoEmi_Asig_Get @idRol INT, @json VARCHAR(MAX)
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
		a.idPtoEmi_Asig
	   ,a.codEstab_Asig
	   ,a.idPuntoEmision
	   ,ptoEmi = es.estab +'-'+  pe.ptoEmi 
	   ,a.predeterminado
	   ,a.estado
	FROM Config.PtoEmi_Asig a
	INNER JOIN Config.Estab_Asig    e ON e.codEstab_Asig   = a.codEstab_Asig
	INNER JOIN Sri.Establecimiento es ON es.codEstab       = e.codEstab
	INNER JOIN dbo.PuntoEmision    pe ON pe.idPuntoEmision = a.idPuntoEmision
	WHERE a.codEstab_Asig = @codEstab_Asig

	UNION ALL 

	SELECT 
		0
	   ,NULL
	   ,pe.idPuntoEmision
	   ,ptoEmi = e.estab+'-'+pe.ptoEmi
	   ,CAST(0 as bit)
	   ,CAST(0 as bit)
	FROM dbo.PuntoEmision pe 
	INNER JOIN Sri.Establecimiento e ON e.codEstab = pe.codEstab
	WHERE pe.codEstab = @codEstab AND pe.idPuntoEmision NOT IN (SELECT idPuntoEmision FROM Config.PtoEmi_Asig WHERE codEstab_Asig = @codEstab_Asig )

END 
GO
