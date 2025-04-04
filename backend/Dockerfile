# DOCKERFILE FOR API SERVER

FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the port the server runs on
EXPOSE 1000

# Start the application
CMD ["npm", "run", "dev"]