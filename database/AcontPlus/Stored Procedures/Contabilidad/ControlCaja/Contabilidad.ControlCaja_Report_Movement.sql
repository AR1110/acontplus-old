USE [AcontPlus]
GO 
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Contabilidad.ControlCaja_Report_Movement', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.ControlCaja_Report_Movement
GO
CREATE PROCEDURE Contabilidad.ControlCaja_Report_Movement @idRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF (OBJECT_ID(N'tempdb..#tableDocument') IS NOT NULL)
		BEGIN
		  DROP TABLE #tableDocument;
		END

	DECLARE @idEntidad INT
	DECLARE @tipoDoc VARCHAR(5)
	DECLARE @checkBoxCliente BIT 
	DECLARE @checkBoxEmpleado BIT 
	DECLARE @checkBoxUsuario BIT
	DECLARE @idCliente INT 
	DECLARE @idEmpleado INT
	DECLARE @idUsuario INT
	DECLARE @fechaInicio DATETIME 
	DECLARE @fechaFin DATETIME
	DECLARE @params NVARCHAR(MAX)
	DECLARE @sql NVARCHAR(MAX)

	CREATE TABLE #tableDocument(
		 idUsuario INT NOT NULL
		,idSubEntidadFinanciera INT NULL
		,idCliente INT NULL
		,idEmpleado INT NULL
		,codEstab VARCHAR(50) NOT NULL
		,clienteEmpleado VARCHAR(150)
		,serieComprobante VARCHAR(50) NOT NULL
		,tipoDoc VARCHAR(5) NOT NULL
		,fechaEmision DATETIME NOT NULL
		,valor NUMERIC(18,2) NOT NULL
		,observaciones VARCHAR(300) NULL
    )

	SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT @checkBoxCliente  = checkBoxCliente
	      ,@checkBoxEmpleado = checkBoxEmpleado
		  ,@checkBoxUsuario  = checkBoxUsuario
	      ,@tipoDoc          = tipoDoc
	      ,@fechaInicio      = CONVERT(datetime,fechaInicio,121)
		  ,@fechaFin         = CONVERT(datetime,fechaFin,121)
	FROM OPENJSON(@json) 
	WITH (tipoDoc      VARCHAR(10) '$.tipoDoc'
	     ,checkBoxCliente      BIT '$.checkBoxCliente'
		 ,checkBoxEmpleado     BIT '$.checkBoxEmpleado'
		 ,checkBoxUsuario      BIT '$.checkBoxUsuario'
		 ,fechaInicio VARCHAR(100) '$.fechaInicio'
		 ,fechaFin    VARCHAR(100) '$.fechaFin'
		 ,idUsuario            INT '$.idUsuario'
		 ,idEmpleado           INT '$.idEmpleado'
		 ,idCliente            INT '$.idCliente'
		 
	)

	INSERT INTO #tableDocument (idUsuario,idSubEntidadFinanciera,idCliente,codEstab,clienteEmpleado,serieComprobante,tipoDoc,fechaEmision,valor,observaciones)
	SELECT an.idUsarioRegister
	      ,an.idSubEntidadFinanciera 
		  ,an.idCliente
		  ,an.codEstab
		  ,cl.nombreFiscal
		  ,td.codigo + '-' + es.estab + '-' + Helper.F_Auto_Sequential(an.nroDoc)
		  ,td.codigo
		  ,an.fechaEmision
		  ,an.valor
		  ,an.observaciones
	FROM dbo.Anticipo              an WITH (NOLOCK) 
	INNER JOIN dbo.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento = an.idTipoDocumento
	INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente       = an.idCliente
	INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab        = an.codEstab
	WHERE an.idEntidad = @idEntidad 
	  --AND CAST(an.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date)
	
	INSERT INTO #tableDocument (idUsuario,idSubEntidadFinanciera,idEmpleado,codEstab,clienteEmpleado,serieComprobante,tipoDoc,fechaEmision,valor,observaciones)
	SELECT mc.idUsuarioRegister
	      ,mc.idSubEntidadFinanciera
		  ,mc.idEmpleado
		  ,mc.codEstab
          ,em.nombreCompleto
		  ,td.codigo + '-' + es.estab + '-' + Helper.F_Auto_Sequential(mc.nroDoc)
		  ,td.codigo
		  ,mc.fechaEmision
		  ,mc.valor
		  ,mc.observaciones
	FROM dbo.MovimientoCaja        mc WITH (NOLOCK)
	INNER JOIN dbo.Empleado        em WITH (NOLOCK) ON em.idEmpleado = mc.idEmpleado
	INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab   = mc.codEstab
	INNER JOIN dbo.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento = mc.idTipoDocumento
	WHERE mc.idEntidad = @idEntidad
	  --AND CAST(mc.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date)
	
	SET @params = '@tipoDoc AS VARCHAR(5)
	              ,@idCliente AS INT 
				  ,@idEmpleado AS INT 
				  ,@idUsuario AS INT'

	SET @sql = 'SELECT fechaEmison = FORMAT(tb.fechaEmision, ''dd/MM/yyyy HH:mm'')
					  ,tb.serieComprobante
					  ,tb.clienteEmpleado
					  ,tb.valor
					  ,entidadFinanciera = sf.descripcion
					  ,tb.observaciones
					  ,usuario = us.nombreUsuario
				FROM #tableDocument                 tb WITH (NOLOCK)
				INNER JOIN dbo.Usuario              us WITH (NOLOCK) ON us.idUsuario              = tb.idUsuario
				INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = tb.idSubEntidadFinanciera
				WHERE tb.tipoDoc = @tipoDoc '
	
	IF @checkBoxCliente = 1
		BEGIN
			SET @sql = @sql + 'AND tb.idCliente = @idCliente '
		END 

	IF @checkBoxEmpleado = 1
		BEGIN
			SET @sql = @sql + 'AND tb.idEmpleado = @idEmpleado '
		END 

	IF @checkBoxUsuario = 1
		BEGIN
			SET @sql = @sql + 'AND tb.idUsuario = @idUsuario '
		END
     
	 SET @sql = @sql + 'ORDER BY tb.fechaEmision DESC'

	 --Entidad 
	 SELECT e.ruc
		   ,e.razonSocial 
		   ,e.nombreComercial	
		   ,ISNULL(e.telefono, '')telefonoEntidad
		   ,ISNULL(e.direccion, '')direccionEntidad			
		   ,tituloReporte = 'Gestión del Control de Caja'
		   ,CONVERT(NVARCHAR,FORMAT(@fechaInicio, 'dd/MM/yyyy') +' - ' +  FORMAT(@fechaFin, 'dd/MM/yyyy')) as filtroFecha			
	 FROM Entidad e WITH (NOLOCK)
	 WHERE e.idEntidad = @idEntidad 

	 EXECUTE sp_Executesql @sql
	                      ,@params
						  ,@tipoDoc    = @tipoDoc
						  ,@idCliente  = @idCliente
						  ,@idEmpleado = @idEmpleado
						  ,@idUsuario  = @idUsuario

END
GO
