const url = Deno.args[0];
const times = Number(Deno.args[1]);
const method = Deno.args[2] || "GET";
const body = Deno.args[3] || {};

for (let i = 0; i < times; i++) {
  fetch(url, {
    method,
    body: JSON.stringify(body),
  })
    .then((r) => r.text())
    .then(console.log)
    .catch(console.error);
}
