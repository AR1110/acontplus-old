use [Acontplus]
go
IF OBJECT_ID(N'Config.Email_Config', N'U') IS NOT NULL
DROP TABLE Config.Email_Config 
GO
CREATE TABLE Config.Email_Config(
	[idEmailConfig] INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,[EnableSsl] VARCHAR(5) NOT NULL
   ,[from] VARCHAR(150) NOT NULL
   ,[host] VARCHAR(150) NOT NULL
   ,[password] VARCHAR(150) NOT NULL
   ,[port] INT NOT NULL
)