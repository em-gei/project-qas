 # Create image based on the Node 12.18-alpine image from the dockerhub
FROM node:12.18-alpine

# Create a directory where app will be placed
RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app

# Install dependecies
RUN npm install

# Copy all the code to run the app
COPY . /usr/src/app

# Expose the port where app runs in
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]