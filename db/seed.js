// grab our client with destructuring from the export in the index.js
const { 
    client,
    getAllUsers,
    createUser,
    updateUser,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
    getUserById
} = require('./index');

// this function should call a query which drops all tables from our database
async function dropTables() {
    try {
        console.log("Starting to drop tables...");

        await client.query(`
            DROP TABLE IF EXISTS posts;
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
                password varchar(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true
            );
            CREATE TABLE posts (
                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                active BOOLEAN DEFAULT true
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

        const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'Al Bert', location: 'Sidney, Australia' });
        const sandra = await createUser({ username: 'sandra', password: 'imposter_albert', name: 'Just Sandra', location: 'Not tellin' });
        const glamgal = await createUser({ username: 'glamgal', password: 'somethingwitty', name: 'Joshua', location: 'Upper East Side' });

        console.log(albert);

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users.");
        throw error;
    }
}

async function createInitialPosts() {
    try {
        const [albert, sandra, glamgal] = await getAllUsers();

        await createPost({
            authorId: albert.id,
            title: "FirstPost",
            content: "This is my first post. I hope I love writing blogs as much as I love reading them."
        });
    } catch (error) {
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

        console.log("Calling updateUser on users[0].")
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log("Result: ", updateUserResult);

        console.log("Calling getAllPosts");
        const posts = await getAllPosts();
        console.log("Result:", posts);

        console.log("Calling updatePost on posts[0]");
        const updatePostResult = await updatePost(posts[0].id, {
            title: "New Title",
            content: "Updated Content"
        });
        console.log("Result:", updatePostResult);

        console.log("Calling getUserById with 1");
        const albert = await getUserById(1);
        console.log("Result:", albert);

        console.log("Finished database tests.");
    } catch (error) {
        console.log("Error testing database.");
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());