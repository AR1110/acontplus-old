# AcontPlus AI Coding Instructions

## Project Overview
AcontPlus is a microservices-based solution using **.NET 10** for the backend and a mix of **Angular** and **Razor Pages** for the frontend.

### Architecture
- **Microservices**: Located in `src/Services/`. Each service follows **Clean Architecture**:
  - `*.Api`: Entry point (Controllers/Endpoints).
  - `*.Application`: Business logic, DTOs, Interfaces (Service-based pattern, not MediatR).
  - `*.Domain`: Entities, Value Objects, Domain Logic.
  - `*.Infrastructure`: EF Core, External integrations.
- **API Gateway**: Ocelot-based gateway in `src/ApiGateways/`.
- **Frontend**:
  - `src/WebApps/client`: Angular application.
  - `src/WebApps/WebUI`: ASP.NET Core Razor Pages application.
- **Shared Libraries**: `Acontplus.*` packages (managed centrally in `Directory.Packages.props`).

## Key Technologies & Patterns
- **Framework**: .NET 10 (`net10.0`). Ensure compatibility with preview features if necessary.
- **ORM**: Entity Framework Core.
- **Mapping**: **Mapster** is the standard for object mapping.
- **Logging**: **Serilog** is used across all services.
- **Dependency Injection**: **Scrutor** is used for assembly scanning and registration.
- **Containerization**: Docker & Docker Compose for development.

## Development Workflow
- **Build**: Use the provided VS Code tasks or `dotnet build`.
- **Run**: Use `docker-compose up` or the "watch" task for hot reload.
- **Configuration**:
  - Services use `appsettings.json` and **User Secrets** for sensitive data.
  - `docker-compose.override.yml` maps User Secrets into containers.
- **Database**:
  - SQL scripts are located in `database/`.
  - Includes numbered migration scripts (e.g., `009_migration__...`) and service-specific folders.
  - **Note**: Database changes may require running these scripts manually or via a specific tool not visible in the root.

## Conventions
- **Naming**:
  - **Services**: `src/Services/` uses English names (e.g., `Accounting`, `Sales`, `Inventory`). Spanish directories have been deprecated/removed.
  - **Database**: `database/` folders still use Spanish names (e.g., `Contabilidad`, `Ventas`). Do not rename these without explicit instruction.
- **DTOs**: Located in `Application/Dtos`.
- **Interfaces**: Located in `Application/Interfaces`.

## Critical Files
- `AcontPlus.sln`: Main solution file.
- `Directory.Packages.props`: Central Package Management versions.
- `docker-compose.yml`: Service definitions.
- `src/Services/*/Program.cs`: Service configuration and startup.
