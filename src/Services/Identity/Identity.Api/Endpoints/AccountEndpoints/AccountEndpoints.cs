namespace Identity.Api.Endpoints.AccountEndpoints;

public static class AccountEndpoints
{
    public static void MapAccountEndpoints(this IEndpointRouteBuilder app)
    {
        // Create API version sets
        var apiVersionSet = app.NewApiVersionSet()
            .HasApiVersion(new ApiVersion(1, 0))
            .HasApiVersion(new ApiVersion(2, 0))
            .HasApiVersion(new ApiVersion(3, 0))
            .ReportApiVersions()
            .Build();

        app.MapAccountV1Endpoints(apiVersionSet);
        app.MapAccountV2Endpoints(apiVersionSet);
        app.MapAccountV3Endpoints(apiVersionSet);
    }

    private static void MapAccountV1Endpoints(this IEndpointRouteBuilder app, ApiVersionSet apiVersionSet)
    {
        var accountV1Group = app.MapGroup("/api/account")
            .WithApiVersionSet(apiVersionSet)
            .MapToApiVersion(new ApiVersion(1, 0))
            .WithTags("Account V1")
            .WithOpenApi();

        // Login endpoint
        accountV1Group.MapPost("/Login", async (
            AuthRequestDto authRequest,
            IJwtTokenService tokenService,
            IConfiguration config,
            ILoginFailedService loginFailedService,
            ILoginHistoryService loginHistoryService,
            IAccountService accountService,
            HttpContext httpContext) =>
        {
            if (string.IsNullOrEmpty(authRequest.Username))
                return Results.BadRequest("Usuario no puede estar vacio");

            if (string.IsNullOrEmpty(authRequest.Password))
                return Results.BadRequest("Contraseña no puede estar vacia");

            var response = await accountService.LoginAsync(authRequest.Username, authRequest.Password);

            if (response.Code == "1" && !string.IsNullOrEmpty(response.Payload))
            {
                List<UserDataDto> userData = JsonExtensions.DeserializeOptimized<List<UserDataDto>>(response.Payload);

                if (authRequest.ReturnUrl == "/") authRequest.ReturnUrl = null;

                userData.ForEach(x => x.ReturnUrl = authRequest.ReturnUrl ?? "/Index");

                switch (userData.Count)
                {
                    case 1 when !userData[0].NeedAuthorization:
                        {
                            userData.ForEach(x => x.UrlGateway = config["ApiGateways:Acontplus"]);

                            var token = tokenService.CreateToken(userData.FirstOrDefault());

                            if (token == null || string.IsNullOrEmpty(token.Token))
                                return Results.BadRequest("Error al iniciar session");

                            userData.ForEach(x => x.Token = token.Token);
                            var loginHistory = new LoginHistory
                            {
                                CreatedByUserId = userData[0].UserId,
                                UserRoleId = userData[0].UserRoleId,
                                UserAgent = UserAgentHelper.SummarizeUserAgent(authRequest.UserAgent).UserAgent,
                                IpAddress = DataValidation.ValidateIpAddress(UserAgentHelper
                                    .SummarizeUserAgent(authRequest.UserAgent).IpAddress),
                                Token = token.Token,
                                TokenExpiration = token.Expires,
                                Id = 0
                            };
                            await loginHistoryService.AddAsync(loginHistory);
                            //Originally user agent to get with another property, but now we use the one from authRequest
                            loginHistory.UserAgent = authRequest.UserAgent;
                            await accountService.AddNotificationAsync(loginHistory);
                            return Results.Ok(new SpResponse
                            {
                                Code = "1",
                                Message = "Login Correcto!",
                                Payload = JsonExtensions.SerializeOptimized(userData)
                            });
                        }
                    case 1 when userData[0].NeedAuthorization:
                        return Results.Ok(new SpResponse
                        {
                            Code = "1",
                            Message = "Su ingreso requiere ser autenticado, espere la confirmación!",
                            Payload = JsonExtensions.SerializeOptimized(userData)
                        });
                    case > 1:
                        return Results.Ok(new SpResponse
                        {
                            Code = "1",
                            Message = "Seleccione la empresa!",
                            Payload = JsonExtensions.SerializeOptimized(userData)
                        });
                }
            }
            else
            {
                if (string.IsNullOrEmpty(authRequest.UserAgent) ||
                    string.IsNullOrEmpty(authRequest.Username) ||
                    string.IsNullOrEmpty(authRequest.Password))
                    return Results.Ok(response);

                var loginFailed = new LoginFailed
                {
                    UserAgent = UserAgentHelper.SummarizeUserAgent(authRequest.UserAgent).UserAgent,
                    IpAddress = DataValidation.ValidateIpAddress(UserAgentHelper.SummarizeUserAgent(authRequest.UserAgent)
                        .IpAddress),
                    Username = authRequest.Username,
                    Password = authRequest.Password,
                    Id = 0
                };
                await loginFailedService.AddAsync(loginFailed);
            }

            return Results.Ok(response);
        })
        .AllowAnonymous()
        .WithSummary("User login for V1")
        .WithDescription("Authenticates a user and returns user data with token")
        .WithName("LoginV1");

        // CreateToken endpoint
        accountV1Group.MapPost("/CreateToken", async (
            UserDataDto userData,
            IJwtTokenService tokenService,
            IConfiguration config,
            ILoginHistoryService loginHistoryService,
            IAccountService accountService) =>
        {
            userData.UrlGateway = config["ApiGateways:Acontplus"];
            var token = tokenService.CreateToken(userData);
            if (token == null || string.IsNullOrEmpty(token.Token))
                return Results.BadRequest("Error al iniciar session");

            var loginHistory = new LoginHistory
            {
                CreatedByUserId = userData.UserId,
                UserRoleId = userData.UserRoleId,
                UserAgent = UserAgentHelper.SummarizeUserAgent(userData.UserAgent).UserAgent,
                IpAddress = DataValidation.ValidateIpAddress(UserAgentHelper.SummarizeUserAgent(userData.UserAgent)
                    .IpAddress),
                Token = token.Token,
                TokenExpiration = token.Expires,
                Id = 0
            };
            await loginHistoryService.AddAsync(loginHistory);
            //Originally user agent to get with another property, but now we use the one from userData
            loginHistory.UserAgent = userData.UserAgent;
            await accountService.AddNotificationAsync(loginHistory);
            userData.Token = token.Token;

            return Results.Ok(new SpResponse
            {
                Code = "1",
                Message = "Login Correcto!",
                Payload = JsonExtensions.SerializeOptimized(userData)
            });
        })
        .AllowAnonymous()
        .WithSummary("Create token for user data")
        .WithDescription("Creates a JWT token for the provided user data")
        .WithName("CreateTokenV1");

        // RequestAccess endpoint
        accountV1Group.MapPost("/RequestAccess", async (
            RequestAccessDto data,
            IAccountService accountService) =>
        {
            var response = await accountService.RequestAccessAsync(data);
            return Results.Ok(response);
        })
        .AllowAnonymous()
        .WithSummary("Request access authorization")
        .WithDescription("Requests access authorization for a user")
        .WithName("RequestAccessV1");

        // Authenticate endpoint
        accountV1Group.MapPost("/Authenticate", async (
            AccessAuthorization data,
            IAccountService accountService) =>
        {
            var response = await accountService.AuthenticateAsync(data);
            return Results.Ok(response);
        })
        .AllowAnonymous()
        .WithSummary("Authenticate access authorization")
        .WithDescription("Authenticates access authorization request")
        .WithName("AuthenticateV1");
    }

