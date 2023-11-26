FROM mcr.microsoft.com/dotnet/sdk:8.0 AS builder
WORKDIR /src
COPY ./API.csproj .
RUN dotnet restore API.csproj
COPY . .
RUN dotnet build API.csproj -c Debug -o /src/out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=builder /src/out .

EXPOSE 8080
CMD ["echo", "API is running"]
ENTRYPOINT ["dotnet", "API.dll"]
