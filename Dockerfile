FROM node:lts-alpine as builder
WORKDIR /lims-frontend
# cache step
COPY package.json /lims-frontend/package.json
RUN npm install
# build
COPY ./ /lims-frontend
RUN npm run build:prod

# TODO -- verify nginx  and deployment setup, then setup nginx conf
# TODO --  then add the nginx conf to the site

# TODO -- Otherwise add nginx-swag


#FROM nginx as production
#RUN mkdir /web
#COPY --from=builder /lims-frontend/dist/ /web
#COPY --from=builder /lims-frontend/build/nginx.conf /etc/nginx/nginx.conf
#EXPOSE 80
