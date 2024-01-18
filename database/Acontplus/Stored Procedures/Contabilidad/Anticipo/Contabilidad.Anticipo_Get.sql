USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPMovimientoCajaGet]    Script Date: 2/6/2023 9:25:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE Contabilidad.Anticipo_Get
	 @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT

     --> Sql
	DECLARE @params nvarchar(MAX) ,@sql nvarchar(MAX) ,@pageIndex INT ,@pageSize INT

    --> Filters
    DECLARE @checkBoxFecha BIT ,@idUsuario INT ,@idCliente INT ,@codEstado NVARCHAR(10) ,@fechaInicio DATETIME2 ,@fechaFin DATETIME2
	
    --> Recuperacion de variables
	SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Get 
    IF @tipo = 1
        BEGIN 
            
            SET @tableNames = 'anticipos'

            SET @params = '@idEntidad   INT
                          ,@idCliente   INT
						  ,@fechaInicio DATETIME2
						  ,@fechaFin    DATETIME2
						  ,@codEstado   VARCHAR(20)
                          ,@pageIndex   INT
                          ,@pageSize    INT'

            SET @sql = 'SELECT a.idAnticipo
                              ,td.idTipoDocumento
							  ,s.codEstab
							  ,dbo.AFTConvertDate(a.fechaEmision)                                  as fechaEmision
							  ,a.valor
							  ,ISNULL(UPPER(a.observaciones),'''')                                 as obs
							  ,td.codigo + ''-'' + s.estab + ''-'' + dbo.AFTAutoComplete(a.nroDoc) as serieComprobante
							  ,cl.numeroIdentificacion                                             as identificacion
							  ,cl.nombreFiscal
							  ,sef.descripcion                                                     as subEntidadFinanciera
							  ,ep.descripcion                                                      as estadoDoc
							  ,td.codigo                                                           as codDoc
							  ,u.nombreUsuario                                                     as usuario
							  ,u.nroIdentificacion                                                 as identificacionUsuario
                              ,COUNT(*) OVER()                                                     as totalRecords
						FROM dbo.Anticipo                     a WITH (NOLOCK)								  
						INNER JOIN dbo.EstadoPago            ep WITH (NOLOCK) ON ep.idEstadoPago            = a.idEstadoDocumento
						INNER JOIN Sri.Establecimiento        s WITH (NOLOCK) ON s.codEstab                 = a.codEstab
						INNER JOIN dbo.TipoDocumento         td WITH (NOLOCK) ON td.idTipoDocumento         = a.idTipoDocumento
						INNER JOIN dbo.Cliente               cl WITH (NOLOCK) ON cl.idCliente               = a.idCliente
						INNER JOIN dbo.SubEntidadFinanciera sef WITH (NOLOCK) ON sef.idSubEntidadFinanciera = a.idSubEntidadFinanciera
						INNER JOIN dbo.Usuario                u WITH (NOLOCK) ON u.idUsuario                = a.idUsarioRegister
						WHERE a.idEntidad = @idEntidad '

	        SELECT @checkBoxFecha = checkBoxFecha
		          ,@idCliente     = idCliente
		          ,@codEstado     = codEstado
		          ,@fechaInicio   = fechaInicio
		          ,@fechaFin      = fechaFin
                  ,@pageSize      = pageSize
				  ,@pageIndex     = pageIndex
	        FROM OPENJSON(@json) WITH 
            (     
                  fechaInicio   DATETIME2
		         ,fechaFin      DATETIME2 
		         ,idCliente     INT 
		         ,checkBoxFecha BIT 
                 ,codEstado     VARCHAR(10)
                 ,pageSize      INT
                 ,pageIndex     INT
            )

	
		    IF @idCliente > 0 
			    BEGIN
				    SET @sql = @sql + 'AND a.idCliente =  @idCliente'
			    END 
	    
		    IF @codEstado IS NOT NULL 
			    BEGIN
				    SET @sql = @sql + 'AND a.estado = IIF(@codEstado = ''AC'',1,0)'
			    END 

		    IF @checkBoxFecha = 1
			    BEGIN
				    SET @sql = @sql + 'AND CAST(a.fechaEmision AS DATE) BETWEEN CAST(@fechaInicio as date) AND CAST(@FechaFin as date) '
			    END 

		    SET @sql = @sql + ' ORDER BY a.idAnticipo DESC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '

 		    EXEC sp_executesql @sql
			                  ,@params 
			                  ,@idEntidad   = @idEntidad
				              ,@idCliente   = @idCliente
				              ,@fechaInicio = @fechaInicio
				              ,@fechaFin    = @fechaFin
				              ,@codEstado   = @codEstado
                              ,@pageIndex   = @pageIndex
                              ,@pageSize    = @pageSize
            RETURN 
        END 
    
    --> DataForm 
    IF @tipo = 2
        BEGIN 
            
            SET @tableNames = 'establecimiento,caja,tipoDocumento,entidadFinanciera,subEntidadFinanciera'

            SELECT idEstablecimiento,codEstab,nombreComercial,predeterminado FROM v_Estab_Asign WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY predeterminado DESC

            SELECT ac.idCaja
                  ,ca.descripcion as caja 
            FROM dbo.AsignacionCaja ac WITH (NOLOCK) 
            INNER JOIN dbo.Usuario  us WITH (NOLOCK) ON us.idUsuario = ac.idUsuario
            INNER JOIN dbo.Caja     ca WITH (NOLOCK) ON ca.idCaja    = ac.idCaja
            WHERE ac.idUsuario = @idUsuario

            SELECT idTipoDocumento,descripcion,codigo FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'A' ORDER BY descripcion DESC

            SELECT idEntidadFinanciera,descripcion,codigo FROM dbo.EntidadFinanciera WITH (NOLOCK) WHERE estado = 1

            SELECT idSubEntidadFinanciera,idEntidadFinanciera,descripcion,codigo FROM dbo.SubEntidadFinanciera WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

            RETURN
        END
END
