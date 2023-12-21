USE [AcontPlus]
GO

/****** Object:  Table [dbo].[ErroresSistema]    Script Date: 10/22/2022 7:23:23 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID(N'dbo.ErroresSistema', N'U') IS NOT NULL
DROP TABLE dbo.ErroresSistema 
GO
CREATE TABLE [dbo].[ErroresSistema](
	[idErrorSistema] [int] IDENTITY(1,1) NOT NULL,
	[token] [uniqueidentifier] NOT NULL,
	[method] [varchar](150) NULL,
	[errorNumber] [int] NOT NULL,
	[errorSeverity] [int] NOT NULL,
	[errorState] [int] NOT NULL,
	[errorProcedure] [varchar](150) NOT NULL,
	[errorLine] [int] NOT NULL,
	[errorMessage] [nvarchar](300) NOT NULL,
	[errorDate] [datetime] NOT NULL,
	[idUsuario] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[idErrorSistema] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


