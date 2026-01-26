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
CREATE OR ALTER PROCEDURE Config.DocConfig_Get @UserRoleId INT,
@Json VARCHAR(MAX),
@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;

    --> Variables global 
	DECLARE @Tipo INT,
        @CompanyUuid UNIQUEIDENTIFIER;
        

    --> Gestion General
	SELECT @Tipo = tipo FROM OPENJSON(@Json) WITH(tipo INT);

    SET @CompanyUuid = (SELECT uuid FROM v_usuario WHERE idUsuarioRol = @UserRoleId)

    IF @Tipo = 1
        BEGIN 
        
            DECLARE @idPuntoEmision INT 
            SELECT @idPuntoEmision = idPuntoEmision FROM OPENJSON(@Json) WITH(idPuntoEmision INT)
            SET @tableNames = 'docs'
            SELECT idConfiguracionDocumento = ISNULL(cd.idConfiguracionDocumento,0)
                  ,idTipoDocumento = ISNULL(td.idTipoDocumento, 0)
                  ,ultimaSecuencia = ISNULL(cd.ultimaSecuencia,0)
                  ,descripcion = ISNULL(td.descripcion, '')
                  ,estado = ISNULL(cd.estado, CAST(0 as bit))
                  ,td.infoAdicional
            FROM dbo.ConfiguracionDocumento cd WITH (NOLOCK)
            INNER JOIN TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento = cd.idTipoDocumento
            WHERE cd.idPuntoEmision = @idPuntoEmision
            UNION ALL 
            SELECT 0
                  ,idTipoDocumento
                  ,0
                  ,descripcion
                  ,CAST(0 as bit) as estado
                  ,infoAdicional
            FROM TipoDocumento td
            WHERE secuencial = 1
              AND idTipoDocumento NOT IN (SELECT idTipoDocumento FROM ConfiguracionDocumento WHERE idPuntoEmision = @idPuntoEmision)
        
            ORDER BY idConfiguracionDocumento ASC
            RETURN 
        END

    --> DataForm
	IF @Tipo = 2
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
			WHERE idUsuarioRol = @UserRoleId 
            ORDER BY defaultEstab DESC

	        SELECT * FROM dbo.TipoDocumento td WITH(NOLOCK)
            INNER JOIN Config.Aplicacion a ON td.aplicacionId = a.Id
            INNER JOIN Config.LicenciaDetalle ld ON a.Id = ld.AplicacionId
            INNER JOIN Sales.SuscripcionDetalle sd ON ld.Id = sd.LicenciaDetalleId
            INNER JOIN Sales.Suscripcion s ON sd.SuscripcionId = s.Id
            INNER JOIN Config.Company c ON s.CompanyId = c.Id AND c.Uuid = @CompanyUuid
            WHERE estado = 1
              AND secuencial = 1	
            RETURN 
		END 
	
    --> Get InfoAdicional
    IF @Tipo = 3
        BEGIN   
            SET @tableNames = 'infoAdicional'

            DECLARE @id INT

            SELECT @id = id FROM OPENJSON(@Json) WITH (id INT)

            SELECT infoAdicional FROM dbo.ConfiguracionDocumento WITH (NOLOCK) WHERE idConfiguracionDocumento = @id

            RETURN 
        END 
END
