FROM node:16.14.0
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 8000
CMD npm start
