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
-- Create date: 2022-07-27
-- Description:	SP PARA OBTENER LOS PROVEEDORES
-- =============================================
--FactElect.ASPComp_Imp_Get_Data_Prov
IF OBJECT_ID(N'FactElect.Comp_Imp_Get_Data_Prov ', N'P') IS NOT NULL
DROP PROCEDURE FactElect.Comp_Imp_Get_Data_Prov 
GO
CREATE PROCEDURE FactElect.Comp_Imp_Get_Data_Prov
@idRol INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @idEntidad INT
	DECLARE @idSucursal INT

	SELECT @idEntidad = idEntidad, @idSucursal = idSucursal FROM AFTDataRol(@idRol)
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
END
GO
