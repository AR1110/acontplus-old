USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-10-11-03
-- Description:	SP FOR GET TPV CONFIGS
-- =============================================
IF OBJECT_ID(N'Restaurant.ConfigTpv_Get ', N'P') IS NOT NULL
DROP PROCEDURE Restaurant.ConfigTpv_Get
GO
CREATE PROCEDURE Restaurant.ConfigTpv_Get @idRol INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @codEstab VARCHAR(50)
	DECLARE @tmp AS TABLE( codEstab VARCHAR(50) NOT NULL  
	,codigo VARCHAR(2) NOT NULL UNIQUE
	,descripcion VARCHAR(100) NOT NULL
	,horaInicio TIME NULL
	,horaFin TIME NULL
	,estado BIT NULL 
	)

	SELECT @codEstab = codEstab FROM Config.Estab_Asig WHERE idUsuarioRol = @idRol AND predeterminado = 1

	INSERT INTO @tmp(codEstab, codigo, descripcion, horaInicio, horaFin, estado)
	VALUES(@codEstab, 'D', 'Desayuno', '08:00:00', '10:00:00', 0),(@codEstab, 'A', 'Almuerzo', '12:00:00', '14:30:00', 0)
	,(@codEstab, 'C', 'Cena', '17:30:00', '20:00:00', 0)

	SELECT ISNULL(ct.idConfigTpv,0) idConfigTpv
	      ,ISNULL(ct.codEstab, t.codEstab) codEstab
	      ,ISNULL(ct.codigo,t.codigo) codigo
	      ,ISNULL(ct.descripcion,t.descripcion) descripcion
	      ,ISNULL(ct.horaInicio,t.horaInicio) horaInicio
	      ,ISNULL(ct.horaFin,t.horaFin) horaFin
	      ,ISNULL(ct.estado, t.estado) estado
	FROM @tmp t
	LEFT JOIN Restaurant.ConfigTpv ct ON t.codEstab = ct.codEstab AND t.codigo = ct.codigo

END
GO
