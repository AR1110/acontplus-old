USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Almacen].[GestionGeneral_Get]    Script Date: 11/14/2022 9:27:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
--exec  [Almacen].[GestionGeneral_Get] 38,'[]'
-- =============================================
IF OBJECT_ID(N'Almacen.Articulo_Get_Data_Form', N'P') IS NOT NULL
DROP PROCEDURE Almacen.Articulo_Get_Data_Form 
GO
CREATE PROCEDURE Almacen.Articulo_Get_Data_Form @idRol INT,@json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT 

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT 
		 idFamilia    = f.idFamilia
		,idSubFamilia = sf.idSubFamilia
		,familia      = f.descripcion
		,subFamilia   = sf.descripcion
		,sf.siglas
		,sf.ultimoSecuencial
	FROM dbo.SubFamilia sf  WITH (NOLOCK)
	INNER JOIN Familia f    WITH (NOLOCK) ON sf.idFamilia = f.idFamilia 
	WHERE sf.idEntidad = @idEntidad AND sf.estado = 1

	SELECT idFamilia, descripcion      FROM dbo.Familia WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1
	
	SELECT idMedida,codigo,descripcion FROM dbo.Medida  WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

	SELECT idModelo,codigo,descripcion FROM dbo.Modelo  WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

	SELECT idMarca,codigo,descripcion  FROM dbo.Marca   WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1
	
END
