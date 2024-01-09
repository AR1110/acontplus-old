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

     --> Filters
    DECLARE @checkBoxFecha BIT ,@idEmpleado INT,@codEstadoDoc VARCHAR(20) ,@idUsuario INT ,@fechaInicio DATETIME2 ,@fechaFin DATETIME2

	DECLARE @byEntidad INT 
		   ,@byEmpleado INT
		   ,@byEstado INT
		   ,@checkBoxEmpleado BIT
		   ,@checkBoxEstado BIT 
		   ,@codDoc NVARCHAR(10)
		   ,@params NVARCHAR(MAX) = '@idEntidad    INT
									,@idEmpleado   INT 
									,@fechaInicio  DATETIME
									,@fechaFin     DATETIME
									,@codDocParamt VARCHAR(20)'
		 
		  ,@sql NVARCHAR(MAX) = 'SELECT  TOP 50 
		                                 idTipoDocumento      = td.idTipoDocumento									
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
								FROM dbo.MovimientoCaja mc WITH (NOLOCK) 
								INNER JOIN dbo.Caja                   c WITH (NOLOCK) ON c.idCaja                   = mc.idCaja
								INNER JOIN dbo.TipoDocumento         td WITH (NOLOCK) ON td.idTipoDocumento         = mc.idTipoDocumento
								INNER JOIN dbo.SubEntidadFinanciera sef WITH (NOLOCK) ON sef.idSubEntidadFinanciera = mc.idSubEntidadFinanciera								
								INNER JOIN Sri.Establecimiento        s WITH (NOLOCK) ON s.codEstab                 = mc.codEstab
								INNER JOIN dbo.Empleado               e WITH (NOLOCK) ON e.idEmpleado               = mc.idEmpleado
								INNER JOIN dbo.Usuario                u WITH (NOLOCK) ON u.idUsuario                = mc.idUsuarioRegister    
								WHERE mc.idEntidad = @idEntidad '
	
	SELECT TOP 1 @byEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SELECT 
		 @checkBoxEmpleado = checkBoxEmpleado
		,@checkBoxEstado   = checkBoxEstado
		,@checkBoxFecha    = checkBoxFecha
		,@byEmpleado       = byEmpleado
		,@byEstado         = byEstado
		,@codDoc           = (SELECT codigo FROM EstadoPago WHERE idEstadoPago = byEstado)
		,@fechaInicio      = CONVERT(datetime,fechaInicio,121) 
		,@fechaFin         = CONVERT(datetime,fechaFin,121) 
	FROM OPENJSON(@json)
	WITH (fechaInicio VARCHAR(200) '$.fechaInicio'
		 ,fechaFin    VARCHAR(200) '$.fechaFin'
		 ,byEstado             INT '$.byEstado'
		 ,byEmpleado           INT '$.byEmpleado'
		 ,checkBoxFecha        BIT '$.checkBoxDate'
		 ,checkBoxEstado       BIT '$.checkBoxEstado'
		 ,checkBoxUsuario      BIT '$.checkBoxUsuario'
		 ,checkBoxEmpleado     BIT '$.checkBoxEmpleado')

	BEGIN TRY 
	
		IF @checkBoxEmpleado =  1
			BEGIN
				SET @sql = @sql+'AND mc.idEmpleado =  @idEmpleado'
			END 
	    
		IF @checkBoxEstado = 1 
			BEGIN
				SET @sql = @sql+'AND mc.estado = IIF(@codDocParamt =''AC'',1,0)'
			END 

		IF @checkBoxFecha = 1
			BEGIN
				SET @sql = @sql+'AND CAST(mc.fechaEmision AS DATE) BETWEEN CAST(@fechaI as date) AND CAST(@FechaF as date) '
			END 

		SET @sql = @sql+' ORDER BY mc.idMovimientoCaja DESC'


 		EXEC sp_executesql 
			      @sql
			     ,@params 
			     ,@idEntidad    = @byEntidad
				 ,@idEmpleado   = @byEmpleado
				 ,@fechaI       = @fechaInicio
				 ,@fechaF       = @fechaFin
				 ,@codDocParamt = @codDoc

	END TRY 

	BEGIN CATCH
		SELECT '0','Error en el proces de Get: '+ ERROR_MESSAGE(),'Movimiento Caja'
		RETURN 
	END CATCH 


END
