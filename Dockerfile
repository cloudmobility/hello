
FROM hayd/alpine-deno:1.6.0

WORKDIR /app

ENV DENO_PLUGIN_DIR="${DENO_DIR}/plugin/"

USER deno

ADD . .

RUN deno cache --unstable mod.ts

CMD ["run", "--no-check", "--allow-plugin", "--allow-write", "--unstable", "-A", "mod.ts" ]
