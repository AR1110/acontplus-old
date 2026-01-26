USE Acontplus
GO
/****** Object:  StoredProcedure [App].[Usuario_Insert]    Script Date: 6/4/2023 20:45:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-03
-- Description:	Agregar Informacion a la tabla Usuario y la tabla Rol 
-- =============================================
CREATE OR ALTER PROCEDURE Config.UserCustomerRole_Insert @userRoleId INT
	,@json NVARCHAR(MAX)
	,@errorCode INT = 0 OUTPUT --0-OK, 1-ERROR
	,@errorMessage NVARCHAR(MAX) = '' OUTPUT
AS
BEGIN

	SET NOCOUNT ON;
	SET XACT_ABORT ON;

	SET LANGUAGE SPANISH;
	DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;
	DECLARE @Id INT
	,@UserCustomerId INT 
	,@RoleId INT 
	,@idEntidad INT
	,@ruc VARCHAR(20) 
	,@codRol VARCHAR(10) 

	DECLARE @companyUuid UNIQUEIDENTIFIER
	DECLARE @permisoModuloVenta VARCHAR(MAX) = '{"comprobante":{"fechaEmision":{"label":"Modificar Fecha de Emisi�n","enabled":false},"tiempoCredito":{"label":"Cambiar tiempo Credito","enabled":false},"tarifa":{"label":"Modifcar tarifa general","enabled":false},"porcentajeDescuento":{"label":"Cambiar Porcentaje Descuento","enabled":false},"descuento":{"label":"Cambiar Descuento","enabled":false}},"detail":{"medida":{"label":"Cambiar Medida","enabled":true},"tipoIva":{"label":"Cambiar Tipo IVA","enabled":true},"tarifa":{"label":"Cambiar tarifa","enabled":true},"precioUnitario":{"label":"Modificar Precio Unitario","enabled":true},"precioConIva":{"label":"Modificar Precio con IVA","enabled":true},"porcentajeDescuento":{"label":"Modificar Porcentaje Descuento","enabled":true},"descuento":{"label":"Modificar Descuento","enabled":true}},"additional":{"keyRequest":{"label":"Solicitar Autorizaci�n para Editar o Anular el Doc. Venta","enabled":false,"usersAdmin":[],"isKeyRequest":true},"viewOthersDocs":{"label":"Consultar documentos electronicos de otros usuarios","enabled":false},"kardex":{"label":"Ver Kardex","enabled":false},"totalesVenta":{"label":"Mostrar totales de ventas","enabled":false}}}'
	DECLARE @permisoModuloArticulo VARCHAR(MAX)= '{"precio":{"label":"Permitir actualizar el precio costo y venta","enabled":true},"gestionUbicacion":{"label":"Gesti�n Ubicaci�n","enabled":true}}' 
	DECLARE @permisoModuloCaja VARCHAR(MAX) = '{"verOtrasCajas":{"label":"Ver otras cajas","enabled":true},"reporteMovimientoCaja":{"label":"Ver Reporte","enabled":true},"cerrarCaja":{"label":"Cerrar Caja","enabled":true},"enterKey":{"label":"Ingresar Clave para las acciones de caja","enabled":true},"reporteTransaccionPendiente":{"label":"Reporte Transacci�n Pendiente", "enabled":true},"reporteDetalleControlCaja":{"label":"Reporte Detalle Control Caja","enabled":true}}'
	DECLARE @tbUserRole TABLE 
	(
		 UserCustomerId INT NOT NULL
		,RoleId  INT NOT NULL
		,companyUuid UNIQUEIDENTIFIER NOT NULL
		,fromMobile BIT
   )

	DECLARE @code CHAR(1),
		@message VARCHAR(MAX);

   	DECLARE @trancount BIT = 0;
	
	BEGIN TRY
	    
		------------------------------------ DATA JSON ----------------------------------------------------------------
		INSERT INTO @tbUserRole 
		      (UserCustomerId,RoleId,companyUuid, fromMobile)
		SELECT UserCustomerId,RoleId,companyUuid, fromMobile
		FROM OPENJSON(@json) WITH
		(
		     UserCustomerId  INT '$.userCustomerId'
			,RoleId          INT '$.roleId'
			,companyUuid     UNIQUEIDENTIFIER '$.companyUuid'
			,fromMobile BIT
	     ) as  js

		 --set @errorCode = 2
		 --select * from @tbUserRole return

		 ---------------------------------- VARIABLES ---------------------------------------------------------------------
		 SELECT TOP 1 @UserCustomerId = UserCustomerId ,@RoleId = RoleId ,@companyUuid = companyUuid FROM @tbUserRole
		
		 SELECT TOP 1 @ruc = ruc, @idEntidad = idEntidad FROM dbo.Entidad WITH (NOLOCK) WHERE Uuid = @companyUuid

		 SELECT TOP 1 @codRol = Code FROM Seguridad.[Role] WITH (NOLOCK) WHERE Id = @RoleId


		----------------------------------- VALIDATION --------------------------------------------------------------------
		IF EXISTS (SELECT 1 FROM App.UsuarioRol WITH (NOLOCK) WHERE idEntidad = @idEntidad AND idUsuario = @UserCustomerId AND roleId = @RoleId )
			BEGIN
				SELECT '50001' code, 'Esta rol ya esta asignado a este usuario' as message
                RETURN 
			END


		IF (@@TRANCOUNT = 0)
			BEGIN
				BEGIN TRANSACTION;
				SET @trancount = 1;
			END

			INSERT INTO App.UsuarioRol(idUsuario,idEntidad,roleId,fechaRegistro, fromMobile)
			SELECT @UserCustomerId,@idEntidad,@RoleId,GETDATE(), fromMobile FROM @tbUserRole 

			SET @Id = @@IDENTITY
			INSERT INTO Config.UserPermission(idUsuarioRol, codModule, jsonPermission, fechaRegistro)
			VALUES (@Id, 'V', @permisoModuloVenta, GETDATE()) 
			INSERT INTO Config.UserPermission(idUsuarioRol, codModule, jsonPermission, fechaRegistro)
			VALUES (@Id, 'AR', @permisoModuloArticulo, GETDATE()) 
			INSERT INTO Config.UserPermission(idUsuarioRol, codModule, jsonPermission, fechaRegistro)
			VALUES (@Id, 'C', @permisoModuloCaja, GETDATE()) 

		IF (@@ROWCOUNT > 0)
			BEGIN
				SET @code = '0';
				SET @message = 'Registrado Exitosamente';
			END
		ELSE
			BEGIN
				SET @code = '50001';
				SET @message = 'No se pudo registrar';
			END

	  IF (@trancount = 1)
		BEGIN
			COMMIT;
			SELECT @code as code, @message as 'message';
		 END
	END TRY 

	BEGIN CATCH
		IF (@trancount = 1)
			BEGIN
				IF (@@TRANCOUNT > 0)
					ROLLBACK TRAN;

				SET @ResponseTime = DATEDIFF_BIG(MILLISECOND, @StartTime, SYSUTCDATETIME());
                EXEC dbo.LogError
                    @ModuleName = 'CONFIG',
                    @BusinessProcess = 'USER_CUSTOMER_ROLE_INSERT',
                    @ErrorCategory = 'BUSINESS_RULE',
                    @ErrorSeverityLevel = 'HIGH',
                    @ResponseTime = @ResponseTime,
                    @EnvironmentName = 'PROD',
                    @BuildVersion = '3.0.0';

				SELECT '50001' code, 'Error en el procedimiento: ' as message;
				THROW;
			END
		ELSE
			BEGIN
				SET @errorCode = ERROR_NUMBER()
				SET @errorMessage = ERROR_MESSAGE()
			END
	END CATCH 
END
