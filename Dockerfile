# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Development: hot reload via `next dev`, full devDependencies ----
FROM base AS development
ENV NODE_ENV=development
RUN npm install
COPY . .
EXPOSE 6001
CMD ["npm", "run", "dev", "--", "-p", "6001", "-H", "0.0.0.0"]

# ---- Build: compile the Next.js app to a standalone production server ----
FROM base AS build
RUN npm install
COPY . .
RUN npm run build

# ---- Production: only the standalone server output + its runtime deps ----
FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 6001
ENV PORT=6001
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
