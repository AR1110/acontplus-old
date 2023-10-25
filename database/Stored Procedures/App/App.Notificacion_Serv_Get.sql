USE [AcontPlus]
IF OBJECT_ID('App.Notificacion_Serv_Get') IS NOT NULL
	DROP PROCEDURE App.Notificacion_Serv_Get
GO
--Author: Emilio Senguana
--Date: 2023-03-09
--Description: SP FOR GET NOTFICATIONS
CREATE PROCEDURE App.Notificacion_Serv_Get @cantidad INT 
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	SELECT TOP (@cantidad) [idNotificacion]
    ,[params]
    ,[emailData]
    ,[receptor] as 'to'
    ,[fechaRegistro]
    ,[estado]
    ,[fechaEnvio]
    ,[msgError]
    ,[idUsuario]
    FROM App.Notificacion WITH(NOLOCK) WHERE estado='NE'
END 