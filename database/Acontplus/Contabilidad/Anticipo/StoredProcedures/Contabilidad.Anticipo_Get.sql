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
           ,@nroIdentificacion VARCHAR(20)
	
    --> Recuperacion de variables
	SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Get 
    IF @tipo = 1
        BEGIN 
            
            SET @tableNames = 'anticipos'

            SET @params = '@idEntidad         INT
                          ,@nroIdentificacion VARCHAR(50)
						  ,@fechaInicio       DATETIME2
						  ,@fechaFin          DATETIME2
						  ,@codEstado         VARCHAR(20)
                          ,@pageIndex         INT
                          ,@pageSize          INT'

            SET @sql = 'SELECT an.idAnticipo
							  ,es.codEstab
							  ,FORMAT(an.fechaEmision, ''dd/MM/yyyy HH:mm'')				     as fechaEmision 
							  ,an.valor
							  ,ISNULL(UPPER(an.observaciones),'''')                              as obs
							  ,''A'' + ''-'' + es.estab + ''-'' + dbo.AFTAutoComplete(an.nroDoc) as serieComprobante
							  ,cu.IDCard			                                             as identificacion
							  ,cu.BusinessName 											         as nombreFiscal
							  ,sf.descripcion                                                    as subEntidadFinanciera
							  ,IIF(ci.estado = 1 ,''Activo'',''Anulado'')                        as estadoDoc
							  ,''A''														     as codDoc
							  ,us.nombreUsuario                                                  as usuario
							  ,uscc.IDCard                                                       as identificacionUsuario
                              ,COUNT(*) OVER()                                                   as totalRecords
						FROM dbo.Anticipo                    an WITH (NOLOCK)								  
						INNER JOIN dbo.SubEntidadFinanciera  sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera  = an.idSubEntidadFinanciera
						INNER JOIN dbo.Usuario               us WITH (NOLOCK) ON us.idUsuario               = an.idUsarioRegister
                        INNER JOIN Customer.Customer       uscc WITH (NOLOCK) ON uscc.Id                    = us.CustomerId
						INNER JOIN dbo.ComprobanteIngreso    ci WITH (NOLOCK) ON ci.idComprobanteIngreso    = an.idComprobanteIngreso 
						INNER JOIN Sri.Establecimiento       es WITH (NOLOCK) ON es.idEstablecimiento       = ci.idEstablecimiento
						INNER JOIN Customer.Customer         cu WITH (NOLOCK) ON cu.Id						= ci.CustomerId
						WHERE an.idEntidad = @idEntidad '

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
                    DECLARE @CustomerId INT

                    SELECT TOP 1 @CustomerId = CustomerId FROM dbo.Cliente WITH (NOLOCK) WHERE idCliente = @idCliente
                    
                    SELECT TOP 1 @nroIdentificacion = IDCard FROM Customer.Customer WITH (NOLOCK) WHERE Id = @CustomerId

				    SET @sql = @sql + 'AND cu.IdCard =  @nroIdentificacion '
			    END 
	    
		    IF @codEstado IS NOT NULL 
			    BEGIN
				    SET @sql = @sql + 'AND ci.estado = IIF(@codEstado = ''AC'',1,0)'
			    END 

		    IF @checkBoxFecha = 1
			    BEGIN
				    SET @sql = @sql + 'AND CAST(an.fechaEmision AS DATE) BETWEEN CAST(@fechaInicio as date) AND CAST(@FechaFin as date) '
			    END 

		    SET @sql = @sql + ' ORDER BY an.idAnticipo DESC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '

 		    EXEC sp_executesql @sql
			                  ,@params 
			                  ,@idEntidad         = @idEntidad
				              ,@nroIdentificacion = @nroIdentificacion
				              ,@fechaInicio       = @fechaInicio
				              ,@fechaFin          = @fechaFin
				              ,@codEstado         = @codEstado
                              ,@pageIndex         = @pageIndex
                              ,@pageSize          = @pageSize
            RETURN 
        END 
    
    --> DataForm 
    IF @tipo = 2
        BEGIN 
            
            SET @tableNames = 'establecimiento,entidadFinanciera,subEntidadFinanciera'

            SELECT es.idEstablecimiento,es.codEstab,es.nombreComercial,ea.predeterminado
            FROM Config.Estab_Asig         ea WITH (NOLOCK) 
            INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = ea.codEstab
            WHERE idUsuarioRol = @userRoleId ORDER BY predeterminado DESC
			 
            SELECT idEntidadFinanciera,descripcion,codigo FROM dbo.EntidadFinanciera WITH (NOLOCK) WHERE estado = 1

            SELECT idSubEntidadFinanciera,idEntidadFinanciera,descripcion,codigo FROM dbo.SubEntidadFinanciera WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

            RETURN
        END

    ---Filters
	IF @tipo = 3
        BEGIN 
            
            SET @tableNames = 'establecimiento'

            SELECT es.idEstablecimiento,es.codEstab,es.nombreComercial,ea.predeterminado
            FROM Config.Estab_Asig         ea WITH (NOLOCK) 
            INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = ea.codEstab
            WHERE idUsuarioRol = @userRoleId ORDER BY predeterminado DESC			

            RETURN
        END
END
