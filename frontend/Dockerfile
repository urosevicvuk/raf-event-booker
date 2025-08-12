# Simple development setup
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy config files
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY index.html ./

EXPOSE 5173

# Start dev server with hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]