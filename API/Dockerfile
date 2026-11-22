FROM mcr.microsoft.com/dotnet/sdk:10.0 AS builder
WORKDIR /src
COPY ./API.csproj .
RUN dotnet restore API.csproj
COPY . .
RUN dotnet build API.csproj -c Debug -o /src/out

FROM mcr.microsoft.com/dotnet/aspnet:10.0
# The yt-dlp executable downloaded by YoutubeDLSharp needs Python at runtime.
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /src/out .

EXPOSE 8080
CMD ["echo", "API is running"]
ENTRYPOINT ["dotnet", "API.dll"]
