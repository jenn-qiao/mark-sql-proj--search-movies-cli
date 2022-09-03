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
    let searchTerm = readlineSync.question('choose an option: search for a movie [type movie], see favourites [press 2], or press q to quit [press q] ')
    try{
        while (searchTerm !== 'q') {
            if (searchTerm !== '2') {
        const text = "SELECT id, name, date, runtime, budget, revenue, vote_average, votes_count FROM movies WHERE LOWER(name) like LOWER($1) AND kind = 'movie' ORDER BY date DESC LIMIT 10"
        const values = [`%${searchTerm}%`]

        const res = await client.query(text,values);
        console.table(res.rows);
        let addToFavourite = readlineSync.question('Add movie to favourite? y/n ')
            if (addToFavourite === 'y') {
                const rowNumber = readlineSync.question('Choose row number from 0 to 9 to add movie to favourites ')
       const favRow = res.rows[rowNumber]
// console.log(favRow['id'])
                const textFav = "INSERT INTO favourites (movie_id, name) VALUES ($1, $2)"
                const valuesFav = [favRow.id, favRow.name]
        
                await client.query(textFav,valuesFav);
                // console.table(favTable.rows);
               console.log(`${favRow.name} added to favourites`)
            } 

        searchTerm = readlineSync.question('search another movie or press q to quit ')
        
        
    } else if (searchTerm == '2') {
const text = "SELECT * FROM favourites" 
const res = await client.query(text)
console.table(res.rows)
searchTerm = readlineSync.question('press q to quit [q] ')

    }
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

