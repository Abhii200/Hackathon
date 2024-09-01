# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /backend

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that your application will run on
EXPOSE 5000

# Start the Node.js application
CMD ["npm", "run", "dev"]
