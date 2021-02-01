## Help Command
dotnet new -h

## Shortcuts
Quickfix: Ctrl + .  
Open Package Console: Ctrl + Shift + p

# Setup  

## Initialize Project
dotnet new sln  
dotnet new classlib -n Domain  
dotnet new classlib -n Application  
dotnet new classlib -n Persistence  
dotnet new webapi -n API  

## Add Projects to sln
dotnet sln add Domain/  
dotnet sln add Application/  
dotnet sln add Persistence/  
dotnet sln add API/  
dotnet sln list // to see projects added to sln

## Create the Project References
// cd to Application  
dotnet add reference ../Domain/  
dotnet add reference ../Persistence/  
// cd to API  
dotnet add reference ../Application/  
// cd to Persistence  
dotnet add reference ../Domain/

## Run Application
dotnet run -p API/

## EF Core Commands
```
// Add Migration
dotnet ef migrations add InitialCreate -p Persistence/ -s API/ // -s sets API to startup project
// Apply Migration
dotnet ef database update

// Remove Last Migration
dotnet ef migrations remove

// Create database  
// To get help: dotnet ef database -h

// Generate Migration Script (FIRST create/add migration)
dotnet ef migrations script -p Persistence/ -s API/ -o outputFileName

Drop database:
dotnet ef database drop -p Persistence/ -s API/
```

## Create React App
**npx create-react-app client-app --use-npm --typescript** // use typescript
```
// Now it is:
npx create-react-app client-app --template typescript
```

## Add React Router
cd into client-app and do: **npm install react-router-dom**

## Add React-Final-Form
npm install react-final-form final-form

## User Secrets  
1) dotnet user-secrets // gives list of options we can use
2) In API csproj: Add UserSecretsId
```
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>netcoreapp2.2</TargetFramework>
    <UserSecretsId>86c2f9d7-e81c-4fcb-bb6b-01da04728824</UserSecretsId>
    <AspNetCoreHostingModel>InProcess</AspNetCoreHostingModel>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.App" />
    <PackageReference Include="Microsoft.AspNetCore.Razor.Design" Version="2.2.0" PrivateAssets="All" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\Application\Application.csproj" />
    <ProjectReference Include="..\Infrastructure\Infrastructure.csproj" />
  </ItemGroup>

</Project>
```
3) In cmd: dotnet user-secrets set "TokenKey" "super secret key" -p API/

### List secrets
dotnet user-secrets list -p API/
