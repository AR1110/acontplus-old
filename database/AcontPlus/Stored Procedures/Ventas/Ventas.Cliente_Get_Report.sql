USE [Acontplus]
go 
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
IF OBJECT_ID(N'Ventas.Cliente_Get_Report', N'P') IS NOT NULL
DROP PROCEDURE Ventas.Cliente_Get_Report
GO
CREATE PROCEDURE Ventas.Cliente_Get_Report @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @sql NVARCHAR(MAX)
	DECLARE @params NVARCHAR(MAX)
	DECLARE @tipo INT
	DECLARE @idEntidad INT

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')

	SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

	-- REPORTE GENERAL DE CLIENTES -- 
	IF @tipo = 1
		BEGIN 
			
			SET @params = '@idEntidad INT'

			SET @sql = 'SELECT IDType as tipoIdentificacion
							  ,IDCard as identificacion
							  ,TradeName as razonSocial
							  ,BusinessName as nombreComercial
							  ,correo
							  ,telefono
							  ,direccion
						FROM v_Cliente cl WITH (NOLOCK)
						WHERE cl.idEntidad = @idEntidad  '

			EXEC sp_executesql  @sql
						       ,@params 
						       ,@idEntidad  = @idEntidad
		END 

END
GO
