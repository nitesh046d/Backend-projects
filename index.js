const { faker } = require('@faker-js/faker');

const mysql = require('mysql2');
const express = require('express');
const app = express();
const Path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const port = 8080;
app.set("view engine", "ejs");
app.set("views", Path.join(__dirname, "/views"));

// Create the connection to database
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'Data',
    password: 'nitesh@46'
});



let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ];
}


// try {
//     conn.query(q, [userData], (err, result) => {
//         if (err) throw err;

//         console.log(result);
//     });
// } catch (err) {
//     console.log(err);
// }

// conn.end();
app.get("/", (req, res) => {
    let q = `select count(*) from user`;
    try {
        conn.query(q, (err, result) => {
            if (err) throw err;

            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB")
    }

});

app.get("/user", (req, res) => {
    let q = `select * from user`;
    try {
        conn.query(q, (err, result) => {
            if (err) throw err;


            res.render("users.ejs", { result });

        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB")
    }

});
// Edit Route
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `select * from user where id = '${id}'`;
    try {
        conn.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];


            res.render("edit.ejs", { user });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB")
    }
});
// Update (DB) Route
app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password: formpass, username: newUsername } = req.body;
    let q = `select * from user where id ='${id}'`;
    try {
        conn.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (formpass != user.password) {
                res.send("Wrong Password");
            } else {
                let q2 = `update user set username = '${newUsername}' where id = '${id}'`;
                conn.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/user");
                })
            }

        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB")
    }
});
app.post("/user", (req, res) => {

    res.render("add.ejs");
});

app.listen(port, () => {
    console.log("server is listening to port 8080");
});