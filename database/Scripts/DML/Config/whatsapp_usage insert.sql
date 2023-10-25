use acontplus

--select * from config.WhatsappMessage
--INSERT INTO Config.WhatsappUsage(ruc, fechaInicio, limite, used, idUsuario)
--SELECT ruc, '2023-05-20', 75, (SELECT count(*) FROM Config.WhatsappMessage m INNER JOIN App.UsuarioRol r ON m.idUsuarioRol = r.idUsuarioRol AND r.ruc = e.ruc), 1
--FROM Entidad e
--WHERE estado = 1
--group by ruc