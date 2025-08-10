# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "run", "start"]
