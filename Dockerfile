FROM node:12 as build-client
WORKDIR /app

COPY ./client/package.json ./client/package-lock.json ./
RUN npm ci --no-progress

COPY ./client/src ./src
RUN npm run build

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-server
WORKDIR /app

COPY ./server/src/AltPocket.Web/AltPocket.Web.csproj ./
RUN dotnet restore

COPY ./server/src/AltPocket.Web/ ./
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app

COPY --from=build-server /app/out .
COPY --from=build-client /app/dist ./wwwroot

ENTRYPOINT ["dotnet", "AltPocket.Web.dll"]