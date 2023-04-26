USE AcontPlus;
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('FactElect.Cliente_Get')IS NOT NULL
	DROP PROCEDURE FactElect.Cliente_Get
GO
-- =============================================
-- Author:		Emilio Senguana
-- Create date: 22-04-2023 20h43 
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE FactElect.Cliente_Get
	@idUsuarioRol INT, 
	@json VARCHAR(800)
AS
BEGIN
	
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT 
	DECLARE @totalRecords INT 
	DECLARE @dataExists CHAR(2)
	DECLARE @bySearch VARCHAR(MAX)

	DECLARE @typeOperation INT 
	DECLARE @idCliente INT 

	DECLARE @params NVARCHAR(MAX) = '@idEntidad INT
									,@bySearch VARCHAR(500)
									,@totalRecords INT'

	DECLARE @sql NVARCHAR(MAX) = 'SELECT TOP 50 
										 idCliente = cl.idCliente
										,numeroIdentificacion = cl.numeroIdentificacion
										,nombreFiscal = cl.nombreFiscal
										,direccion =  Helper.IsNullOrEmpty(cl.direccion)
										,telefono = Helper.IsNullOrEmpty(cl.telefono)
										,correo = Helper.IsNullOrEmpty(cl.correo) 
										,estado = cl.estado
										,consumidorFinal = cl.consumidorFinal
										,totalRecords = @totalRecords
										,validationSri
										,tipoIdentificacion = ti.codigo
								  FROM Cliente cl
								  LEFT JOIN TipoIdentificacion ti WITH(NOLOCK) ON ti.idTipoIdentificacion = cl.idTipoIdentificacion
								  WHERE cl.idEntidad = @idEntidad ';

	

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol

	SET @totalRecords = (SELECT COUNT(*) FROM dbo.Cliente WHERE idEntidad = @idEntidad)

	SELECT @bySearch   = (REPLACE(bySearch,SPACE(1),'%'))
	       ,@dataExists = dataExists 
		   ,@typeOperation = typeOperation
		   ,@idCliente = idCliente
	FROM OPENJSON(@json)
	WITH (bySearch NVARCHAR(255) '$.bySearch'
		  ,dataExists CHAR(2) '$.dataExists'
		  ,typeOperation INT '$.typeOperation'
		  ,idCliente INT '$.id'
	)

	--Fin by id the customer 
	IF @typeOperation = 2 
		BEGIN 
			SELECT 
				 idCliente = cl.idCliente
				,idTipoClienteProveedor = ISNULL(cl.idTipoClienteProveedor,0)
				,idTipoEntidad = ISNULL(cl.idTipoEntidad,0)
				,idSubContribuyente = ISNULL(cl.idSubContribuyente,0)
				,idTiempoCredito = ISNULL(cl.idTiempoCredito,0)
				,idTipoIdentificacion = cl.idTipoIdentificacion
				,idCiudad = ISNULL(cl.idCiudad,0)
				,numeroIdentificacion = cl.numeroIdentificacion
				,nombreFiscal = cl.nombreFiscal
				,montoCredito = ISNULL(cl.montoCredito,0)
				,nombreComercial = cl.nombreComercial
				,direccion = ISNULL(cl.direccion,'')
				,telefono = ISNULL(cl.telefono,'')
				,correo = ISNULL(cl.correo,'')
				,estado = ISNULL(cl.estado,0)
				,idEmpleado = ISNULL(cl.idEmpleado, 0) 
				,diasCredito = ISNULL(tc.diasCredito,0)
				,empleado = ISNULL(e.nombreCompleto, '')  
				,idEmpresa = ISNULL(cl.idEmpresa,0) 
				,idCargo = ISNULL(cl.idCargo,0)
				,placa = ISNULL(cl.placa,'')
				,validationSri
			FROM Cliente cl 
			LEFT JOIN TiempoCredito tc ON tc.idTiempoCredito = cl.idTiempoCredito
			LEFT JOIN Empleado e ON e.idEmpleado = cl.idEmpleado
			WHERE cl.idCliente = @idCliente	
			RETURN 
		END 


	IF @dataExists = '1'
		BEGIN
			SELECT TOP 1 idCliente,numeroIdentificacion,nombreFiscal,nombreComercial FROM dbo.Cliente WHERE idEntidad = @idEntidad AND numeroIdentificacion = @bySearch
			RETURN 
		END 
	
	IF Helper.IsNullOrEmpty(@bySearch) != 'SN'
		BEGIN
			SET @sql = @sql+'AND numeroIdentificacion+'' ''+nombreComercial+'' ''+nombreFiscal LIKE  ''%''+@bySearch+''%'' '
		END 

	SET @sql= @sql+'ORDER BY cl.idCliente DESC'
		
	EXEC sp_executesql 
				 @sql
				,@params 
				,@idEntidad = @idEntidad
				,@bySearch = @bySearch
				,@totalRecords = @totalRecords
	
END
GO
