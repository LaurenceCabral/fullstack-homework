# Homework 3

Use Node.js 22 or newer. The commands below start from the repository's main folder.

## Express tutorial (Parts 2–6)

For the tutorial, I chose the MDN Express Local Library app and completed Parts 2–6. The code is adapted from [MDN's tutorial and reference code](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/skeleton_website).

Make sure MongoDB is running locally, then run:

```sh
cd hw3/express
npm install
npm run populate
npm start
```

`npm run populate` adds the sample books and authors. Only run it once on an empty database so the records aren't duplicated.

Open http://localhost:3000/catalog to use the app.

The app uses `mongodb://127.0.0.1:27017/local_library` by default. If you're using MongoDB Atlas or another database, run this in the same terminal before the populate and start commands:

```sh
export MONGODB_URI='your MongoDB connection string'
```

## Rick and Morty exercise (Option 2)

For the exercise, I chose the Rick and Morty API with Pug. In a separate terminal, run:

```sh
cd hw3/exercises
npm install
npm start
```

Open http://localhost:3001/home.

- `/characters` shows the first 100 characters with their pictures, species, and status.
- `/species` lists the characters in each species and the number in each group.
- `/locations` shows the number of locations for each type.

This app needs an internet connection. It doesn't need an API key or database.

Run `npm install` in each app's folder to install its packages. The `.gitignore` files keep `node_modules/` out of Git.
