# pulling official base image
FROM node:13.12.0-alpine

# Setting working directory
WORKDIR /app

# Cache and Install dependnecies
COPY package.json .
RUN npm install 

COPY . .

# exposing ports
EXPOSE 3000

# npm start
CMD ["npm", "start"]