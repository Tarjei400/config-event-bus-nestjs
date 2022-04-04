#FROM gcr.io/distroless/nodejs:16
FROM nodejs:16
COPY ./ /var/application

WORKDIR /var/application

RUN npm run build
CMD npm run start:prod
