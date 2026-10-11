FROM oven/bun:1.4.2-slim AS build
WORKDIR /app
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM scratch AS artifact
LABEL org.opencontainers.image.source="https://github.com/zeepkist/streamkist"
COPY .output/public /site

FROM scratch AS production
LABEL org.opencontainers.image.source="https://github.com/zeepkist/streamkist"
COPY --from=build /app/.output/public /site
