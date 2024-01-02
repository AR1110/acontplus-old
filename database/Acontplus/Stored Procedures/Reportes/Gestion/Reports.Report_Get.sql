USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPReporteParametroGetByCode]    Script Date: 27/1/2023 15:19:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO 
-- =============================================
-- Author:		Emilio Senguana
-- Create date: 09-03-2023
-- Description:	SP PARA OBTENER LOS DATOS DEL ARCHIVO RDLC
-- =============================================
--Reporte.Report_Get '{"codigo":"RRO","format":"pdf"}', ''
CREATE OR ALTER PROCEDURE Reporte.Report_Get @json NVARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @codEstab VARCHAR(50) 
	,@codigo NVARCHAR(50)
	,@format VARCHAR(60) 
	,@idUsuarioRol INT
	,@hasParams BIT = 0

	SELECT @codEstab = codEstab
        ,@idUsuarioRol = idUsuarioRol
        ,@hasParams = hasParams
        ,@codigo = codigo
        ,@format = formato
    FROM OPENJSON(@json) WITH (
                                codEstab VARCHAR(50) '$.codEstab',
                                idUsuarioRol INT '$.idUsuarioRol',
                                hasParams BIT '$.hasParams',
                                formato NVARCHAR(15) '$.format',
		                        codigo NVARCHAR(25) '$.codigo'
                                )
	
	IF(@codEstab IS NULL OR LEN(LTRIM(RTRIM(@codEstab))) = 0)
		BEGIN
			SET @codEstab = (SELECT TOP 1 codEstab FROM Config.Estab_Asig WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol and predeterminado = 1) 
		END
	
	IF NOT EXISTS (SELECT 1 FROM Config.Reporte WITH (NOLOCK) WHERE codigo = @codigo)
		BEGIN
			SELECT '0','No existen datos para este reporte',''
			RETURN
		END

    SET @tableNames = 'ReportProps'

	--REPORT DATA RDLC
	SELECT ReportPath
	,ISNULL(@format, '') ReportFormat
	,StoredProcedure 
	,nombreReporte ReportName
	,ISNULL(@hasParams, 1) hasParams
	FROM Config.Reporte r WITH (NOLOCK)
	WHERE codigo = @codigo

	--DATASOURCES
    IF EXISTS (select 1 	FROM Config.ReporteDataSource rd WITH (NOLOCK)
	        INNER JOIN Config.Reporte r WITH (NOLOCK) ON r.idReporte = rd.idReporte
	        WHERE codigo = @codigo)
        BEGIN 
            SET @tableNames = @tableNames + ',DataSources'
            SELECT rd.position
	           ,rd.dataSource
	           FROM Config.ReporteDataSource rd WITH (NOLOCK)
	           INNER JOIN Config.Reporte r WITH (NOLOCK) ON r.idReporte = rd.idReporte
	           WHERE codigo = @codigo
        END

    
    IF EXISTS (SELECT 1  FROM Config.EstablecimientoLogo el WITH (NOLOCK)
                            INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON el.EstablecimientoId = e.idEstablecimiento
                        WHERE codEstab = @codEstab
                            AND estado = 1 )
        BEGIN
            SET @tableNames = @tableNames + ',ReportParams'

            DECLARE @content VARBINARY (MAX)
                ,@contentType VARCHAR(100)
                ,@isCompressed BIT
            
            SELECT @content = el.Content
                ,@contentType = el.ContentType
                ,@isCompressed = CAST(ISNULL(el.IsCompressed,0) AS bit)
            FROM Config.EstablecimientoLogo el WITH (NOLOCK)
                INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON el.EstablecimientoId = e.idEstablecimiento
            WHERE codEstab = @codEstab 
                AND estado = 1 

            --DEFAULT PARAMS

            DECLARE @tblParams AS TABLE (
                                    paramName VARCHAR(100),
                                    paramValue VARBINARY(MAX),
                                    isPicture BIT NOT NULL DEFAULT 0,
                                    isCompressed BIT NOT NULL DEFAULT 0)

            INSERT INTO @tblParams(paramName, paramValue, isPicture, isCompressed)
            VALUES('logo', @content, 1, @isCompressed)
            
            INSERT INTO @tblParams(paramName, paramValue)
            VALUES ('mimeType', CONVERT(VARBINARY, @contentType))

            SELECT * FROM @tblParams 
    END

END



