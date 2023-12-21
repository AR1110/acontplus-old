USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Cliente_Insert]    Script Date: 04/14/2023 3:07:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-08-02 
-- Description:	SP para registrar clientes 
-- =============================================
ALTER PROCEDURE [Ventas].[Cliente_Insert] @idUsuarioRol INT,@json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE  @idUsuario INT
			,@idEntidad INT
	        ,@idCliente INT
			--variables para el registro de clientes
			,@idEmpleado INT 
			,@idTipoIdentificacion INT 
			,@idTipoClienteProveedor INT 
			,@idTipoEntidad INT 
			,@idCiudad INT 
			,@idSubContribuyente INT 
			,@idTiempoCredito INT 
			,@idEmpresa INT
			,@idCargo INT
			,@numeroIdentificacion NVARCHAR(15)
			,@nombreFiscal NVARCHAR(100)
			,@nombreComercial NVARCHAR(100)
			,@direccion NVARCHAR (100)
			,@telefono NVARCHAR(300)
			,@correo NVARCHAR(90)
			,@placa NVARCHAR(255)
			,@montoCredito DECIMAL(10,5)
			,@nota NVARCHAR(300)
			,@validationSri BIT
			,@IDType VARCHAR(2)
			,@customerId INT
	
	SELECT  @idEntidad = idEntidad ,@idUsuario = idUsuario  FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol


	SELECT @idEmpleado             = IIF(idEmpleado = 0,NULL,idEmpleado) 
		  ,@idTipoIdentificacion   = IIF(idTipoIdentificacion = 0,NULL,idTipoIdentificacion)
		  ,@idTipoClienteProveedor = IIF(idTipoClienteProveedor = 0,NULL,idTipoClienteProveedor)
		  ,@idTipoEntidad          = IIF(idTipoEntidad = 0,NULL,idTipoEntidad)
		  ,@idCiudad               = IIF(idCiudad = 0,NULL,idCiudad)
		  ,@idSubContribuyente     = IIF(idSubContribuyente = 0,NULL,idSubContribuyente)
		  ,@idTiempoCredito        = IIF(idTiempoCredito = 0,NULL,idTiempoCredito)
		  ,@idEmpresa              = IIF(idEmpresa = 0,NULL,idEmpresa)
		  ,@idCargo                = IIF(idCargo = 0,NULL,idCargo)
		  ,@numeroIdentificacion   = numeroIdentificacion
		  ,@nombreFiscal           = nombreFiscal
		  ,@nombreComercial        = nombreComercial
		  ,@direccion              = direccion
		  ,@telefono               = telefono
		  ,@correo                 = correo
		  ,@placa                  = placa
		  ,@nota                   = nota
		  ,@montoCredito           = ISNULL(montoCredito,0)
		  ,@validationSri          = validationSri
	FROM OPENJSON(@json)
	WITH(idEmpleado                    INT '$.idEmpleado'
	    ,idTipoIdentificacion          INT '$.idTipoIdentificacion'
	    ,idTipoClienteProveedor        INT '$.idTipoClienteProveedor'
	    ,idTipoEntidad                 INT '$.idTipoEntidad'
	    ,idCiudad                      INT '$.idCiudad'
	    ,idSubContribuyente            INT '$.idSubContribuyente'
	    ,idTiempoCredito               INT '$.idTiempoCredito'
	    ,idEmpresa                     INT '$.idEmpresa'
	    ,idCargo				       INT '$.idCargo'
		,numeroIdentificacion  VARCHAR(50) '$.numeroIdentificacion'
		,nombreFiscal         VARCHAR(100) '$.nombreFiscal'
		,nombreComercial      VARCHAR(100) '$.nombreComercial'
		,direccion            VARCHAR(200) '$.direccion'
		,telefono             VARCHAR(150) '$.telefono'
		,correo               VARCHAR(200) '$.correo'
		,placa                VARCHAR(150) '$.placa'
		,montoCredito        DECIMAL(15,5) '$.montoCredito'
		,nota                 VARCHAR(300) '$.nota'
		,validationSri                 BIT '$.validationSri')

	IF EXISTS (SELECT 1 FROM Cliente WITH (NOLOCK) WHERE numeroIdentificacion = @numeroIdentificacion AND idEntidad = @idEntidad)
		BEGIN
			SELECT '0'code,'Este cliente ya se encuentra registrado' as 'message'
			RETURN 
		END 

	BEGIN TRY 
		BEGIN TRAN
			IF NOT EXISTS(SELECT 1 FROM Customer.Customer WHERE IDCard = LTRIM(RTRIM(@numeroIdentificacion)))
				BEGIN
					SET @IDType = (SELECT codigoSri FROM TipoIdentificacion t WHERE t.idTipoIdentificacion = @idTipoIdentificacion)

					INSERT INTO Customer.Customer(IDType, IDCard, BusinessName, TradeName, email, telephone, [Address], SriValidation)
					SELECT @IDType, LTRIM(RTRIM(@numeroIdentificacion)), LTRIM(RTRIM(@nombreFiscal)), LTRIM(RTRIM(@nombreComercial)),  LTRIM(RTRIM(@correo)), LTRIM(RTRIM(@telefono)), LTRIM(RTRIM(@direccion)), @validationSri
					SET @customerId = @@IDENTITY
				END
			ELSE
				BEGIN 
					SET @customerId = (SELECT ID FROM Customer.Customer WHERE IDCard = LTRIM(RTRIM(@numeroIdentificacion)))
				END
			
			INSERT INTO Cliente 
			        (idTipoIdentificacion
					,idEmpleado
					,idTipoClienteProveedor
					,idTipoEntidad
					,idCiudad
					,idSubContribuyente
					,idTiempoCredito
					,idEmpresa
					,idCargo
					,idUsuario
					,idEntidad
					,numeroIdentificacion
					,nombreFiscal
					,nombreComercial
					,direccion
					,telefono
					,correo
					,placa
					,montoCredito
					,nota
					,validationSri)

			VALUES  (@idTipoIdentificacion
					,@idEmpleado
					,@idTipoClienteProveedor
					,@idTipoEntidad
					,@idCiudad
					,@idSubContribuyente
					,@idTiempoCredito
					,@idEmpresa
					,@idCargo
					,@idUsuario
					,@idEntidad
					,@numeroIdentificacion
					,@nombreFiscal
					,@nombreComercial
					,@direccion
					,@telefono
					,CASE WHEN LEN(@correo) > 7 THEN @correo ELSE NULL END 
					,@placa
					,@montoCredito
					,@nota
					,@validationSri)

		SET @idCliente = @@IDENTITY;


		UPDATE Cliente  SET customerId = @customerId WHERE idCliente = @idCliente

		COMMIT TRAN 
			SELECT '1'code, 'Registrado Correctamente' as 'message',payload =  @idCliente
			RETURN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN ;
		END 
		SELECT '0'code,'Info: Error en el procedimiento: '+ERROR_MESSAGE() as 'message'
		INSERT INTO ErroresSistema
								   (token
								   ,method
								   ,errorNumber
								   ,errorSeverity 
								   ,errorState
								   ,errorProcedure
								   ,errorLine
								   ,errorMessage
								   ,errorDate
								   ,idUsuario)
							VALUES
									(NEWID()
									,'/ClienteDao/CreateClienteAsync'
									,ERROR_NUMBER()
									,ERROR_SEVERITY()
									,ERROR_STATE()
									,ERROR_PROCEDURE()
									,ERROR_LINE()
									,ERROR_MESSAGE()
									,GETDATE() 
									,@idUsuario)
	END CATCH 
END
