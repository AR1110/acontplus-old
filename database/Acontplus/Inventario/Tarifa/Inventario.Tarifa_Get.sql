USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPTarifaRead]    Script Date: 14/5/2023 13:24:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
-- =============================================
-- Author:		Alexis Ramirez 
-- Create date: 2021-06-29
-- Description:	SP para leer las tarifas de la empresa
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.Tarifa_Get @userRoleId INT, @json VARCHAR(MAX), @tableNames VARCHAR(MAX) OUTPUT 
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idEntidad INT  
	DECLARE @pageIndex int 
	DECLARE @pageSize int 

	SELECT 
		@pageIndex = pageIndex,
		@pageSize = pageSize
	FROM OPENJSON(@json)
	WITH(
		pageIndex int,
		pageSize int
	)

	SELECT @idEntidad = idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId
     
        SET @tableNames='tarifas'
		SELECT 
			idTarifa 
			,descripcion
			,codigo
			,predeterminada
			,estado
			,ventaPorMayor 
		FROM Tarifa
		WHERE idEntidad = @idEntidad 
		ORDER BY idTarifa ASC
		 

	 
END
