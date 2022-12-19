// grab our client with destructuring from the export in the index.js
const { 
    client,
    getAllUsers,
    createUser
} = require('./index');

// this function should call a query which drops all tables from our database
async function dropTables() {
    try {
        console.log("Starting to drop tables...");

        await client.query(`
            DROP TABLE IF EXISTS users;
        `);

        console.log("Finished dropping tables.");
    } catch (error) {
        console.log("Error dropping tables.");
        throw error; // we pass the error up to the function that calls dropTables
    }
}

// this function should call a query which creates all tables for our database
async function createTables() {
    try {
        console.log("Starting to build tables...");
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL
            );
        `);
        console.log("Finished building tables.");
    } catch (error) {
        console.log("Error building tables.");
        throw error; // we pass the error up to the function that calls createTables
    }
}

async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        const albert = await createUser({ username: 'albert', password: 'bertie99' });
        const albertTwo = await createUser({ username: 'albert', password: 'imposter_albert' });

        console.log(albert);

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users.");
        throw error;
    }
}

async function rebuildDB() {
    try {
        // connect the client to the database, finally
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch (error) {
        console.error(error);
    }
}

async function testDB() {
    try {
        console.log("Starting to test database...");

        const users = await getAllUsers();
        console.log("getAllUsers: ", users);

        console.log("Finished database tests.")
    } catch (error) {
        console.log("Error testing database.");
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());