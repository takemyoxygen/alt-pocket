FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app

COPY ./server/src/AltPocket.Web/AltPocket.Web.csproj ./
RUN dotnet restore

COPY ./server/src/AltPocket.Web/ ./
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app
COPY --from=build-env /app/out .

ENTRYPOINT ["dotnet", "AltPocket.Web.dll"]