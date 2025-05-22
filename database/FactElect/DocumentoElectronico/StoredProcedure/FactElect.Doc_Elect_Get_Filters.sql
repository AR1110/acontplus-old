USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2025-05-22
-- Description:	sp for documentos electoronicos filters
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.Doc_Elect_Get_Filters @userRoleId INT
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		SET @tableNames = 'tipoDocumentos,estadoDocumentos,estabs,estadoPagos'

        SELECT idTipoDocumento,descripcion,codigoSri as codDoc FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigoSri IN ('01','03','04','06','07') ORDER BY codigoSri

        SELECT idEstadoServicio, codigo as codEstado , descripcion FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE estado = 1 AND codigo IN (4,6,8)

		SELECT idEstablecimiento
               ,nombreComercial
               ,codEstab
               ,idPuntoEmision
               ,estab + '-' + ptoEmi as ptoEmi
               ,defaultEstab
               ,defaultPtoEmi
         FROM v_PtoEmi_Asign
         WHERE idUsuarioRol = @userRoleId
         ORDER BY defaultEstab DESC

         SELECT idEstadoPago,descripcion,codigo FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo IN ('PFC','NCBR','CBR','A')

	END TRY
	BEGIN CATCH
		THROW;
	END CATCH
END
GO
