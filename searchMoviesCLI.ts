import { question } from "readline-sync";
import { Client } from "pg";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.


async function searchMovie() {
    var readlineSync = require('readline-sync');
    const client = new Client({ database: 'omdb' });
    await client.connect();
    console.log("Welcome to search-movies-cli!");
    let searchTerm = readlineSync.question('search for a movie (or press q to quit) ')
    try{
        while (searchTerm !== 'q') {
        const text = "SELECT id, name, date, runtime, budget, revenue, vote_average, votes_count FROM movies WHERE LOWER(name) like LOWER($1) AND kind = 'movie' ORDER BY date DESC LIMIT 10"
        const values = [`%${searchTerm}%`]

        const res = await client.query(text,values);
        console.table(res.rows);
        searchTerm = readlineSync.question('search another movie (or press q to quit) ')
    }
    
}
catch(err) {
    console.log(`${err}`)
}
finally{
    await client.end();
console.log("Client disconnected successfully")
}
}

searchMovie()
// while (searchString !== 'q')
// await client.end();

