Deno.serve(async (req) => {

    if (req.method === "OPTIONS") {
        return new Response(null, {
              headers: {
                      "Access-Control-Allow-Origin": "*",
                              "Access-Control-Allow-Headers":
                                        "authorization, x-client-info, apikey, content-type",
                                                "Access-Control-Allow-Methods":
                                                          "POST, OPTIONS",
                                                                },
});
}

try {

const accessToken =
Deno.env.get("MP_ACCESS_TOKEN");

if (!accessToken) {

return new Response(
JSON.stringify({
error:
"MP_ACCESS_TOKEN no configurado."
}),
{
status: 500,
headers: {
"Content-Type":
"application/json",
"Access-Control-Allow-Origin":
"*",
"Access-Control-Allow-Headers":
authorization, x-client-info, apikey, content-type",
"Access-Control-Allow-Methods":
"POST, OPTIONS",
},
}
);

}

const body =
await req.json();

const userId =
body.user_id ?? "";

const mpResponse =
await fetch(
"https://api.mercadopago.com/checkout/preferences",
{
method: "POST",
headers: {
Authorization:
`Bearer ${accessToken}`,
"Content-Type":
"application/json",
},
body: JSON.stringify({

items: [
{
title:
"Ticket",
quantity: 1,
currency_id:
"ARS", unit_price: 5000,
},
],

external_reference:
userId,

notification_url:
"https://qexgbswdbwlpydolpcll.supabase.co/functions/v1/mp-webhook",

back_urls: {
success:
"https://google.com",
failure:
"https://google.com",
pending:
"https://google.com",
},

auto_return:
"approved",

}),
}
);

const preference =
await mpResponse.json();

return new Response(
JSON.stringify(
preference
),
{
ñstatus: 200,
headers: {
"Content-Type":
ñ"application/json",
"Access-Control-Allow-Origin":
"*",
"Access-Control-Allow-Headers":
"authorization, x-client-info, apikey, content-type",
"Access-Control-Allow-Methods":
"POST, OPTIONS",
},
}
);

} catch (err) {

return new Response(
JSON.stringify({
error:
err instanceof Error
? err.message
: "Error desconocido",
}),
{
status: 500,
headers: {
"Content-Type":
"application/json",
"Access-Control-Allow-Origin":
"*",
"Access-Control-Allow-Headers":
"authorization, x-client-info, apikey, content-type",
"Access-Control-Allow-Methods":
"POST, OPTIONS",
},
}
);

}
});
