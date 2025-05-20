USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-10-11-03
-- Description:	SP FOR GET CONSUMOS TPV ANULADOS
-- =============================================
IF OBJECT_ID(N'Restaurant.ConsumoAnuladoTpv_Get', N'P') IS NOT NULL
DROP PROCEDURE Restaurant.ConsumoAnuladoTpv_Get
GO
CREATE PROCEDURE Restaurant.ConsumoAnuladoTpv_Get @idRol INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @idEntidad INT
	,@tipo INT
	,@txtSearch VARCHAR(13) 
	,@idConsumoTpv INT

	SELECT @idEntidad = idEntidad FROM AFTDataRol(@idRol)

	SELECT @tipo = tipo, @txtSearch = txtSearch, @idConsumoTpv = idConsumoTpv FROM OPENJSON(@json)
												WITH (
														tipo INT '$.tipo'
														,txtSearch VARCHAR(13) '$.txtSearch'
														,idConsumoTpv INT '$.idConsumoTpv')


	SELECT motivo
	FROM Restaurant.ConsumoAnuladoTpv WHERE idConsumoTpv = @idConsumoTpv

END
GO
