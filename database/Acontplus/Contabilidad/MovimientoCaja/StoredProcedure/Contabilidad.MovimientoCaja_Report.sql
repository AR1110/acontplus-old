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
CREATE OR ALTER PROCEDURE Contabilidad.MovimientoCaja_Report 
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
	DECLARE @params nvarchar(MAX) ,@sql nvarchar(MAX) 

    --> Filters
	DECLARE @tipoDoc VARCHAR(5) 
	       ,@idCliente INT 
	       ,@idEmpleado INT
	       ,@idUsuario INT
	       ,@fechaInicio DATETIME2
	       ,@fechaFin DATETIME2
           ,@nroIdentificacion VARCHAR(50)
           ,@id INT

    --> Recuperar Varialbes
	SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT) 


    --> Reporte por Documento
    IF @tipo = 1
        BEGIN
            
            SET @tableNames = 'mainDs'

            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT en.razonSocial
                  ,es.nombreComercial
                  ,FORMAT(mc.fechaEmision,'dd/MM/yyyy HH:mm')                                              as fechaHora
                  ,td.codigo + '-' + es.estab + '-' + RIGHT('000000000' + CAST(mc.nroDoc AS VARCHAR(9)),9) as nroDocumento 
                  ,IIF(td.codigo='IC', 'Recib. por: ', 'Entrg. por: ')                                     as labelEmpleado
                  ,CASE td.codigo WHEN 'EC' THEN se.BusinessName
								  WHEN 'IC' THEN si.BusinessName
			       END																                       as empleado
                  ,UPPER(ef.descripcion)                                                                   as entidadFinanciera
                  ,CAST(mc.valor as numeric(18,2))                                                         as valor
                  ,ISNULL(mc.observaciones,'')				                                               as observacion
                  ,us.nombreUsuario                                                                        as usuario
			FROM dbo.MovimientoCaja             mc WITH (NOLOCK) 
			INNER JOIN dbo.Caja                 ca WITH (NOLOCK) ON ca.idCaja                 = mc.idCaja
			INNER JOIN dbo.TipoDocumento        td WITH (NOLOCK) ON td.idTipoDocumento        = mc.idTipoDocumento
			INNER JOIN dbo.SubEntidadFinanciera ef WITH (NOLOCK) ON ef.idSubEntidadFinanciera = mc.idSubEntidadFinanciera								
			INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = mc.idEstablecimiento
			INNER JOIN dbo.Usuario              us WITH (NOLOCK) ON us.idUsuario              = mc.idUsuarioRegister
            INNER JOIN dbo.Entidad              en WITH (NOLOCK) ON en.idEntidad              = mc.idEntidad
             LEFT JOIN dbo.ComprobanteIngreso   ci WITH (NOLOCK) ON ci.idComprobanteIngreso   = mc.idComprobanteIngreso
		     LEFT JOIN dbo.ComprobanteEgreso    ce WITH (NOLOCK) ON ce.idComprobanteEgreso    = mc.idComprobanteEgreso
		     LEFT JOIN Customer.Customer        si WITH (NOLOCK) ON si.Id					  = ci.CustomerId
		     LEFT JOIN Customer.Customer	    se WITH (NOLOCK) ON se.Id					  = ce.CustomerId
            WHERE mc.idMovimientoCaja = @id

            RETURN 
        END 

    --> Reporte General de Movimiento
    IF @tipo = 2
        BEGIN 
            
            SET @tableNames = 'headerDs,detailDs'

            SELECT @tipoDoc     = tipoDoc
	              ,@fechaInicio = fechaInicio
		          ,@fechaFin    = fechaFin
                  ,@idEmpleado  = idEmpleado 
                  ,@idCliente   = idCliente
                  ,@idUsuario   = idUsuario
	        FROM OPENJSON(@json) WITH 
            (
                  tipoDoc     VARCHAR(10) 
		         ,fechaInicio DATETIME2 
		         ,fechaFin    DATETIME2 
		         ,idUsuario   INT 
		         ,idEmpleado  INT 
		         ,idCliente   INT 
	        )

            SET @params = '@tipoDoc           VARCHAR(5)
	                      ,@nroIdentificacion VARCHAR(50) 
				          ,@idUsuario         INT
                          ,@fechaInicio       DATETIME2
                          ,@fechaFin          DATETIME2'

            SET @sql = 'SELECT * FROM 
			            (
				
				            SELECT an.idUsarioRegister												      as idUsuario
					              ,an.idSubEntidadFinanciera										      as idSubEntidadFinanciera
					              ,es.codEstab
					              ,cu.BusinessName													      as clienteEmpleado
					              ,cu.IDCard														      as nroIdentificacion
					              ,''A'' + ''-'' + es.estab + ''-'' + Helper.F_Auto_Sequential(an.nroDoc) as serieComprobante
					              ,''A''															      as tipoDoc
					              ,FORMAT(an.fechaEmision,''dd/MM/yyyy HH:mm'')					          as fechaEmision
					              ,an.valor
					              ,an.observaciones
				            FROM dbo.Anticipo                 an WITH (NOLOCK) 
				            INNER JOIN dbo.ComprobanteIngreso ci WITH (NOLOCK) ON ci.idComprobanteIngreso = an.idComprobanteIngreso
				            INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.idEstablecimiento    = ci.idEstablecimiento
				            INNER JOIN Customer.Customer      cu WITH (NOLOCK) ON cu.Id                   = ci.CustomerId
				            WHERE an.idEntidad = @idEntidad
                              AND CAST(an.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date)

				            UNION ALL

				            SELECT mc.idUsuarioRegister
					              ,mc.idSubEntidadFinanciera									
					              ,es.codEstab
					              ,CASE td.codigo WHEN ''EC'' THEN se.BusinessName
									              WHEN ''IC'' THEN si.BusinessName
					              END																     as clienteEmpleado
					              ,CASE td.codigo WHEN ''EC'' THEN se.IDCard
									              WHEN ''IC'' THEN si.IDCard
					              END																     as nroIdentificacion
					              ,td.codigo + ''-'' + es.estab + ''-'' + dbo.AFTAutoComplete(mc.nroDoc) as serieComprobante 
					              ,td.codigo
					              ,FORMAT(mc.fechaEmision,''dd/MM/yyyy HH:mm'')                          as fechaEmision
					              ,mc.valor * IIF(td.codigo = ''EC'',-1,1)                               as valor
					              ,ISNULL(mc.observaciones,'''')				                         as observaciones
				            FROM dbo.MovimientoCaja              mc WITH (NOLOCK) 
				            INNER JOIN dbo.Caja                  ca WITH (NOLOCK) ON ca.idCaja                 = mc.idCaja
				            INNER JOIN dbo.TipoDocumento         td WITH (NOLOCK) ON td.idTipoDocumento        = mc.idTipoDocumento
				            INNER JOIN dbo.SubEntidadFinanciera  ef WITH (NOLOCK) ON ef.idSubEntidadFinanciera = mc.idSubEntidadFinanciera								
				            INNER JOIN Sri.Establecimiento       es WITH (NOLOCK) ON es.idEstablecimiento      = mc.idEstablecimiento
				            INNER JOIN dbo.Usuario               us WITH (NOLOCK) ON us.idUsuario              = mc.idUsuarioRegister
					         LEFT JOIN dbo.ComprobanteIngreso    ci WITH (NOLOCK) ON ci.idComprobanteIngreso   = mc.idComprobanteIngreso
					         LEFT JOIN dbo.ComprobanteEgreso     ce WITH (NOLOCK) ON ce.idComprobanteEgreso    = mc.idComprobanteEgreso
					         LEFT JOIN Customer.Customer         si WITH (NOLOCK) ON si.Id					   = ci.CustomerId
					         LEFT JOIN Customer.Customer		 se WITH (NOLOCK) ON se.Id					   = ce.CustomerId
				            WHERE mc.idEntidad = @idEntidad
                              AND CAST(mc.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date)
				
			        ) AS tb
                    WHERE tb.clienteEmpleado IS NOT NULL '

            IF @tipoDoc = 'MC'
		        BEGIN
			        SET @sql = @sql + 'AND tb.tipoDoc IN (''EC'',''IC'') '
		        END
	        ELSE 
		        BEGIN
			        SET @sql = @sql + 'AND tb.tipoDoc = ''A'' '
		        END 

	        IF @idCliente > 0
		        BEGIN
                    SELECT TOP 1 @nroIdentificacion = numeroIdentificacion FROM dbo.Cliente WITH (NOLOCK) WHERE idCliente = @idCliente

			        SET @sql = @sql + 'AND tb.nroIdentificacion = @nroIdentificacion '
		        END 

	        IF @idEmpleado > 0
		        BEGIN
                    SELECT TOP 1 @nroIdentificacion = nroIdentificacion FROM dbo.Empleado WITH (NOLOCK) WHERE idEmpleado = @idEmpleado

			        SET @sql = @sql + 'AND tb.nroIdentificacion = @nroIdentificacion '
		        END 

	        IF @idUsuario > 0
		        BEGIN
			        SET @sql = @sql + 'AND tb.idUsuario = @idUsuario '
		        END
     
	        SET @sql = @sql + 'ORDER BY tb.fechaEmision DESC '

            --Entidad 
	        SELECT e.ruc
		          ,e.razonSocial 
		          ,e.nombreComercial	
		          ,ISNULL(e.telefono, '')                                                               as telefonoEntidad
		          ,ISNULL(e.direccion, '')                                                              as direccionEntidad			
		          ,CASE WHEN @tipoDoc = 'MC' THEN 'Movimientos de Caja' ELSE 'Anticipo de Clientes' END as tituloReporte
		          ,FORMAT(@fechaInicio, 'dd/MM/yyyy') +' - ' +  FORMAT(@fechaFin, 'dd/MM/yyyy')         as filtroFecha	
		          ,CASE WHEN @tipoDoc = 'MC' THEN 'Responsable' ELSE 'Cliente' END                      as nameColumn
	        FROM Entidad e WITH (NOLOCK)
	        WHERE e.idEntidad = @idEntidad 

	        EXECUTE sp_Executesql @sql
	                             ,@params
						         ,@tipoDoc           = @tipoDoc
						         ,@idUsuario         = @idUsuario
                                 ,@nroIdentificacion = @nroIdentificacion
                                 ,@fechaInicio       = @fechaInicio
                                 ,@fechaFin          = @fechaFin
            RETURN 
        END 
END
GO
