USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Logistica].[GuiaRemision_Update]    Script Date: 2/2/2023 8:54:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE Logistica.GuiaRemision_Update @userRoleId INT ,@id INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT

    --> Data Json
    DECLARE @infoGuiaRemision VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX) 

    --> Facturacion Electronica
	DECLARE @ruc NVARCHAR(100) ,@fechaEmision DATETIME2 ,@ambiente INT ,@estab VARCHAR(5) ,@ptoEmi VARCHAR(5) ,@claveAcceso NVARCHAR(50) ,@secuencial INT
           ,@CustomerId INT ,@idEstadoServicio INT ,@idDocumentoElectronico INT

     --> Datos GuiaRemision
	DECLARE @idCliente INT ,@idPuntoEmision INT

    DECLARE @tbGuia AS TABLE(
        id INT NOT NULL UNIQUE
       ,idCliente INT NOT NULL
       ,idTransportista INT NOT NULL
       ,idVehiculo INT NOT NULL
       ,idEmpleado INT NULL
       ,idFactura INT NULL
       ,fechaEmision DATETIME2 NOT NULL
       ,fechaInicio DATETIME2 NOT NULL
       ,fechaFin DATETIME2 NOT NULL
       ,docAduanero VARCHAR(100) NULL
       ,ptoPartida VARCHAR(150) NOT NULL
       ,ptoLlegada VARCHAR(150) NOT NULL
       ,ruta VARCHAR(100) NULL
       ,estableDestino VARCHAR(5) NULL
       ,entregar VARCHAR(150) NULL
       ,motivo VARCHAR(300) NULL
    )

    DECLARE @tblDetails AS TABLE (
		 orderIndex INT NOT NULL
		,idGuiaRemisionDetalle INT NOT NULL
        ,idArticulo INT NOT NULL
		,cantidad NUMERIC (18,5) NOT NULL
		,descripcion VARCHAR(255) NOT NULL
        ,estado BIT NOT NULL
	)

    DECLARE @tblInfoAdicional AS TABLE (
		 nombre VARCHAR(300) NOT NULL
		,valor VARCHAR(300) NOT NULL
	)

	BEGIN TRY 
        --> Informacion General
        SELECT TOP 1 @idUsuario = idUsuario,@idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @infoGuiaRemision = infoGuiaRemision
              ,@detalles         = detalles
              ,@infoAdicional    = infoAdicional
        FROM OPENJSON(@json) WITH 
        (
             infoGuiaRemision NVARCHAR(MAX) as json
            ,detalles         NVARCHAR(MAX) as json 
            ,infoAdicional    NVARCHAR(MAX) as json
        )

        INSERT INTO @tbGuia 
               (id,idCliente,idTransportista,idVehiculo,idEmpleado,idFactura,fechaEmision,fechaInicio,fechaFin,docAduanero,ptoPartida,ptoLlegada,ruta,estableDestino,entregar,motivo)
        SELECT @id,idCliente,idTransportista,idVehiculo,idEmpleado,idFactura,fechaEmision,fechaInicio,fechaFin,docAduanero,ptoPartida,ptoLlegada,ruta,estableDestino,entregar,motivo
        FROM OPENJSON(@infoGuiaRemision) WITH 
        (
            idCliente       INT 
           ,idTransportista INT 
           ,idVehiculo      INT 
           ,idEmpleado      INT 
           ,idFactura       INT 
           ,fechaEmision    DATETIME2 
           ,fechaInicio     DATETIME2 
           ,fechaFin        DATETIME2 
           ,docAduanero     VARCHAR(100) 
           ,ptoPartida      VARCHAR(150) 
           ,ptoLlegada      VARCHAR(150) 
           ,ruta            VARCHAR(100) 
           ,estableDestino  VARCHAR(5) 
           ,entregar        VARCHAR(150)
           ,motivo          VARCHAR(300)
        )


        INSERT INTO @tblDetails
              (orderIndex,idGuiaRemisionDetalle,idArticulo,cantidad,descripcion,estado)
		SELECT orderIndex,idGuiaRemisionDetalle,idArticulo,cantidad,descripcion,estado 
		FROM OPENJSON (@detalles) WITH 
        (
		     orderIndex            INT 
		    ,idGuiaRemisionDetalle INT
            ,idArticulo            INT 
		    ,cantidad              NUMERIC(15,5) 
		    ,descripcion           VARCHAR(255)
            ,estado                BIT
		    
		)

        INSERT INTO @tblInfoAdicional 
              (nombre,valor) 
        SELECT nombre,valor 
        FROM OPENJSON(@infoAdicional) WITH 
        (
            nombre VARCHAR(300)
           ,valor VARCHAR(300)
        )
	    
        --> Recuperando Informacion en las variables
	    SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 1

	    SELECT TOP 1 @idTipoDocumento        = de.idTipoDocumento
		            ,@idDocumentoElectronico = de.idDocumentoElectronico
                    ,@secuencial             = de.nroDocumento
                    ,@idPuntoEmision         = de.idPuntoEmision
		            ,@estab                  = es.estab
		            ,@ptoEmi                 = pt.ptoEmi
		            ,@ambiente               = pt.ambiente
	    FROM dbo.GuiaRemision               gr WITH (NOLOCK)
        INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = gr.idDocumentoElectronico
	    INNER JOIN dbo.PuntoEmision         pt WITH (NOLOCK) ON pt.idPuntoEmision         = de.idPuntoEmision
	    INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pt.idEstablecimiento	
	    WHERE gr.idGuiaRemision = @id 

	    SELECT TOP 1 @idCliente = idCliente ,@fechaEmision = fechaEmision FROM @tbGuia

        SELECT TOP 1 @CustomerId = ISNULL(CustomerId,0) FROM dbo.Cliente WITH (NOLOCK) WHERE idCliente = @idCliente

	    SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab)
												       ,'06'
												       ,CAST(@ambiente as nvarchar)
												       ,'1'
												       ,dbo.AFTConvertDate(@fechaEmision)
												       ,@ruc
												       ,@estab+@ptoEmi
												       ,dbo.AFTAutoComplete(@secuencial))

	
	    --> Validacion de informacion
         IF NOT EXISTS(SELECT 1 FROM @tbGuia) 
            BEGIN
                SELECT '0'code,'Error en la info GuiaRemision'[message]
				RETURN
            END 

        IF NOT EXISTS(SELECT 1 FROM @tblDetails) 
            BEGIN
                SELECT '0'code,'Error en los detalles'[message]
				RETURN
            END

        IF EXISTS (SELECT 1 FROM [FactElect].[v_DocElectronico] WITH (NOLOCK) WHERE codDoc = '06' AND idDocumentoElectronico = @idDocumentoElectronico AND codEstado IN (4,3,6,8))
            BEGIN
                SELECT '0'code,'El Documento tiene un proceso en el Sri'[message]
                RETURN 
            END

        IF EXISTS (SELECT 1 FROM [FactElect].[v_DocElectronico] WITH (NOLOCK) WHERE codDoc = '06' AND idDocumentoElectronico != @idDocumentoElectronico AND claveAcceso = @claveAcceso)
            BEGIN
                SELECT '0'code, 'Esta clave de Acceso ya existe'[message]
                RETURN 
            END

		BEGIN TRAN 
            --> infoTributaria
            UPDATE dbo.DocumentoElectronico WITH (ROWLOCK) SET
				   claveAcceso      = @claveAcceso
				  ,fechaEmision     = @fechaEmision
				  ,CustomerId       = @CustomerId
				  ,idEstadoServicio = @idEstadoServicio
			WHERE idDocumentoElectronico = @idDocumentoElectronico
            

            --> InfoGuiaRemision
			UPDATE gr SET 
				   gr.idCliente       = jgr.idCliente
				  ,gr.idTransportista = jgr.idTransportista
				  ,gr.idVehiculo      = jgr.idVehiculo
				  ,gr.idEmpleado      = jgr.idEmpleado
				  ,gr.fechaInicio     = jgr.fechaInicio
				  ,gr.fechaFin        = jgr.fechaFin
				  ,gr.docAduanero     = jgr.docAduanero
				  ,gr.ptoPartida      = jgr.ptoPartida
				  ,gr.ptoLlegada      = jgr.ptoLlegada
				  ,gr.ruta            = jgr.ruta
				  ,gr.estableDestino  = jgr.estableDestino
				  ,gr.entregar        = jgr.entregar
				  ,gr.motivo          = jgr.motivo
                  ,gr.lastChange      = GETDATE()
			FROM GuiaRemision   gr WITH (ROWLOCK)
			INNER JOIN @tbGuia jgr ON gr.idGuiaRemision = jgr.id 

            --> Detalles
			UPDATE grd SET 
				   grd.cantidad    = jgr.cantidad
			      ,grd.descripcion = jgr.descripcion
			      ,grd.estado      = jgr.estado
			FROM GuiaRemisionDetalle grd WITH (ROWLOCK)
			INNER JOIN @tblDetails   jgr ON grd.idGuiaRemisionDetalle = jgr.idGuiaRemisionDetalle

            INSERT INTO GuiaRemisionDetalle WITH (ROWLOCK)
                   (idGuiaRemision,idArticulo,cantidad,descripcion)
	        SELECT @id            ,idArticulo,cantidad,descripcion FROM	@tblDetails
			WHERE idGuiaRemisionDetalle = 0
            ORDER BY orderIndex ASC

			--> informacion Adicional
			UPDATE dbo.InfoAdicionalDoc WITH (ROWLOCK) SET estado = 0 WHERE idComprobante = @id AND idTipoDocumento = @idTipoDocumento

			INSERT INTO dbo.InfoAdicionalDoc 
                   (idComprobante,idTipoDocumento,nombre,valor) 
            SELECT @id          ,@idTipoDocumento,nombre,valor 
            FROM @tblInfoAdicional
			
		COMMIT TRAN 
        SELECT  '1'code,'Actualizado Correctamente'[message]
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END
		
        INSERT INTO ErroresSistema WITH (ROWLOCK)
		    (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/GuiaRemision/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT  '0'code,'Info: Error en el procedimiento'[message]
	END CATCH 

END
