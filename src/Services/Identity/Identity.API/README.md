# Identity API - Comprehensive Documentation

## Overview

This document provides complete documentation for the Identity API project, including architectural improvements, database schema organization, and migration guides. The Identity API is built using .NET 9 and Entity Framework Core, following enterprise-grade security and performance best practices.

**🎯 Enhanced Multi-Business Domain Support**: This Identity API now supports comprehensive user profiles for diverse business domains including Veterinary, Mechanical, Restaurant, BarberShop, Accounting, Inventory, Sales, Purchasing, Loyalty, and Technical Support services.

**🔄 Recent Refactoring**: The UserProfile entity has been refactored for better normalization and simplified JSON storage.

---

## Recent Changes (Latest Update)

### **📋 UserProfile Complete Simplification**

#### **Key Changes Made:**
1. **Document Type Normalization**:
   - `DocumentType` (string) → `DocumentTypeId` (int) - Foreign key reference
   - `DocumentNumber` → `IdCard` - More descriptive field name
   - Added `DocumentType` entity for proper normalization

2. **Simplified JSON Storage**:
   - Removed domain-specific JSON properties (`VeterinaryPreferences`, `MechanicalPreferences`, etc.)
   - Consolidated to single `CustomProperties` JSON field
   - Cleaner entity design with better maintainability

3. **Removed Business-Specific Certification Properties**:
   - Removed all individual certification and specialty fields:
     - `VeterinaryLicense`, `VeterinarySpecialty`
     - `MechanicalCertification`, `MechanicalSpecialty`
     - `FoodHandlersCertificate`, `CulinarySpecialty`
     - `BarberLicense`, `BarberSpecialty`
     - `AccountingCertification`, `FinancialSpecialty`

4. **🗑️ Removed Business Domain Boolean Flags**:
   - Removed all business domain boolean flags:
     - `IsVeterinaryUser`, `IsMechanicalUser`, `IsRestaurantUser`
     - `IsBarberShopUser`, `IsAccountingUser`, `IsInventoryUser`
     - `IsSalesUser`, `IsPurchasingUser`, `IsLoyaltyUser`, `IsTechnicalSupportUser`
   - **Rationale**: Business domain assignment should be managed through roles, permissions, or separate domain-specific services
   - **Benefit**: Pure identity profile focused on user information, not business logic

5. **🗑️ Removed Location & Branches Properties**:
   - Removed business-specific location properties:
     - `DefaultBranch`, `DefaultWarehouse`, `DefaultPointOfSale`
     - `DefaultLatitude`, `DefaultLongitude`
   - **Rationale**: Location and branch assignments are business concerns, not identity profile data
   - **Benefit**: Further separation of identity from business operational data

6. **🔄 Simplified Customer Identification**:
   - Replaced normalized document structure with simple customer ID:
     - `DocumentTypeId` (int) + `IdCard` (string) → `CustomerId` (int)
   - **Removed**: DocumentType entity, configuration, DTOs, and controller
   - **Rationale**: Simplified identification using single customer reference
   - **Benefit**: Cleaner design, reduced complexity, easier integration with customer systems

7. **Enhanced Relationships**:
   - Added proper foreign key relationship to `DocumentType`
   - Improved indexing strategy for new field structure

#### **Benefits of Complete Simplification:**
- **🎯 Single Responsibility**: UserProfile now focuses purely on user identity information
- **🔄 Domain Separation**: Business domain and operational logic completely separated from identity concerns
- **⚡ Better Performance**: Fewer columns, fewer indexes, faster queries
- **🧹 Cleaner Design**: No business logic, operational data, or complex normalization mixed with identity data
- **🔧 Easier Maintenance**: Simplified entity with clear, focused purpose
- **📊 Role-Based Access**: Business domains and locations managed through proper authorization mechanisms
- **🌍 Location Flexibility**: Branch/location assignments managed by business services where they belong
- **👤 Simplified Identification**: Single customer ID replaces complex document type normalization
- **🚫 Removed Unused Properties**: Eliminated properties and relationships no longer needed


