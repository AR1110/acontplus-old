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
	DECLARE @byEntidad INT =  (SELECT idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId)
		   ,@checkBoxFecha BIT 
		   ,@checkBoxDocumento BIT 
		   ,@fechaInicio DATETIME 
		   ,@fechaFin DATETIME
		   ,@byPersona NVARCHAR(100)
		   ,@byUsuario INT
		   ,@byTipoDocumento INT
		   ,@byComprobante INT
		   ,@byEstado INT 
           ,@tipo INT
		   ,@params NVARCHAR(MAX) = '@idEntidad INT
									,@fechaI DATETIME
									,@fechaF DATETIME
									,@nroIdentificacion NVARCHAR(100)
									,@idTipoDocumento INT
									,@idComprobante INT
									,@estado INT
									,@idUsuario INT'
		    
			,@sql NVARCHAR(MAX) = 'SELECT TOP 10
										 idComprobanteEgreso = ce.idComprobanteEgreso
										,total = ce.total
										,fechaRegistro = dbo.AFTConvertDate(ce.fechaRegistro)+''''+ dbo.AFTConvertHora(ce.fechaRegistro) 
										,nroDoc = td.codigo+''-''+s.estab+''-''+dbo.AFTAutoComplete(ce.nroDocumento)  
										,persona = UPPER(ce.nombreFiscal) 
										,nroIdentificacion = ce.nroIdentificacion 
										,caja = ''Ninguna''
										,color = CASE WHEN ce.estado = 0 THEN ''table-danger'' ELSE '''' END
										,estado = CASE WHEN ce.estado = 0 THEN ''Anulado'' ELSE ''Activo'' END
										,usuario = u.nombreUsuario
								   FROM dbo.ComprobanteEgreso    ce WITH (NOLOCK) 
								   INNER JOIN dbo.TipoPersona    tp WITH (NOLOCK) ON tp.idTipoPersona   = ce.idTipoPersona 
								   INNER JOIN Sri.Establecimiento s WITH (NOLOCK) ON s.codEstab         = ce.codEstab
								   INNER JOIN dbo.TipoDocumento  td WITH (NOLOCK) ON td.idTipoDocumento = ce.idTipoDocumento 
								   INNER JOIN dbo.Usuario u ON u.idUsuario = ce.idUsuario
								   WHERE ce.idEntidad = @idEntidad '
		

        SELECT @tipo = tipo FROM OPENJSON(@json) WITH(tipo INT)

        IF @tipo = 1
            BEGIN 

			    SELECT 
				     @checkBoxDocumento = checkBoxDocumento 
				    ,@checkBoxFecha = checkBoxFecha 
				    ,@byComprobante = byComprobante
				    ,@byUsuario = byUsuario
				    ,@byPersona = byPersona
				    ,@byTipoDocumento = byTipoDocumento
				    ,@byEstado = byEstado
				    ,@fechaFin = fechaFin
				    ,@fechaInicio = fechaInicio
			    FROM OPENJSON(@json)
			    WITH (checkBoxFecha BIT '$.checkBoxFecha' 
				     ,checkBoxDocumento BIT '$.checkBoxDocumento'
				     ,checkBoxUsuario BIT '$.checkBoxUsuario'
				     ,fechaInicio DATETIME2 '$.fechaInicio'
				     ,fechaFin DATETIME2 '$.fechaFin'
				     ,byPersona NVARCHAR(100) '$.byPersona'
				     ,byTipoDocumento INT '$.byTipoDocumento'
				     ,byComprobante INT '$.byComprobante'
				     ,byUsuario INT '$.byUsuario'
				     ,byEstado INT '$.byEstado')
 
		        IF @checkBoxDocumento = 1
			        BEGIN
				        SET @sql = @sql+'AND ce.idComprobanteEgreso IN (SELECT pd.idComprobanteEgreso FROM PagoDocumento pd WHERE pd.idTipoDocumento = @idTipoDocumento AND pd.idComprobante = @idComprobante) '
			        END 

		        IF @byEstado IS NOT NULL
			        BEGIN
				        SET @sql = @sql+'AND ce.estado = @estado '
			        END 

		        IF @checkBoxFecha = 1
			        BEGIN
				        SET @sql = @sql+'AND CAST(ce.fechaRegistro as date) BETWEEN CAST(@fechaI as date) AND CAST(@fechaF as date) '
			        END 
			
		        IF @byPersona IS NOT NULL
			        BEGIN
				        SET @sql = @sql + ' AND ce.nroIdentificacion = @nroIdentificacion '
			        END 

		        IF @byUsuario IS NOT NULL
			        BEGIN
				        SET @sql = @sql + ' AND ce.idUsuario = @idUsuario '
			        END 

		        SET @sql = @sql+'ORDER BY ce.idComprobanteEgreso DESC'

                SET @tableNames = 'comprobantesEgreso'
		        EXEC sp_executesql 
			              @sql
			             ,@params
				         ,@idEntidad = @byEntidad
				         ,@fechaI = @fechaInicio
				         ,@fechaF = @fechaFin
				         ,@nroIdentificacion = @byPersona
				         ,@idTipoDocumento = @byTipoDocumento
				         ,@idComprobante = @byComprobante
				         ,@estado = @byEstado
				         ,@idUsuario = @byUsuario 

         END
        
        IF @tipo = 2
            BEGIN 
                SET @tableNames = 'estabs'
                 SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,ptoEmi + '-' + estab as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC
            END 


END
