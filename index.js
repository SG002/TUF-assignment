const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql2");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'my_app',
    password: '#GitPush@23',
  });

app.get("/user", (req,res)=>{
    let q = `SELECT * FROM code`;
    try{
        connection.query(q, (err,users)=>{
            if(err) throw err;
            res.render("show.ejs", {users});
        });
    } catch(err){
        console.log(err);
        res.send("Some error occured in the DATABASE");
    }

});

app.post("/user", (req,res)=>{
    // Extract form data
    const { username, codeLanguage, stdin, sourceCode } = req.body;

    const timestamp = new Date();

    // Construct SQL query to insert data into database
    const q = `INSERT INTO code (username, codeLanguage, stdin, sourceCode,timestamp) VALUES (?, ?, ?, ?, ?)`;

    // Execute the query
    connection.query(q, [username, codeLanguage, stdin, sourceCode, timestamp], (err, result) => {
        if(err) {
            console.error("Error inserting data:", err);
            res.send("Error inserting data into the database");
        } else {
            console.log("Data inserted successfully");
            console.log(result);
            // Redirect to another page or send some response
            res.redirect("/user"); // Redirect to the /user page to show the inserted data
        }
    });
});

//Page1
app.get("/codeSubmit", (req,res)=>{
    res.render("index1.ejs");
});


app.get("/", (req,res)=>{
    res.send(" Is working");
});

app.listen(3001, ()=>{
    console.log("Listening to the port 3001");
});