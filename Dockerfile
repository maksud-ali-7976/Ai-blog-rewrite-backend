FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build
ARG PORT
EXPOSE ${PORT:-8080}

CMD ["bun", "run","start"]