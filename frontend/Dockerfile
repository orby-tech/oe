FROM node:16.15.1-alpine AS builder

WORKDIR /app

COPY ./common ../common/
COPY ./frontend/package-lock.json ./
COPY ./frontend/package.json ./

RUN npm install

COPY ./frontend/ ./

ARG NODE_ENV
ARG VITE_API_URL
ARG VITE_BASE_URL
ARG VITE_IPREGISTRY_API_KEY
ARG VITE_AUTH_SERVER_URL
ARG VITE_POSTAUTH_URL

ENV NODE_ENV ${NODE_ENV}
ENV VITE_API_URL ${VITE_API_URL}
ENV VITE_BASE_URL ${VITE_BASE_URL}
ENV VITE_IPREGISTRY_API_KEY ${VITE_IPREGISTRY_API_KEY}
ENV VITE_AUTH_SERVER_URL ${VITE_AUTH_SERVER_URL}
ENV VITE_POSTAUTH_URL ${VITE_POSTAUTH_URL}

RUN npm run build-demo

FROM node:16.15.1-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
