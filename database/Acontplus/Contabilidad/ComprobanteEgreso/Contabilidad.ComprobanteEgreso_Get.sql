USE [AcontPlus] 
-- =============================================
-- Author:		Emilio Senguana
-- Create date: 21-02-2024 
GO
CREATE OR ALTER PROCEDURE Contabilidad.ComprobanteEgreso_Get @userRoleId INT, @json NVARCHAR(MAX),  @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT

    -->Filters
	DECLARE @checkBoxFecha   BIT 
		   ,@fechaInicio     DATETIME2 
		   ,@fechaFin        DATETIME2
		   ,@byPersona       VARCHAR(100)
		   ,@byUsuario       INT
		   ,@byTipoDocumento INT
		   ,@byComprobante   INT
		   ,@byEstado        INT 

    --> Recuperacion de Informacion
	SELECT @tipo = tipo  FROM OPENJSON(@json) WITH (tipo INT)

	SELECT TOP 1 @idEntidad  = idEntidad FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId

    --> Get
    IF @tipo = 1
        BEGIN 
                
            SET @tableNames = 'comprobantesEgreso'

            SET @sql = 'SELECT ce.idComprobanteEgreso
							  ,ce.total
                              ,es.codEstab
                              ,FORMAT(ce.fechaRegistro, ''dd/MM/yyyy HH:mm'')                   as fechaRegistro
                              ,Common.ufnGetSerieDocument(''CE'',es.estab,ce.nroDocumento,0)    as nroDoc
							  ,UPPER(cu.BusinessName)                                           as persona
							  ,cu.IDCard												        as nroIdentificacion
							  ,''Ninguna''                                                      as caja
							  ,CASE WHEN ce.estado = 0 THEN ''table-danger'' ELSE '''' END      as color
							  ,CASE WHEN ce.estado = 0 THEN ''Anulado'' ELSE ''Activo'' END     as estado
							  ,us.nombreUsuario                                                 as usuario
                              ,COUNT(*) OVER()                                                  as totalRecords
						FROM dbo.ComprobanteEgreso     ce WITH (NOLOCK) 
						INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = ce.idEstablecimiento
						INNER JOIN dbo.Usuario         us WITH (NOLOCK) ON us.idUsuario         = ce.idUsuario
						INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.Id				= ce.CustomerId
						WHERE ce.idEntidad = @idEntidad '


            SET @params = '@idEntidad         INT
						  ,@fechaI            DATETIME2
						  ,@fechaF            DATETIME2
						  ,@nroIdentificacion VARCHAR(100)
						  ,@idTipoDocumento   INT
						  ,@idComprobante     INT
						  ,@estado            INT
						  ,@idUsuario         INT
                          ,@pageIndex         INT
                          ,@pageSize          INT'

			SELECT @checkBoxFecha   = checkBoxFecha 
				  ,@byComprobante   = byComprobante
				  ,@byUsuario       = byUsuario
				  ,@byPersona       = byPersona
				  ,@byTipoDocumento = byTipoDocumento
				  ,@byEstado        = byEstado
				  ,@fechaFin        = fechaFin
				  ,@fechaInicio     = fechaInicio
                  ,@pageSize        = pageSize
				  ,@pageIndex       = pageIndex
			FROM OPENJSON(@json) WITH 
            (
                 checkBoxFecha     BIT 
                ,checkBoxDocumento BIT 
                ,checkBoxUsuario   BIT 
                ,fechaInicio       DATETIME2 
                ,fechaFin          DATETIME2 
                ,byPersona         VARCHAR(100) 
                ,byTipoDocumento   INT 
                ,byComprobante     INT 
                ,byUsuario         INT 
                ,byEstado          INT
                ,pageSize          INT
                ,pageIndex         INT
            )
 
		    IF @byTipoDocumento > 0 AND @byComprobante > 0
			    BEGIN
				    SET @sql = @sql + 'AND ce.idComprobanteEgreso IN (SELECT pd.idComprobanteEgreso FROM PagoDocumento pd WHERE pd.idTipoDocumento = @idTipoDocumento AND pd.idComprobante = @idComprobante) '
			    END 

		    IF @byEstado IS NOT NULL
			    BEGIN
				    SET @sql = @sql + 'AND ce.estado = @estado '
			    END 

		    IF @checkBoxFecha = 1
			    BEGIN
				    SET @sql = @sql + 'AND CAST(ce.fechaRegistro as date) BETWEEN CAST(@fechaI as date) AND CAST(@fechaF as date) '
			    END 
			
		    IF @byPersona IS NOT NULL
			    BEGIN
				    SET @sql = @sql + 'AND cu.IDCard = @nroIdentificacion '
			    END 

		    IF @byUsuario > 0
			    BEGIN
				    SET @sql = @sql + 'AND ce.idUsuario = @idUsuario '
			    END 

		    SET @sql = @sql + 'ORDER BY ce.idComprobanteEgreso DESC OFFSET @pageSize * (@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '

		    EXEC sp_executesql @sql
			                  ,@params
				              ,@idEntidad         = @idEntidad
				              ,@fechaI            = @fechaInicio
				              ,@fechaF            = @fechaFin
				              ,@nroIdentificacion = @byPersona
				              ,@idTipoDocumento   = @byTipoDocumento
				              ,@idComprobante     = @byComprobante
				              ,@estado            = @byEstado
				              ,@idUsuario         = @byUsuario
                              ,@pageSize          = @pageSize
                              ,@pageIndex         = @pageIndex

            RETURN 

        END
        
    --> Filters 
    IF @tipo = 2
        BEGIN 
            SET @tableNames = 'estabs'

            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,estab + '-' + ptoEmi  as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @userRoleId 
            ORDER BY defaultEstab DESC

            RETURN 
        END 

END
