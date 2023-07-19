USE AcontPlus
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
-- Author:		Ivan Paz
-- Create date: 2022-10-30
-- Description:	SP FOR GET HISTORY OF MERGES
-- =============================================
IF OBJECT_ID(N'Recepcion.CompraHabitual_Get', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.CompraHabitual_Get
GO
CREATE PROCEDURE Recepcion.CompraHabitual_Get @idUsuarioRol INT
,@json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	
	SELECT tipo
	,idArticulo
	INTO #tmp
	FROM OPENJSON(@json) WITH(
		tipo SMALLINT '$.tipo',
		idArticulo INT '$.idArticulo'
	)

	IF EXISTS (SELECT 1 FROM #tmp WHERE tipo = 3)
		BEGIN
			IF NOT EXISTS (SELECT  1 FROM Recepcion.CompraHabitual ch 
									WHERE ch.idArticulo = (SELECT idArticulo FROM #tmp))
				BEGIN
					RETURN
				END
			SELECT ch.*
			,p.nombreFiscal proveedor
			,a.codigo codArticuloAcontplus
			,'(' + a.codigo + ') -> ' + a.descripcion articulo
			FROM Recepcion.CompraHabitual ch WITH (NOLOCK)
			INNER JOIN Proveedor p WITH (NOLOCK) ON ch.idProveedor = p.idProveedor
			INNER JOIN Articulo a WITH (NOLOCK) ON ch.idArticulo = a.idArticulo
			WHERE ch.idArticulo = (SELECT idArticulo FROM #tmp)
		END
	DROP TABLE #tmp
END
GO
