# copy built application to runtime image
FROM node:12.16.1-slim
WORKDIR /app
COPY ./config ./config
COPY ./dist ./dist
COPY ./node_modules ./node_modules

# run in production mode on port 8080
EXPOSE 8080
ENV PORT 8080
ENV NODE_ENV production
CMD [ "node", "dist/app.js" ]