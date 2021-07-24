FROM mcr.microsoft.com/dotnet/core/sdk:5.0-buster AS builder
WORKDIR /src
COPY ./API.csproj .
RUN dotnet restore API.csproj
COPY . .
RUN dotnet build API.csproj -c Debug -o /src/out

FROM mcr.microsoft.com/dotnet/core/aspnet:5.0-buster-slim
WORKDIR /app
COPY --from=builder /src/out .

EXPOSE 80
ENTRYPOINT ["dotnet", "API.dll"]