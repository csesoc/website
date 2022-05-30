# pulling official base image
FROM node:13.14.0-alpine

# Setting working directory
WORKDIR /next

# Cache and Install dependnecies
COPY package.json .
RUN npm install 

COPY . .

# exposing ports
EXPOSE 3001

# setting environment variables
ARG BACKEND_URI
ENV REACT_APP_BACKEND_URI $BACKEND_URI

# npm start
CMD ["npm", "run", "dev"]