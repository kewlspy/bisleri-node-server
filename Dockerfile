# bcrypt is a native module; build it in a stage that has a toolchain,
# then ship only the compiled result.
FROM node:20-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY app.js ./
COPY api ./api
COPY auth ./auth
COPY config ./config
USER node
EXPOSE 3000
CMD ["node", "app.js"]