    private static void MapAccountV2Endpoints(this IEndpointRouteBuilder app, ApiVersionSet apiVersionSet)
    {
        var accountV2Group = app.MapGroup("/api/v{version:apiVersion}/Account")
            .WithApiVersionSet(apiVersionSet)
            .MapToApiVersion(new ApiVersion(2, 0))
            .WithTags("Account V2")
            .WithOpenApi();

        // Login endpoint
        accountV2Group.MapPost("/Login", async (
            AuthRequestDto authRequest,
            IConfiguration config,
            ILoginFailedService loginFailedService,
            ILoginHistoryService loginHistoryService,
            IJwtTokenService tokenService,
            IAccountService accountService,
            HttpContext httpContext) =>
        {
            if (string.IsNullOrEmpty(authRequest.Username))
                return Results.BadRequest("Usuario no puede estar vacio");

            if (string.IsNullOrEmpty(authRequest.Password))
                return Results.BadRequest("Contraseña no puede estar vacia");

            var response = await accountService.LoginAppAsync(authRequest.Username, authRequest.Password);

            if (response.Code != "1" || string.IsNullOrEmpty(response.Payload))
                return Results.Ok(response);

            List<UserDataDto> userData = JsonExtensions.DeserializeOptimized<List<UserDataDto>>(response.Payload);

            if (userData.Count != 1) return Results.Ok(response);

            var user = userData[0];
            user.UrlGateway = config["ApiGateways:Acontplus"];

            var token = tokenService.CreateToken(user);

            if (token == null || string.IsNullOrEmpty(token.Token))
            {
                if (string.IsNullOrEmpty(authRequest.UserAgent) ||
                    string.IsNullOrEmpty(authRequest.Username) ||
                    string.IsNullOrEmpty(authRequest.Password))
                    return Results.Ok(response);

                var loginFailed = new LoginFailed
                {
                    UserAgent = authRequest.UserAgent ?? httpContext.Request.Headers.UserAgent.ToString(),
                    Username = authRequest.Username,
                    Password = authRequest.Password,
                    IsMobileRequest = true,
                    Id = 0
                };
                await loginFailedService.AddAsync(loginFailed);
                return Results.BadRequest("Error al iniciar session");
            }

            var loginHistory = new LoginHistory
            {
                CreatedByUserId = userData[0].UserId,
                UserRoleId = userData[0].UserRoleId,
                UserAgent = authRequest.UserAgent ?? httpContext.Request.Headers.UserAgent.ToString(),
                Token = token.Token,
                TokenExpiration = token.Expires,
                Id = 0
            };

            await loginHistoryService.AddAsync(loginHistory);
            loginHistory.UserAgent = authRequest.UserAgent;
            await accountService.AddNotificationAsync(loginHistory);
            user.Token = token.Token;
            return Results.Ok(new SpResponse { Code = "1", Payload = user, Message = "Login Correcto" });
        })
        .AllowAnonymous()
        .WithSummary("Mobile app login for V2")
        .WithDescription("Authenticates a mobile user and returns user data with token")
        .WithName("LoginV2");

        // CreateToken endpoint
        accountV2Group.MapPost("/createToken", async (
            UserDataDto userData,
            IConfiguration config,
            IJwtTokenService tokenService,
            ILoginHistoryService loginHistoryService,
            IAccountService accountService,
            HttpContext httpContext) =>
        {
            userData.UrlGateway = config["ApiGateways:Acontplus"];
            var token = tokenService.CreateToken(userData);
            if (token == null || string.IsNullOrEmpty(token.Token))
                return Results.BadRequest("Error al iniciar session");

            var loginHistory = new LoginHistory
            {
                CreatedByUserId = userData.UserId,
                UserRoleId = userData.UserRoleId,
                UserAgent = userData.UserAgent ?? httpContext.Request.Headers.UserAgent.ToString(),
                Token = token.Token,
                TokenExpiration = token.Expires,
                IsMobileRequest = true,
                Id = 0
            };
            await loginHistoryService.AddAsync(loginHistory);
            loginHistory.UserAgent = userData.UserAgent;
            await accountService.AddNotificationAsync(loginHistory);
            userData.Token = token.Token;
            return Results.Ok(new SpResponse { Code = "0", Payload = userData, Message = "Login Correcto" });
        })
        .AllowAnonymous()
        .WithSummary("Create token for mobile user data")
        .WithDescription("Creates a JWT token for the provided mobile user data")
        .WithName("CreateTokenV2");
    }

