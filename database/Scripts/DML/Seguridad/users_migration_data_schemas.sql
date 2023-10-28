--use AcontPlus
--go
--SET IDENTITY_INSERT Seguridad.[Usuario] ON 

--insert into Seguridad.Usuario(idUsuario, nombreUsuario, email, contrasenia, salt, nombreCompleto, nroIdentificacion, estado)
--select idUsuario, nombreUsuario, correo, contrasenia, NEWID(), nombreCompleto, nroIdentificacion, estado from Usuario

--SET IDENTITY_INSERT Seguridad.[Usuario] OFF

--GO
--SET IDENTITY_INSERT Seguridad.Rol ON 

--insert into Seguridad.Rol(idRol, codigo, descripcion, estado)
--select idPolitica, codigo, descripcion, estado from Politica

--SET IDENTITY_INSERT Seguridad.Rol OFF
--GO

--SET IDENTITY_INSERT Seguridad.UsuarioRol ON 

--insert into Seguridad.UsuarioRol(idUsuarioRol, idUsuario, idRol, idEntidad, registro, estado)
--select idUsuarioRol, idUsuario, idRol, idEntidad, fechaRegistro, estado from App.UsuarioRol

--SET IDENTITY_INSERT Seguridad.UsuarioRol OFF
