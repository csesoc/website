# pulling official base image
FROM node:17.9.0-alpine

# Setting working directory
WORKDIR /app

# Cache and Install dependnecies
COPY package.json package-lock.json ./
RUN npm install 

COPY . .

# exposing ports
EXPOSE 3000

# setting environment variables
ARG BACKEND_URI
ENV REACT_APP_BACKEND_URI $BACKEND_URI

# npm start
CMD ["npm", "start"]