---

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Enhanced UserProfile System](#enhanced-userprofile-system)
3. [Key Improvements Made](#key-improvements-made)
4. [Database Schema Organization](#database-schema-organization)
5. [Critical Issue Resolution: SQL Server Reserved Words](#critical-issue-resolution-sql-server-reserved-words)
6. [Migration Guide: Identity → Auth Schema](#migration-guide-identity--auth-schema)
7. [Configuration Files Structure](#configuration-files-structure)
8. [Performance Optimizations](#performance-optimizations)
9. [Security Enhancements](#security-enhancements)
10. [Benefits Achieved](#benefits-achieved)
11. [Next Steps](#next-steps)

---

## Project Architecture

### **Technology Stack**
- **.NET 9** - Latest framework version with performance improvements
- **Entity Framework Core** - Data access layer with optimized configurations
- **ASP.NET Core Identity** - Comprehensive identity management
- **SQL Server** - Database with optimized schema organization
- **JWT Authentication** - Secure token-based authentication

### **Multi-Domain Business Support**
The Identity API now supports comprehensive user management for:
- **🐾 Veterinary Services** - Pet care, medical records, veterinary licensing
- **🔧 Mechanical Services** - Vehicle repair, parts management, certifications
- **🍽️ Restaurant Operations** - Food service, kitchen management, health certificates
- **✂️ BarberShop Services** - Personal care, styling, professional licensing
- **📊 Accounting & Finance** - Financial management, reporting, certifications
- **📦 Inventory Management** - Stock control, warehouse operations
- **💰 Sales Operations** - Customer management, transaction processing
- **🛒 Purchasing** - Vendor management, procurement processes
- **🎁 Loyalty Programs** - Customer rewards, point systems
- **🛠️ Technical Support** - Help desk, issue tracking, resolution

### **Project Structure**
```
src/Services/Identity/Identity.API/
├── Controllers/           # API endpoints (v1, v2, v3)
│   └── v3/               # Latest version with enhanced UserProfile
├── Entities/             # Domain entities with comprehensive UserProfile
├── Services/             # Business logic services with profile scoring
├── Persistence/          # Data access and configurations
│   └── Configurations/   # Enhanced EF configurations with indexing
├── Interfaces/           # Service contracts
├── Dtos/                # Enhanced DTOs for profile management
├── Models/              # View models and responses
├── Extensions/          # Service registration extensions
└── Helpers/             # Utility classes
```

---

## Enhanced UserProfile System

### **🎯 Focused User Profile Features**

#### **Core Profile Management**
- **Personal Information**: Complete demographic data, contact information, identification
- **Professional Details**: Job roles, departments, company information
- **Address Management**: Full address details with geographic coordinates
- **Communication Preferences**: Multi-channel notification settings (Email, SMS, WhatsApp)

#### **📋 Document Type Management**
```csharp
// Normalized approach with proper foreign key relationships
public int? DocumentTypeId { get; set; }  // Foreign key to DocumentType
public string? IdCard { get; set; }       // Document number/card number

// DocumentType entity (master data)
public class DocumentType : BaseEntity
{
    public string Code { get; set; }      // CI, RUC, PASSPORT, etc.
    public string Name { get; set; }      // Display name
    public string? CountryCode { get; set; } = "EC";
    public bool IsActive { get; set; } = true;
}
```

#### **🔄 Business Domain Management (Moved to Authorization)**
Previously, business domain support was handled through boolean flags in UserProfile. This has been **completely removed** and should now be managed through:

```csharp
// Business domains now managed through:
// 1. ASP.NET Core Identity Roles
await userManager.AddToRoleAsync(user, "VeterinaryUser");
await userManager.AddToRoleAsync(user, "MechanicalUser");

// 2. Claims-based authorization
var claims = new List<Claim>
{
    new("business_domain", "veterinary"),
    new("business_domain", "mechanical")
};
await userManager.AddClaimsAsync(user, claims);

// 3. Domain-specific services
// Each business domain service manages its own user associations
```

#### **Simplified Custom Properties**
```csharp
// Single JSON field for all custom properties
[Column(TypeName = "nvarchar(max)")]
public string? CustomProperties { get; set; }

// Can store any custom data as JSON:
// {
//   "preferences": { "theme": "dark", "language": "es" },
//   "settings": { "notifications": true, "tips": false },
//   "metadata": { "onboarding_completed": true }
// }
```

#### **📋 Simplified Customer Identification**
```csharp
// Simple customer reference approach
public int? CustomerId { get; set; }  // Direct reference to customer system

// Benefits:
// - No complex normalization with DocumentType entity
// - Direct integration with existing customer systems
// - Simpler queries and relationships
// - Reduced maintenance overhead
```

#### **🔄 Customer Management (Recommended Approach)**
Customer identification and document management should now be handled by dedicated customer services:

```csharp
// Customer service handles document types and validation
public interface ICustomerService
{
    Task<CustomerDto> GetCustomerAsync(int customerId);
    Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto customer);
    Task<bool> ValidateCustomerDocumentAsync(string documentType, string documentNumber);
}

// UserProfile maintains simple reference
userProfile.CustomerId = customer.Id;
```

---

### **📊 API Endpoints**

#### **Core Profile Management**
```http
GET    /api/v3/userprofile/{userId}                    # Get user profile
PUT    /api/v3/userprofile/{userId}                    # Update user profile
GET    /api/v3/userprofile/{userId}/completion-score   # Get completion score
GET    /api/v3/userprofile/incomplete                  # Get incomplete profiles (Admin)
```

#### **Customer Identification Management (Recommended Approach)**
Customer and document management should now be handled by dedicated customer services:
```http
# Customer service endpoints (separate microservice)
GET    /api/v3/customers/{customerId}                 # Get customer details
POST   /api/v3/customers                              # Create new customer
PUT    /api/v3/customers/{customerId}                 # Update customer
GET    /api/v3/customers/{customerId}/documents       # Get customer documents
POST   /api/v3/customers/{customerId}/documents       # Add customer document
```
````````

### **🔄 Simplified UserProfile Schema Structure**

```sql
-- Completely simplified UserProfile table structure
CREATE TABLE Auth.UserProfile (
    Id int IDENTITY(1,1) PRIMARY KEY,
    AppUserId int NOT NULL,
    
    -- Personal Information
    FirstName nvarchar(100) NULL,
    LastName nvarchar(100) NULL,
    PhoneNumber nvarchar(20) NULL,
    MobileNumber nvarchar(15) NULL,
    DateOfBirth datetime2 NULL,
    Gender nvarchar(10) NULL,
    
    -- 🔄 Simplified: Single customer reference
    CustomerId int NULL,                  -- Simple reference to customer system
    
    -- Address Information
    Address nvarchar(200) NULL,
    City nvarchar(100) NULL,
    Province nvarchar(100) NULL,
    Country nvarchar(100) DEFAULT 'Ecuador',
    PostalCode nvarchar(10) NULL,
    
    -- Professional Information
    Department nvarchar(100) NULL,
    Position nvarchar(100) NULL,
    JobTitle nvarchar(100) NULL,
    Company nvarchar(200) NULL,
    HireDate datetime2 NULL,
    EmployeeId nvarchar(50) NULL,
    Supervisor nvarchar(100) NULL,
    
    -- Application Preferences
    PreferredLanguage nvarchar(50) DEFAULT 'es-ES',
    TimeZone nvarchar(50) DEFAULT 'America/Guayaquil',
    Theme nvarchar(50) DEFAULT 'light',
    DefaultCurrency nvarchar(20) DEFAULT 'USD',
    DateFormat nvarchar(20) DEFAULT 'dd/MM/yyyy',
    TimeFormat nvarchar(20) DEFAULT 'HH:mm',
    NumberFormat nvarchar(20) DEFAULT 'en-US',
    DefaultPageSize int DEFAULT 25,
    ShowAdvancedFeatures bit DEFAULT 0,
    
    -- 🔄 Removed: Location & Branches (moved to business services)
    -- DefaultBranch, DefaultWarehouse, DefaultPointOfSale, DefaultLatitude, DefaultLongitude
    
    -- Communication Preferences
    EmailNotifications bit DEFAULT 1,
    SmsNotifications bit DEFAULT 0,
    WhatsAppNotifications bit DEFAULT 0,
    
    -- Emergency Contact
    EmergencyContactName nvarchar(100) NULL,
    EmergencyContactPhone nvarchar(20) NULL,
    EmergencyContactRelationship nvarchar(100) NULL,
    
    -- 🔄 Removed: All business domain boolean flags
    -- 🔄 Removed: All certification and specialty fields
    
    -- Simplified JSON storage
    CustomProperties nvarchar(max) NULL,  -- Single JSON field for custom data
    
    -- Profile completion tracking
    IsProfileComplete bit DEFAULT 0,
    ProfileCompletedDate datetime2 NULL,
    ProfileCompletionScore int DEFAULT 0,
    
    -- Audit fields from BaseEntity
    CreatedAt datetime2 DEFAULT GETUTCDATE(),
    UpdatedAt datetime2 NULL,
    
    CONSTRAINT FK_UserProfile_AppUser 
        FOREIGN KEY (AppUserId) REFERENCES Auth.Users(Id),
    CONSTRAINT FK_UserProfile_DocumentType 
        FOREIGN KEY (DocumentTypeId) REFERENCES Common.DocumentType(Id)
);
```

### **Migration Strategy for Complete Simplification**

```sql
-- Phase 1: Backup business domain data (if needed for migration to roles/claims)
SELECT AppUserId, 
       CASE WHEN IsVeterinaryUser = 1 THEN 'VeterinaryUser' END as Role1,
       CASE WHEN IsMechanicalUser = 1 THEN 'MechanicalUser' END as Role2,
       CASE WHEN IsRestaurantUser = 1 THEN 'RestaurantUser' END as Role3
       -- ... continue for all business domains
INTO #BusinessDomainBackup
FROM Auth.UserProfile
WHERE IsVeterinaryUser = 1 OR IsMechanicalUser = 1 OR IsRestaurantUser = 1
   -- ... continue for all business domains

-- Phase 2: Migrate business domains to ASP.NET Core Identity Roles
INSERT INTO Auth.UserRoles (UserId, RoleId)
SELECT bd.AppUserId, r.Id
FROM #BusinessDomainBackup bd
JOIN Auth.Roles r ON r.Name IN (bd.Role1, bd.Role2, bd.Role3 /*...*/)
WHERE bd.Role1 IS NOT NULL OR bd.Role2 IS NOT NULL /*...*/;

-- Phase 3: Drop business domain columns
ALTER TABLE Auth.UserProfile DROP COLUMN IsVeterinaryUser;
ALTER TABLE Auth.UserProfile DROP COLUMN IsMechanicalUser;
ALTER TABLE Auth.UserProfile DROP COLUMN IsRestaurantUser;
ALTER TABLE Auth.UserProfile DROP COLUMN IsBarberShopUser;
ALTER TABLE Auth.UserProfile DROP COLUMN IsAccountingUser;
ALTER TABLE Auth.UserProfile DROP COLUMN IsInventoryUser;
ALTER TABLE Auth.UserProfile DROP COLUMN IsSalesUser;
ALTER TABLE Auth.UserProfile DROP COLUMN IsPurchasingUser;
ALTER TABLE Auth.UserProfile DROP COLUMN IsLoyaltyUser;
ALTER TABLE Auth.UserProfile DROP COLUMN IsTechnicalSupportUser;

-- Phase 4: Drop location & branches columns (business operational data)
ALTER TABLE Auth.UserProfile DROP COLUMN DefaultBranch;
ALTER TABLE Auth.UserProfile DROP COLUMN DefaultWarehouse;
ALTER TABLE Auth.UserProfile DROP COLUMN DefaultPointOfSale;
ALTER TABLE Auth.UserProfile DROP COLUMN DefaultLatitude;
ALTER TABLE Auth.UserProfile DROP COLUMN DefaultLongitude;

-- Phase 5: Simplify customer identification
-- Option 1: If you have existing customer system
UPDATE Auth.UserProfile 
SET CustomerId = c.Id
FROM Auth.UserProfile up
JOIN CustomerSystem.Customers c ON c.DocumentNumber = up.IdCard AND c.DocumentTypeCode = dt.Code
JOIN Common.DocumentType dt ON dt.Id = up.DocumentTypeId
WHERE up.DocumentTypeId IS NOT NULL AND up.IdCard IS NOT NULL;

-- Option 2: Create new customer IDs based on existing data
ALTER TABLE Auth.UserProfile ADD CustomerId int NULL;
-- Assign sequential customer IDs or implement your customer ID strategy

-- Phase 6: Drop old document-related columns
ALTER TABLE Auth.UserProfile DROP COLUMN DocumentTypeId;
ALTER TABLE Auth.UserProfile DROP COLUMN IdCard;

-- Phase 7: Drop DocumentType table (if no longer needed elsewhere)
DROP TABLE Common.DocumentType;

-- Phase 8: Update indexes (remove business domain indexes, keep essential ones)
-- This is handled by the new EF Core configuration
```

#### **Benefits of Complete Simplification:**
- **🎯 Single Responsibility**: UserProfile now focuses purely on user identity information
- **🔄 Domain Separation**: Business domain and operational logic completely separated from identity concerns
- **⚡ Better Performance**: Fewer columns, fewer indexes, faster queries
- **🧹 Cleaner Design**: No business logic, operational data, or complex normalization mixed with identity data
- **🔧 Easier Maintenance**: Simplified entity with clear, focused purpose
- **📊 Role-Based Access**: Business domains and locations managed through proper authorization mechanisms
- **🌍 Location Flexibility**: Branch/location assignments managed by business services where they belong
- **👤 Simplified Identification**: Single customer ID replaces complex document type normalization
- **🚫 Removed Unused Properties**: Eliminated properties and relationships no longer needed
