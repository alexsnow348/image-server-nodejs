# Use the official Node.js image as the base image
FROM node:22

# Set the working directory
WORKDIR /usr/src/app

# Copy the rest of the application code
COPY ./src .

# Install dependencies
RUN npm install


# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.mjs"]