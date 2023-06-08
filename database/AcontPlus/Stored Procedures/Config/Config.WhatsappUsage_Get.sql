USE AcontPlus
GO
/****** Object:  StoredProcedure [Recepcion].[ASPComprobanteImportacionInsert]    Script Date: 8/4/2022 9:30:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2023-05-23
-- Description:	 sp for get usage from whatsapp messages module
-- =============================================
IF OBJECT_ID(N'Config.WhatsappUsage_Get', N'P') IS NOT NULL
DROP PROCEDURE Config.WhatsappUsage_Get
GO
CREATE PROCEDURE Config.WhatsappUsage_Get @idUsuarioRol INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @tipo INT

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')
	
	IF @tipo = 1
		BEGIN
			DECLARE @tbl AS TABLE (
				ruc VARCHAR(25),
				razonSocial VARCHAR(500)
			)
			INSERT INTO @tbl(ruc, razonSocial)
			SELECT ruc, razonSocial FROM Entidad WITH (NOLOCK) WHERE estado = 1 GROUP BY ruc, razonSocial

			SELECT wu.*, e.razonSocial FROM @tbl e
										LEFT JOIN  Config.WhatsappUsage wu WITH(NOLOCK) ON wu.ruc = e.ruc ORDER BY e.razonSocial
		END
	IF @tipo = 2
		BEGIN
			DECLARE @ruc VARCHAR(25)
			SET @ruc = (SELECT ruc FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
			IF EXISTS (SELECT 1 FROM Config.WhatsappUsage WHERE ruc = @ruc AND estado = 0 AND ilimitado = 0)
				BEGIN
					SELECT '0' code, 'El envío de comprobantes por whatsapp esta bloqueado, para activarlo debe adquirir un plan, comuníquese con ACONTPLUS WEB al número 0991686066 para activarlo.' as 'message'
					RETURN
				END
			ELSE
				BEGIN
					DECLARE @message VARCHAR(100) = ''
					,@limite INT = 0
					,@totalUsed INT = 0
					,@availables INT = 0
					,@ilimitado BIT = 0
					SELECT @totalUsed = used, @limite = limite, @ilimitado = ilimitado FROM WhatsappUsage WHERE ruc = @ruc

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
