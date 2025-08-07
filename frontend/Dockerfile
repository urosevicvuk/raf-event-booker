# Use Node.js 20 Alpine (latest stable with better Vite compatibility)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Set environment variables for better Docker compatibility
ENV NODE_ENV=development
ENV VITE_HMR_PORT=5173

# Expose port 5173 (Vite's default)
EXPOSE 5173

# Start the development server with explicit host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]