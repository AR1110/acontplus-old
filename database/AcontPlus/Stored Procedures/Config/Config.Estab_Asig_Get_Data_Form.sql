use [AcontPlus]
GO
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
IF OBJECT_ID(N'Config.Estab_Asig_Get_Data_Form', N'P') IS NOT NULL
DROP PROCEDURE Config.Estab_Asig_Get_Data_Form 
GO
CREATE PROCEDURE Config.Estab_Asig_Get_Data_Form @idRol INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @codEstab_Asig VARCHAR(150)
	DECLARE @idEntidad INT 
	DECLARE @codEstab VARCHAR(50)	
	DECLARE @idUsuario INT 
	DECLARE @actividad VARCHAR(4)

	SELECT @codEstab_Asig = codEstab_Asig FROM OPENJSON(@json) WITH (codEstab_Asig VARCHAR(150) '$.codEstab_Asig')

	SELECT TOP 1 @codEstab = codEstab FROM Config.Estab_Asig WITH (NOLOCK) WHERE codEstab_Asig = @codEstab_Asig

	SELECT TOP 1 @actividad = actividad FROM Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = @codEstab

	SELECT TOP 1 @idEntidad = idEntidad,  @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol;
	
	SELECT 
		ap.idPuntoEmision
	   ,ptoEmi = e.estab+'-'+pe.ptoEmi
	FROM Config.PtoEmi_Asig ap
	INNER JOIN dbo.PuntoEmision   pe ON pe.idPuntoEmision = ap.idPuntoEmision
	INNER JOIN Sri.Establecimiento e ON e.codEstab        = pe.codEstab
	WHERE codEstab_Asig = @codEstab_Asig 

	SELECT ab.idBodega
		  ,b.descripcion
	FROM Config.Bodeg_Asig ab
	INNER JOIN dbo.Bodega b ON b.idBodega = ab.idBodega
	WHERE b.estado = 1 AND codEstab_Asig = @codEstab_Asig

	IF @actividad = '01'
		BEGIN
			SELECT descripcion = 'IVA '+descripcion , codigo = 'IVA', codigoPorcentaje = codigo, tarifa = porcentaje FROM Sri.TarifaImpuesto WITH (NOLOCK) WHERE codigo IN ('2','8') AND estado = 1 ORDER BY codigoPorcentaje DESC
		END 
	
	ELSE 
		BEGIN
			SELECT descripcion = 'IVA '+descripcion , codigo = 'IVA', codigoPorcentaje = codigo, tarifa = porcentaje FROM Sri.TarifaImpuesto WITH (NOLOCK) WHERE codigo = '2' AND estado = 1 ORDER BY codigoPorcentaje DESC
		END 

	SELECT 
	ac.idCaja,
	c.descripcion
	FROM AsignacionCaja ac
	INNER JOIN Caja c ON c.idCaja = ac.idCaja 
	WHERE ac.idUsuario = @idUsuario AND ac.idEntidad = @idEntidad 


END
GO
