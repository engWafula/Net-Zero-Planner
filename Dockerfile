
# Production image, copy all the files and run next
FROM node:18.19.1 AS runner
WORKDIR /app

# Copy package.json and install all dependencies (including dev dependencies)
COPY package.json .

# Install all dependencies, including dev dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Command to start the application
CMD ["npm", "start"]