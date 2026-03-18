# Build stage
FROM node:20-bullseye AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production image (standalone Next.js)
FROM node:20-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production

# If you run with standalone output, copy .next/standalone
# For now, use the default .next output
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public

RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "run", "start"]
