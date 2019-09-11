## Help Command
dotnet new -h

# Initialize Project
dotnet new sln  
dotnet new classlib -n Domain  
dotnet new classlib -n Application  
dotnet new classlib -n Persistence  
dotnet new webapi -n API  

# Add Projects to sln
dotnet sln add Domain/  
dotnet sln add Application/  
dotnet sln add Persistence/  
dotnet sln add API/  
dotnet sln list // to see projects added to sln

# Create the Project References
// cd to Application  
dotnet add reference ../Domain/  
dotnet add reference ../Persistence/  
// cd to API  
dotnet add reference ../Application/  
// cd to Persistence  
dotnet add reference ../Domain/
