FROM node:18.11.0-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "start"]