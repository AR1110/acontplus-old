USE Acontplus
GO
/****** Object:  StoredProcedure [App].[aspEntidad_Insert]    Script Date: 10/7/2022 11:49:46 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-04
-- Description:	Proceso Almacenado para registrar las entidades
-- =============================================
CREATE OR ALTER PROCEDURE Config.Company_Insert @UserRoleId INT 
	,@Json VARCHAR(MAX)
	,@ErrorCode INT = 0 OUT
	,@ErrorMessage NVARCHAR(MAX) = '' OUT
AS
BEGIN
	
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	SET XACT_ABORT ON;
	
	DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;
	
	DECLARE @Id INT, @IdCard VARCHAR(15),@JsonConfigVentas VARCHAR(MAX) ,@Count INT = 0
	DECLARE @JsonConfigDecimales VARCHAR(MAX) ,@JsonConfigNotificaciones VARCHAR(MAX) ,@JsonConfigMora VARCHAR(MAX)
	DECLARE @TableValue TABLE 
	(
		 Tarifa nvarchar(100) 
		,Codigo nvarchar(100) 
		,Predeterminada bit 
	)
	
	DECLARE @TbConfig AS TABLE (
		 IdEntidad INT NOT NULL
		,CodConfig VARCHAR(5) UNIQUE NOT NULL
		,JsonConfig VARCHAR(MAX) NOT NULL
	)

	DECLARE @TbCompany AS TABLE(
		[IdCard] VARCHAR(15) NOT NULL
	   ,[Uuid] UNIQUEIDENTIFIER NOT NULL
	   ,[BusinessName] VARCHAR(300) NOT NULL
	   ,[TradeName] VARCHAR(300) NOT NULL
	   ,[Email] VARCHAR(300)
	   ,[Telephone] VARCHAR(15)
	   ,[Address] VARCHAR(300)
	   ,[IsMobileRequest] BIT
	)

	DECLARE @Code CHAR(1),
		@Message VARCHAR(MAX);

   	DECLARE @Trancount BIT = 0;
	BEGIN TRY

		------------------------------------------------ DATA JSON ------------------------------------------------------------------------- 
		INSERT INTO @TbCompany 
		      ([IdCard] ,[BusinessName] ,[TradeName] ,[Telephone] ,[Email] ,[Address],
			  Uuid, IsMobileRequest)
		SELECT [IdCard] ,[BusinessName] ,[TradeName] ,[Telephone] ,[Email] ,[Address],
		IIF(LEN(LTRIM(RTRIM(uuid))) = 0, NEWID(), uuid), ISNULL(isMobileRequest, 0)
		FROM OPENJSON(@Json) WITH 
		(
			[IdCard]        VARCHAR(15) '$.idCard'
		   ,[BusinessName] VARCHAR(300) '$.businessName'
		   ,[TradeName]    VARCHAR(300) '$.tradeName'
		   ,[Email]        VARCHAR(300) '$.email'
		   ,[Telephone]     VARCHAR(15) '$.telephone'
		   ,[Address]      VARCHAR(300) '$.address'
		   ,uuid	UNIQUEIDENTIFIER
		   ,isMobileRequest BIT
		)

		-------------------------------------------------- VARIABLES ----------------------------------------------------------------------
		WHILE @Count < 5
			BEGIN
				INSERT INTO @TableValue(Tarifa,Codigo,Predeterminada)
				SELECT 'PVP'+ CAST(@Count+1 AS nvarchar),@Count+1, case when @Count = 0 then 1 else 0 end 
				SET @Count +=  1;
			END 

		SELECT TOP 1  @IdCard = IdCard FROM @TbCompany 

		-------------------------------------------------- VALIDACIONES -------------------------------------------------------------------
		IF (SELECT COUNT(*) FROM @TbCompany) = 0 
			BEGIN 
				SELECT '50001' Code, 'Error en los datos de la empresa' as 'Message'
                RETURN
			END

		IF (SELECT COUNT(*) FROM @TableValue) = 0
			BEGIN 
				SELECT '50001' Code, 'Error en generar las tarifas de precio' as Message
                RETURN
			END

		IF EXISTS (SELECT 1 FROM [Acontplus].[dbo].[Entidad] WITH (NOLOCK) WHERE ruc = @IdCard)
			BEGIN 
				SELECT  '50001' Code, 'Ya se encuentra registrado'as Message
                RETURN
			END 

		IF EXISTS (SELECT 1 FROM Config.Company WITH (NOLOCK) WHERE IdCard = @IdCard)
			BEGIN
				SELECT '50001' Code, 'Ya se encuentra registrado'as Message
                RETURN 
			END 

		-------------------------------------------------- TRAN -------------------------------------------------------------------

		IF (@@TRANCOUNT = 0)
			BEGIN
				BEGIN TRANSACTION;
				SET @Trancount = 1;
			END

			
			INSERT INTO Config.Company 
			      ([IdCard] ,[Uuid] ,[BusinessName] ,[TradeName] ,[Telephone] ,[Email] ,[Address], IsMobileRequest)
			SELECT [IdCard] ,[Uuid] ,UPPER([BusinessName]) ,UPPER([TradeName]) ,[Telephone] ,[Email] ,[Address], IsMobileRequest FROM @TbCompany

			INSERT INTO Acontplus.dbo.Entidad 
			      ([Uuid] ,ruc    ,razonSocial,nombreComercial,email,telefono ,direccion,fechaRegistro)
			SELECT [Uuid] ,IdCard ,UPPER(BusinessName), UPPER(TradeName)  ,Email,Telephone,[Address],GETDATE() FROM @TbCompany

			SET @Id = @@IDENTITY

			--============== CONFIGURACION EN EL MODULO DE VENTAS =================================================

			SET @JsonConfigVentas = (SELECT searchCode = 0, printerAutomatic = 0, payAutomatic = 0 FOR JSON PATH)

			INSERT INTO @TbConfig (IdEntidad,CodConfig,JsonConfig)
			SELECT @Id,'CV',@JsonConfigVentas

			--============== CONFIGURACION EN EL MODULO DE VENTAS ================================================


			--============== CONFIGURACION DE INVENTARIO =========================================================
			
			INSERT INTO @TbConfig(IdEntidad,CodConfig,JsonConfig)
			SELECT @Id,'CI','[{"llevaInventario":"NO"}]'

			--============== CONFIGURACION DE INVENTARIO =========================================================


			--============== CONFIGURACION DE DECIMALES ==========================================================
			
			SET @JsonConfigDecimales = (SELECT  codTransaccion      = Codigo
											   ,nroPrecio           = CASE Codigo WHEN 'AL'THEN 2 WHEN 'V' THEN 5 WHEN 'C' THEN 5 END                
											   ,nroCantidad         = CASE Codigo WHEN 'V' THEN 2 WHEN 'C' THEN 2 END                
											   ,nroIva              = CASE Codigo WHEN 'V' THEN 2 WHEN 'C' THEN 2 END                     
											   ,nroDescuentoDetalle = CASE Codigo WHEN 'V' THEN 2 WHEN 'C' THEN 2 END        
											   ,nroTotalDetalle     = CASE Codigo WHEN 'V' THEN 2 WHEN 'C' THEN 2 END     
											   ,nroTotalSubTotal    = CASE Codigo WHEN 'V' THEN 2 WHEN 'C' THEN 2 END          
											   ,nroDescuento        = CASE Codigo WHEN 'V' THEN 2 WHEN 'C' THEN 2 END  
											   ,nroIce              = CASE Codigo WHEN 'V' THEN 2 WHEN 'C' THEN 2 END
											   ,importeTotal        = CASE Codigo WHEN 'V' THEN 2 WHEN 'C' THEN 2 END
										FROM Acontplus.dbo.TipoTransaccion WITH (NOLOCK)
										WHERE Codigo IN ('AL','C','V') FOR JSON PATH)
			
			INSERT INTO @TbConfig (IdEntidad,CodConfig,JsonConfig)
			SELECT @Id,'CD',@JsonConfigDecimales

			--============== CONFIGURACION DE DECIMALES ==========================================================
			

			--============== CONFIGURACION DE NOTIFICACIONES =====================================================
			
			SET @JsonConfigNotificaciones = (SELECT idNotificacionSistema,Codigo,Estado FROM Acontplus.Config.NotificacionSistema WITH (NOLOCK) ORDER BY Descripcion FOR JSON PATH)

			INSERT INTO @TbConfig (IdEntidad,CodConfig,JsonConfig)
			SELECT @Id,'CS',@JsonConfigNotificaciones

			--============== CONFIGURACION DE NOTIFICACIONES =====================================================

			--============== CONFIGURACIONES GENERALES DEL SISTEMA ===============================================

			INSERT INTO [Acontplus].[Config].Sistema(IdEntidad,CodConfig,JsonConfig)
			SELECT IdEntidad,CodConfig,JsonConfig FROM @TbConfig

			--============== CONFIGURACIONES GENERALES DEL SISTEMA ===========================================================

			--============== CONFIGURACIONES DE LAS COLUMNAS EN LOS DOCUMENTOS ===============================================
			
			INSERT INTO Acontplus.dbo.ConfigVentaDetalle(IdEntidad,fechaRegistro) SELECT @Id,GETDATE()
			
			--============== CONFIGURACIONES DE LAS COLUMNAS EN LOS DOCUMENTOS ===============================================

			--============== TARIFAS DE PRECIOS ===============================================
			
			INSERT INTO Acontplus.dbo.Tarifa(IdEntidad,Descripcion,Codigo,fechaRegistro,Predeterminada)
			SELECT @Id,Tarifa,Codigo,GETDATE(),Predeterminada FROM @TableValue ORDER BY Codigo ASC
			
			--============== TARIFAS DE PRECIOS ===============================================

		IF (@@ROWCOUNT > 0)
			BEGIN
				SET @Code = '0';
				SET @Message = 'Registrada Exitosamente';
			END
		ELSE
			BEGIN
				SET @Code = '50001';
				SET @Message = 'No se pudo registrar';
			END

	  IF (@Trancount = 1)
		BEGIN
			COMMIT;
			SELECT @Code as Code, @Message as 'Message';
		 END
	END TRY 

	BEGIN CATCH
        IF (@Trancount = 1)
			BEGIN
				SET @ResponseTime = DATEDIFF_BIG(MILLISECOND, @StartTime, SYSUTCDATETIME());
        
				EXEC dbo.LogError
					@ModuleName = 'CONFIG',
					@BusinessProcess = 'COMPANY_INSERT',
					@ErrorCategory = 'BUSINESS_RULE',
					@ErrorSeverityLevel = 'HIGH',
					@ResponseTime = @ResponseTime,
					@EnvironmentName = 'PROD',
					@BuildVersion = '3.0.0';

				SELECT '50001' Code, 'Error en el procedimiento: ' + ERROR_MESSAGE() as Message;
				THROW;
			END
		ELSE
			BEGIN
				SET @ErrorCode = ERROR_NUMBER()
				SET @ErrorMessage = ERROR_MESSAGE()
			END
	END CATCH
END
