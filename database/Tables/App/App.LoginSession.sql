Use Acontplus

CREATE TABLE App.LoginSession(
idLoginSession INT NOT NULL CONSTRAINT pk_login_session PRIMARY KEY IDENTITY (1,1)
,idUsuarioRol INT NOT NULL CONSTRAINT fk_ls_usuario_rol FOREIGN KEY (idUsuarioRol) REFERENCES App.UsuarioRol (idUsuarioRol)
,os VARCHAR(200) NULL
,browser VARCHAR(300) NULL
,urlAddress VARCHAR(200) NULL
,jwtToken VARCHAR(MAX) NULL
,refreshToken VARCHAR(MAX) NULL
,rememberMe BIT NOT NULL DEFAULT 1
,loginDate DATETIME NOT NULL DEFAULT GETDATE()
,loginLogout DATETIME NULL
,expirationTime INT NULL
)