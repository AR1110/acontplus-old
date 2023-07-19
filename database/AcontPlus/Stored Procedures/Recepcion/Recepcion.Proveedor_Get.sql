USE Acontplus
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-07-27
-- Description:	SP PARA OBTENER LOS PROVEEDORES
-- =============================================
--FactElect.Comp_Imp_Get_Prov 162,  '{"tipo: 1, "ruc":"1791715772001"}'
IF OBJECT_ID(N'Recepcion.Proveedor_Get ', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Proveedor_Get 
GO
CREATE PROCEDURE Recepcion.Proveedor_Get @idRol INT
,@jsonData NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @idEntidad INT
	DECLARE @tabla AS TABLE (
		tipo TINYINT NOT NULL,
		--rowsOfPage INT NULL,
		--pageNumber INT NULL,
		ruc VARCHAR(25) NULL
	)

	INSERT INTO @tabla(tipo, ruc)
	SELECT tipo, LTRIM(RTRIM(ruc)) FROM OPENJSON(@jsonData)WITH(tipo TINYINT '$.tipo', ruc VARCHAR(25) '$.ruc')
	
	SET @idEntidad = (SELECT idEntidad FROM AFTDataRol(@idRol))

	IF EXISTS(SELECT 1 FROM @tabla WHERE tipo = 2)
		BEGIN
			--0
			SELECT * FROM TipoIdentificacion
			--1
			SELECT * FROM TipoClienteProveedor -- where idEntidad
			--2
			SELECT * FROM TipoEntidad
			--3
			SELECT * FROM SubContribuyente
			--4
			SELECT * FROM TiempoCredito WHERE idEntidad = @idEntidad AND gestion = 0
			--5
			SELECT p.idProvincia, p.descripcion provincia, c.idCiudad, c.descripcion ciudad  
			FROM Ciudad c
			INNER JOIN dbo.Provincia p ON c.idProvincia = p.idProvincia
			RETURN
		END
	IF EXISTS(SELECT 1 FROM dbo.Proveedor WHERE numeroIdentificacion = (SELECT TOP 1 ruc FROM @tabla))
		BEGIN
			SELECT idProveedor
			,idTiempoCredito
			FROM dbo.Proveedor p WITH(NOLOCK)
			WHERE idEntidad = @idEntidad 
			AND numeroIdentificacion = (SELECT TOP 1 ruc FROM @tabla)
			RETURN
		END
		
END