    private static void MapAccountV3Endpoints(this IEndpointRouteBuilder app, ApiVersionSet apiVersionSet)
    {
        var accountV3Group = app.MapGroup("/api/v{version:apiVersion}/Account")
            .WithApiVersionSet(apiVersionSet)
            .MapToApiVersion(new ApiVersion(3, 0))
            .WithTags("Account V3")
            .WithOpenApi();

        // Login endpoint
        accountV3Group.MapPost("/login", async (
            AuthRequestDto authRequest,
            IConfiguration config,
            IJwtTokenService tokenService,
            ILoginFailedService loginFailedService,
            ILoginHistoryService loginHistoryService,
            IAccountService accountService,
            HttpContext httpContext) =>
        {
            var fromMobile = httpContext.Items["FromMobile"] as bool? ?? false;

            if (string.IsNullOrEmpty(authRequest.Username))
                return Results.BadRequest("Usuario no puede estar vacio");

            if (string.IsNullOrEmpty(authRequest.Password))
                return Results.BadRequest("Contraseña no puede estar vacia");

            var response = await accountService.LoginRestaurantAsync(authRequest.Username, authRequest.Password);

            if (response.Code == "1")
            {
                List<UserDataDto> userData = JsonExtensions.DeserializeOptimized<List<UserDataDto>>(response.Payload);

                switch (userData.Count)
                {
                    case 1:
                        {
                            userData.ForEach(x => x.UrlGateway = config["ApiGateways:Acontplus"]);

                            var token = tokenService.CreateToken(userData.FirstOrDefault());

                            if (token == null || string.IsNullOrEmpty(token.Token))
                                return Results.BadRequest("Error al iniciar session");

                            userData.ForEach(x => x.Token = token.Token);

                            var loginHistory = new LoginHistory
                            {
                                CreatedByUserId = userData[0].UserId,
                                UserRoleId = userData[0].UserRoleId,
                                UserAgent = authRequest.UserAgent,
                                Token = token.Token,
                                TokenExpiration = token.Expires,
                                IsMobileRequest = fromMobile,
                                Id = 0
                            };
                            await loginHistoryService.AddAsync(loginHistory);
                            loginHistory.UserAgent = authRequest.UserAgent;
                            await accountService.AddNotificationAsync(loginHistory);
                            return Results.Ok(new SpResponse
                            {
                                Code = "1",
                                Message = "Login Correcto!",
                                Payload = JsonExtensions.SerializeOptimized(userData)
                            });
                        }
                }
            }
            else
            {
                var loginFailed = new LoginFailed
                {
                    UserAgent = authRequest.UserAgent,
                    Username = authRequest.Username,
                    Password = authRequest.Password,
                    IsMobileRequest = fromMobile,
                    Id = 0
                };
                await loginFailedService.AddAsync(loginFailed);
            }

            return Results.Ok(response);
        })
        .AllowAnonymous()
        .WithSummary("Restaurant login for V3")
        .WithDescription("Authenticates a restaurant user and returns user data with token")
        .WithName("LoginV3");

        // CreateToken endpoint
        accountV3Group.MapPost("/createToken", async (
            UserDataDto userData,
            IConfiguration config,
            IJwtTokenService tokenService,
            ILoginHistoryService loginHistoryService,
            IAccountService accountService,
            HttpContext httpContext) =>
        {
            var fromMobile = httpContext.Items["FromMobile"] as bool? ?? false;
            userData.UrlGateway = config["ApiGateways:Acontplus"];
            var token = tokenService.CreateToken(userData);
            if (token == null || string.IsNullOrEmpty(token.Token))
                return Results.BadRequest("Error al iniciar session");

            var loginHistory = new LoginHistory
            {
                CreatedByUserId = userData.UserId,
                UserRoleId = userData.UserRoleId,
                UserAgent = userData.UserAgent,
                Token = token.Token,
                TokenExpiration = token.Expires,
                IsMobileRequest = fromMobile,
                Id = 0
            };
            await loginHistoryService.AddAsync(loginHistory);
            loginHistory.UserAgent = userData.UserAgent;
            await accountService.AddNotificationAsync(loginHistory);
            userData.Token = token.Token;
            return Results.Ok(new SpResponse
            {
                Code = "1",
                Message = "Login Correcto!",
                Payload = JsonExtensions.SerializeOptimized(userData)
            });
        })
        .AllowAnonymous()
        .WithSummary("Create token for restaurant user data")
        .WithDescription("Creates a JWT token for the provided restaurant user data")
        .WithName("CreateTokenV3");
    }
}
