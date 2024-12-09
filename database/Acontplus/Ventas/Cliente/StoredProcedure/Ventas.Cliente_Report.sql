USE AcontPlus
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-11-16
-- Description:	SP para reporte de los clietes
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.Cliente_Report 
     @userRoleId INT
	,@json NVARCHAR(MAX)
	,@tableNames VARCHAR(500) OUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON; 
    SET LANGUAGE SPANISH

	DECLARE @idEntidad INT


	SET @idEntidad = (SELECT TOP 1 idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId)

	SET @tableNames = 'customers'

	SELECT cl.IDCard          as numeroIdentificacion
		  ,cl.TradeName       as nombreComercial
		  ,cl.BusinessName    as nombreFiscal
		  ,cl.direccion
		  ,cl.telefono
		  ,cl.correo
		  ,cl.consumidorFinal
		  ,cl.validationSri
		  ,cl.tipoIdentificacion
          ,cl.codTipoIdentificacion
	FROM v_Cliente cl
    WHERE cl.idEntidad = @idEntidad
END
