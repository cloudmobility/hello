FROM hayd/alpine-deno:1.6.0

RUN apk update
RUN apk upgrade
RUN apk add curl 

WORKDIR /app

ENV DENO_PLUGIN_DIR="${DENO_DIR}/plugin/"

USER deno

ADD . .

RUN deno cache --unstable mod.ts

CMD ["run", "--no-check", "--allow-plugin", "--allow-write", "--unstable", "-A", "mod.ts" ]
