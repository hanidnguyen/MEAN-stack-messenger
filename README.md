This backend folder can be anywhere since it is not related to angular front end in any way.
Placed it in the mean-course folder simply for learning.

____________

This is a RESTful API project.

____________

To connect to Mongodb create a new cluster on mongodb (there is a free version) and add a new member for database access (save your auto-generated password, you will need it to connect to the database later).
Free version does not allow you to see your database on the web so connect to your database with a MongoDB shell, follow its instruction to download and run the lines in your computer command prompt.
Now to connect your express app to the database, import mongoose and connect to your database using mongoose.connect.
Link is provided through yourMongoDB (on website) -> connect -> connect your application. Replace <password> with your saved database user password.



**IMPORTANT**
If you get error on connecting to your database, you might need to update your IP address in Network Access on the mongodb website.

To connect to database:
1. cd to mongoshell/bin
2. use in computer terminal:
mongosh "mongodb+srv://cluster0.vqyni.mongodb.net/myFirstDatabase" --apiVersion 1 --username Hani

To use the interactive Javascript interface on terminal:

show dbs: list all database
use [database-name]: to switch to a database
show tables: list all tables
db.[table-name].find(): list all entries in table

To observe real-time front-end:
  run 'ng serve' in terminal in project folder

To start server:
  run 'npm run start:server' in terminal in project folder

Notes:
SPA Authentication - different from traditional full-stack app 
- Traditional full-stack app would use a session for this. So when a user login on the server a session is created and session ID is returned in a cookie to client, so the browser can store it there. Then for every future request, we can automatically send that cookie and validate on the server, grant access if cookie ID matches a valid sessions on the server.
-> This approach however does not work as our SPA backend is stateless and decoupled (separated) from the frontend. So front-end only send requests to these URLs but our server does not store any information about the app, therefore server also doesn't store any sessions.

- Our single page application will instead allow server to create a JSON Web Tokens (a hashed long string that can't be faked or changed or guessed) that only the server can validate upon a successful login. We then send token to front-end to store in the angular app, then attach it to all future requests that is sent back to backend.


