FROM node:16-alpine

WORKDIR /app
COPY ./package.json /app
RUN npm install
COPY . /app
EXPOSE 5000
# RUN redis-server
CMD [ "npm", "start" ]

# docker build -t name .
# docker run -d -p 5000:5000 name
# docker run -it -p 5000:5000 -v /var/run/docker.sock:/var/run/docker.sock docker
