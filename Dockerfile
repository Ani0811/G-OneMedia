# Use a lightweight Node.js 22 image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Set environment variable to production
ENV NODE_ENV=production

# Expose the API port
EXPOSE 3001

# Start the Express API server
CMD ["npm", "run", "start"]
