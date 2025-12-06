FROM node:22-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package*.json ./
RUN npm ci

# -------- DEV --------
FROM base AS dev
ENV NODE_ENV=development

COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# -------- BUILD --------
FROM base AS build
ENV NODE_ENV=production
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

# -------- PROD --------
FROM base AS prod
ENV NODE_ENV=production
COPY --from=build /usr/src/app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]