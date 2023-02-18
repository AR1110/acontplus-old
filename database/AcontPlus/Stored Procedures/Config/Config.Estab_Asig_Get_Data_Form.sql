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

	SELECT @codEstab = codEstab FROM Config.Estab_Asig WHERE codEstab_Asig = @codEstab_Asig

	SELECT @actividad = actividad FROM Sri.Establecimiento WHERE codEstab = @codEstab

	SELECT @idEntidad = idEntidad,  @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idRol;
	
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
	WHERE codEstab_Asig = @codEstab_Asig


	SELECT codigo = 'IVA', codigoPorcentaje = codTarifaImpuesto,tarifa = porcentaje FROM Sri.ActividadEconomica WHERE codigo = @actividad
		

	SELECT 
	ac.idCaja,
	c.descripcion
	FROM AsignacionCaja ac
	INNER JOIN Caja c ON c.idCaja = ac.idCaja 
	WHERE ac.idUsuario = @idUsuario AND ac.idEntidad = @idEntidad 


END
GO
