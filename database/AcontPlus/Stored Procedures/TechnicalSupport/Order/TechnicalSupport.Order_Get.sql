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
-- Create date: 2023-10-18
-- Description:	SP for get orders
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.Order_Get @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON; 
	DECLARE @tipo INT
    ,@companyId INT

	SELECT @tipo = tipo FROM OPENJSON (@json) WITH (tipo INT '$.tipo')
	
    SET @companyId = (SELECT idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId)

	IF @tipo = 1
		BEGIN
			SET @tableNames = 'puntosEmision,bodegas,subfamilias,configuracion,configDocumento'
			SELECT * FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC
			SELECT * FROM v_Bodega_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId
			SELECT * FROM SubFamilia WITH(NOLOCK) WHERE idEntidad = @companyId
			SELECT * FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @companyId AND codConfig = 'CD' --AND JSON_VALUE(jsonConfig, '$[0].codTransaccion') = 'AL'
			SELECT cd.*
			FROM Config.v_ConfigDocumento cd
				INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab
			WHERE pa.idUsuarioRol = @userRoleId
			AND cd.codDoc = 'TF'
		END

END
GO
