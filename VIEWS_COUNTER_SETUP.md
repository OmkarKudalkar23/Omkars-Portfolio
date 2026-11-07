# Portfolio view counter setup

The `/views` page stores its total in MongoDB Atlas. The website increments one visit per browser tab session in the `portfolio.counters` collection, using a single atomic MongoDB update.

1. Rotate the MongoDB database user's password in Atlas because the old password was shared in chat.
2. Confirm the database user has `readWrite` access to the `portfolio` database.
3. In Vercel, open the portfolio project → **Settings → Environment Variables**. Add `MONGODB_URI` with the fresh Atlas connection string. Set the database name in the URI to `portfolio`, and apply it to Production (and Preview if needed).
4. Ensure the Atlas Network Access list permits connections from the Vercel deployment.
5. Save the variable and redeploy. The `counters` collection and `portfolio-views` document are created on the first visit.

The MongoDB URI is only read by the server. Do not add it to client code or commit it to Git.
