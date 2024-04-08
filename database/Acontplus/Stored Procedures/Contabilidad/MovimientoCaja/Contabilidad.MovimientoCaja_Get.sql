USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPMovimientoCajaGet]    Script Date: 2/6/2023 9:25:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE Contabilidad.MovimientoCaja_Get
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
    DECLARE @checkBoxFecha BIT ,@idUsuario INT ,@idEmpleado INT ,@codEstado NVARCHAR(10) ,@fechaInicio DATETIME2 ,@fechaFin DATETIME2
	
    --> Recuperacion de variables
	SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Get 
    IF @tipo = 1
        BEGIN 
            
            SET @tableNames = 'movimientos'

            SET @params = '@idEntidad   INT
						  ,@idEmpleado  INT 
						  ,@fechaInicio DATETIME2
						  ,@fechaFin    DATETIME2
						  ,@codEstado   VARCHAR(20)
                          ,@pageIndex   INT
                          ,@pageSize    INT'

            SET @sql = 'SELECT idTipoDocumento      = td.idTipoDocumento									
							  ,codDoc               = td.codigo
							  ,idMovimientoCaja     = mc.idMovimientoCaja
							  ,codEstab             = mc.codEstab
							  ,fechaEmision         = dbo.AFTConvertDate(mc.fechaEmision)
							  ,valor                = mc.valor * IIF(td.codigo = ''EC'',-1,1)
							  ,observaciones        = ISNULL(mc.observaciones,'''')
							  ,nroDoc               = td.codigo + ''-'' + s.estab + ''-'' + dbo.AFTAutoComplete(mc.nroDoc) 
							  ,estado               = IIF(mc.estado = 1,''Activo'',''Anulado'')
							  ,subEntidadFinanciera = sef.descripcion
							  ,empleado             = UPPER(e.nombreCompleto)
							  ,caja                 = UPPER(c.descripcion)
							  ,u.nroIdentificacion
                              ,COUNT(*) OVER() as totalRecords
					FROM dbo.MovimientoCaja              mc WITH (NOLOCK) 
					INNER JOIN dbo.Caja                   c WITH (NOLOCK) ON c.idCaja                   = mc.idCaja
					INNER JOIN dbo.TipoDocumento         td WITH (NOLOCK) ON td.idTipoDocumento         = mc.idTipoDocumento
					INNER JOIN dbo.SubEntidadFinanciera sef WITH (NOLOCK) ON sef.idSubEntidadFinanciera = mc.idSubEntidadFinanciera								
					INNER JOIN Sri.Establecimiento        s WITH (NOLOCK) ON s.codEstab                 = mc.codEstab
					INNER JOIN dbo.Empleado               e WITH (NOLOCK) ON e.idEmpleado               = mc.idEmpleado
					INNER JOIN dbo.Usuario                u WITH (NOLOCK) ON u.idUsuario                = mc.idUsuarioRegister    
					WHERE mc.idEntidad = @idEntidad '

	        SELECT @checkBoxFecha  = checkBoxFecha
		          ,@idEmpleado     = idEmpleado
		          ,@codEstado      = codEstado
		          ,@fechaInicio    = fechaInicio
		          ,@fechaFin       = fechaFin
                  ,@pageSize       = pageSize
				  ,@pageIndex      = pageIndex
	        FROM OPENJSON(@json) WITH 
            (     
                  fechaInicio     DATETIME2
		         ,fechaFin        DATETIME2 
		         ,idEmpleado      INT 
		         ,checkBoxFecha   BIT 
                 ,codEstado       VARCHAR(10)
                 ,pageSize        INT
                 ,pageIndex       INT
            )

	
		    IF @idEmpleado > 0 
			    BEGIN
				    SET @sql = @sql + 'AND mc.idEmpleado =  @idEmpleado'
			    END 
	    
		    IF @codEstado IS NOT NULL 
			    BEGIN
				    SET @sql = @sql + 'AND mc.estado = IIF(@codEstado = ''AC'',1,0)'
			    END 

		    IF @checkBoxFecha = 1
			    BEGIN
				    SET @sql = @sql + 'AND CAST(mc.fechaEmision AS DATE) BETWEEN CAST(@fechaInicio as date) AND CAST(@FechaFin as date) '
			    END 

		    SET @sql = @sql + ' ORDER BY mc.idMovimientoCaja DESC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '


 		    EXEC sp_executesql @sql
			                  ,@params 
			                  ,@idEntidad   = @idEntidad
				              ,@idEmpleado  = @idEmpleado
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
            WHERE ac.idUsuario = @idUsuario AND ac.idEntidad = @idEntidad


            SELECT idTipoDocumento,descripcion,codigo FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo IN ('IC','EC') ORDER BY descripcion DESC

            SELECT idEntidadFinanciera,descripcion,codigo FROM dbo.EntidadFinanciera WITH (NOLOCK) WHERE estado = 1

            SELECT idSubEntidadFinanciera,idEntidadFinanciera,descripcion,codigo FROM dbo.SubEntidadFinanciera WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

            RETURN
        END

      IF @tipo = 3
        BEGIN 
            
            SET @tableNames = 'establecimiento'

            SELECT idEstablecimiento,codEstab,nombreComercial,predeterminado FROM v_Estab_Asign WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY predeterminado DESC

            RETURN
        END
END
