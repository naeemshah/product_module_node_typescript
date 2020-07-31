
# FROM node:10-slim

# USER node

# RUN mkdir -p /home/node/app

# WORKDIR /home/node/app
# COPY --chown=node package*.json ./

# RUN npm install
# COPY --chown=node . .

# RUN npm run build
# # ENV HOST=0.0.0.0

# EXPOSE 3000
# CMD [ "node", "." ]

FROM node:alpine
WORKDIR "/app"
COPY ./package.json ./
RUN npm install nodemon -g
RUN npm install
COPY . .

# ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["npm", "run", "hot_reload"]
