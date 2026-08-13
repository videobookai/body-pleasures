## Go live
Here's what needs to change to go live:

Backend (backend/miss-v-admin/.env):

PAYPAL_MODE="sandbox" → "live"
PAYPAL_CLIENT_ID → your live Client ID
PAYPAL_SECRET → your live Secret
Frontend (frontend/.env.local):

NEXT_PUBLIC_PAYPAL_SANDBOX=true → false
NEXT_PUBLIC_PAYPAL_CLIENT_ID → your live Client ID
To get your live credentials, go to developer.paypal.com → Apps & Credentials → switch to Live tab → select or create your app.

Please share your live PayPal Client ID and Secret and I'll update both env files. (Keep in mind these .env files should never be committed to git — make sure they're in .gitignore.)

Also one thing to note: NEXT_PUBLIC_PAYPAL_SECRET is sitting in your frontend .env.local but your frontend code doesn't actually use it, which is good — PayPal secrets should only ever be on the backend.

## Others
The simplest setup is:

The person receiving payments needs a PayPal Business account (free to create at paypal.com). Once they have one, they can log into developer.paypal.com with that same account — it's not a separate "developer account", it's just the developer portal for any PayPal account.

From there they:

Go to Apps & Credentials → switch to Live
Create an app → get their Client ID and Secret
Share those credentials with you to put in the backend .env
Payments captured through those credentials go directly into their PayPal Business account.

If you need a multi-merchant setup (e.g. multiple sellers on the platform), PayPal has a Commerce Platform / Partners API that lets you onboard merchants via OAuth so they authorize your platform to process on their behalf — but that's significantly more complex to implement.

For a single merchant (one person receiving all payments), the simple approach above is the right call. They just need to send you their live Client ID and Secret.


### Details
Backend PayPal vars → Strapi Cloud
Go to cloud.strapi.io
Open your project (light-laughter-...)
Click Settings → Variables
Update/add these three:

PAYPAL_CLIENT_ID      = <live client id>
PAYPAL_SECRET         = <live secret>
PAYPAL_MODE           = live
Click Save then Redeploy (top right)
Frontend PayPal vars → wherever your frontend is deployed
Your frontend .env.local has NEXT_PUBLIC_PAYPAL_CLIENT_ID and NEXT_PUBLIC_PAYPAL_SANDBOX. Where is the frontend hosted? (Vercel, Netlify, Render, etc.?)

If Vercel: Project → Settings → Environment Variables
If Netlify: Site → Site configuration → Environment variables
Update these two:


NEXT_PUBLIC_PAYPAL_CLIENT_ID  = <live client id>
NEXT_PUBLIC_PAYPAL_SANDBOX    = false
You do NOT need to edit the local .env files — those are only used when running the app locally. Production env vars are managed entirely through the hosting dashboards.