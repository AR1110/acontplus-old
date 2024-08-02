USE [Acontplus]
GO
/****** Object:  StoredProcedure [dbo].[ASPConfiguracionDocumentoGet]    Script Date: 28/3/2024 11:15:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Emilio Senguana
-- Create date: 2021-10-11
-- Description:	SP PARA OBTENER LA CONFIGURACION DE DOUMENTOS
-- =============================================
CREATE OR ALTER PROCEDURE Config.DocConfig_Get @userRoleId INT, @json VARCHAR(MAX), @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @tipo INT 
	DECLARE @idPuntoEmision INT 

	SELECT 
		@tipo = tipo
		,@idPuntoEmision = idPuntoEmision
	FROM OPENJSON(@json)
	WITH(
		tipo INT
		,idPuntoEmision INT 
	)

	IF @tipo = 1
		BEGIN 

             SET @tableNames = 'docs'
			SELECT 
				 idConfiguracionDocumento = ISNULL(cd.idConfiguracionDocumento,0)
				,idTipoDocumento = ISNULL(td.idTipoDocumento, 0)
				,generacionNro = ISNULL(cd.generacionNro,0)
				,ultimaSecuencia = ISNULL(cd.ultimaSecuencia,0)
				,descripcion = ISNULL(td.descripcion, '')
			FROM  TipoDocumento td
			LEFT JOIN dbo.ConfiguracionDocumento cd ON td.idTipoDocumento = cd.idTipoDocumento
			WHERE cd.idPuntoEmision = @idPuntoEmision

			UNION ALL 

			SELECT 
				  0
				 ,idTipoDocumento
				 ,CAST(0 AS bit)
				 ,0
				 ,descripcion
			FROM TipoDocumento 
			WHERE secuencial = 1 AND idTipoDocumento NOT IN  (SELECT idTipoDocumento FROM ConfiguracionDocumento WHERE idPuntoEmision = @idPuntoEmision)
			RETURN 
		END 

	IF @tipo = 2
		BEGIN
            SET @tableNames = 'estabs,tiposDoc'
			 SELECT idEstablecimiento
                      ,nombreComercial
                      ,codEstab
                      ,idPuntoEmision
                      ,estab + '-' + ptoEmi as ptoEmi
                      ,defaultEstab
                      ,defaultPtoEmi 
             FROM v_PtoEmi_Asign WITH(NOLOCK) 
			 WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

	        SELECT * FROM Acontplus.dbo.TipoDocumento WITH(NOLOCK) WHERE estado = 1 AND secuencial = 1	
		END 
	
END
