# Use a lightweight Node.js image
FROM node:18.16.1-alpine

# Set the working directory in the container
WORKDIR /app

# Install dependencies
RUN apk update && \
    apk add --no-cache \
    libtool \
    automake \
    autoconf \
    nasm \
    zlib \
    g++ \
    make \
    lcms2-dev \
    bash \
    libpng-dev

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install npm dependencies
RUN npm install --quiet

# Copy the rest of the application code
COPY ./ /app

# Expose necessary ports
EXPOSE 8888

# Set environment variables
ENV NUXT_HOST=0.0.0.0

# Run the application
CMD ["sh", "-c", "export NODE_OPTIONS=--openssl-legacy-provider && npm run start"]
