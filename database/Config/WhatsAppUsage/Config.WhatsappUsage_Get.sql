USE [Acontplus]
GO
/****** Object:  StoredProcedure [Config].[WhatsappUsage_Get]    Script Date: 12/17/2024 11:09:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [Config].[WhatsAppUsage_Get] @idUsuarioRol INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @tipo INT,
        @companyUuid UNIQUEIDENTIFIER;

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')
	
	IF @tipo = 2
		BEGIN
			SET @companyUuid = (SELECT uuid FROM v_usuario WHERE idUsuarioRol = @idUsuarioRol)

            IF NOT EXISTS (SELECT 1 FROM Config.WhatsappUsage  wau
                                INNER JOIN Config.Company c ON wau.CompanyId  = c.Id
                                WHERE c.Uuid = @companyUuid)
				BEGIN
					SELECT '0' code, 'El envío de mensajes por whatsapp aun no esta habilitado, para activarlo debe adquirir un plan, comuníquese con ACONTPLUS WEB al número 0991686066.' as 'message'
					RETURN
				END

			IF EXISTS (SELECT 1 FROM Config.WhatsappUsage  wau
                                INNER JOIN Config.Company c ON wau.CompanyId  = c.Id
                                WHERE c.Uuid = @companyUuid AND wau.IsActive = 0 AND wau.[Unlimited] = 0)
				BEGIN
					SELECT '0' code, 'El envío de comprobantes por whatsapp esta bloqueado, para activarlo debe adquirir un plan, comuníquese con ACONTPLUS WEB al número 0991686066.' as 'message'
					RETURN
				END
			ELSE
				BEGIN
					DECLARE @message VARCHAR(100) = ''
					,@limite INT = 0
					,@totalUsed INT = 0
					,@availables INT = 0
					,@ilimitado BIT = 0
					SELECT @totalUsed = used, @limite = limit, @ilimitado = [Unlimited] 
                    FROM Config.WhatsappUsage  wau
                        INNER JOIN Config.Company c ON wau.CompanyId  = c.Id
                    WHERE c.Uuid = @companyUuid

					IF (@ilimitado = 0)
						BEGIN
							SET @availables = (@limite - @totalUsed)
							IF (@availables) < 25
							SET @message = 'Le quedan ' + CONVERT(VARCHAR, @availables) + ' mensajes de whatsapp disponibles de su paquete contratado'
						END
				

					SELECT '1' code, @message as 'message'
				END
			--IF EXISTS (SELECT 1 FROM Config.WhatsappUsage WHERE ruc = @ruc AND ilimitado = 0)
			--	BEGIN
			--		IF (SELECT COUNT(*) FROM Config.WhatsappMessage WHERE idUsuarioRol = @idUsuarioRol) >= 75
			--			BEGIN
			--				SELECT '0' code, 'Ha superado el limite de envio de mensajes, comuniquese con el administrador del sistema' as 'message'
			--			END
			--		ELSE
			--			BEGIN
			--				SELECT '1' code
			--			END
			--	END
			--ELSE
			--	BEGIN
			--		SELECT '1' code
			--	END
		END
		
END
