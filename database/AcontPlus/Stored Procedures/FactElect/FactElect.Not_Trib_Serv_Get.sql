USE Acontplus
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-12-07
-- Description:	SP FOR GET NOTIFICATIONS FOR EMAIL
-- =============================================
IF OBJECT_ID(N'FactElect.Not_Trib_Serv_Get', N'P') IS NOT NULL
DROP PROCEDURE FactElect.Not_Trib_Serv_Get 
GO
CREATE PROCEDURE FactElect.Not_Trib_Serv_Get @estado VARCHAR(5),@cantDocs INT
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	SELECT TOP (@cantDocs)
	de.codDoc, 
	comprobante,
	de.serieComprobante,
	n.estado,
	n.idNotificacionTributaria, 
	n.idDocumentoElectronico, 
	ISNULL(n.receptor,'') receptor, 
	de.claveAcceso, 
	ISNULL(de.xmlSri, '') xmlSri,
	jsonParmeter = CASE codDoc WHEN '01' THEN '[{"codigo":"RF"  ,"format":"pdf" ,"id":'+CAST(de.idDocumento AS varchar)+'}]' 
	                           WHEN '03' THEN '[{"codigo":"RLC" ,"format":"pdf" ,"id":'+CAST(de.idDocumento AS varchar)+'}]'
							   WHEN '04' THEN '[{"codigo":"RNCC","format":"pdf" ,"id":'+CAST(de.idDocumento AS varchar)+'}]'
							   WHEN '06' THEN '[{"codigo":"RGR" ,"format":"pdf" ,"id":'+CAST(de.idDocumento AS varchar)+'}]'
							   WHEN '07' THEN '[{"codigo":"RRC" ,"format":"pdf" ,"id":'+CAST(de.idDocumento AS varchar)+',"versionComp":"'+de.versionComp+'"}]'
							 END
	,storedProcedureSendMail = CASE codDoc WHEN '01' THEN 'FactElect.Factura_SendEmail' 
	                                       WHEN '03' THEN 'FactElect.Liquidacion_Send_Email'
										   WHEN '04' THEN 'FactElect.NotaCredito_Send_Email'
										   WHEN '06' THEN 'FactElect.GuiaRemision_Send_Email'
							               WHEN '07' THEN 'FactElect.Retencion_Send_Email'
							 END
	--jsonParmeter = '[{"format":"pdf" ,"id":'+CAST(de.idDocumento AS varchar)+',"codDoc":' + '"' + de.codDoc + '"' + '}]' 
	FROM FactElect.NotificacionTributaria n WITH (NOLOCK)
	INNER JOIN v_DocElectronico de WITH (NOLOCK) ON n.idDocumentoElectronico = de.idDocumentoElectronico
	WHERE n.estado = 'NE'
END
GO
