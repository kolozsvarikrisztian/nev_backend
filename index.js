const express = require("express");
const app = express();
const mysql = require("mysql2");

const monthNames = ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"];

function getConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Passw123',
        database: 'nevnap'
    });
}


app.get("/", (req, res) => {
    res.send("/api/nevnapok az útvonal!");
})

app.get("/api/nevnapok", (req, res) => {
    if (req.query.nap) {
        const napQuery = req.query.nap;
        const ho = napQuery.split("-")[0];
        const nap = napQuery.split("-")[1];
        const connection = getConnection();
        connection.connect();
        const sql = 'SELECT * FROM nevnap WHERE ho = ? AND nap = ?';
        connection.query(sql, [ho, nap], (error, results, fields) => {
            console.log(error);
            if (results[0]) {
                const valasz = {
                    "datum":monthNames[results[0].ho - 1] + " " + results[0].nap + ".",
                    "nevnap1":results[0].nev1,
                    "nevnap2":results[0].nev2
                };
                res.send(valasz);
            }
            else {
                res.send({"hiba":"nincs találat"});
            }

        });
    }
    else if (req.query.nev) {
        const nev = req.query.nev;
        const connection = getConnection();
        connection.connect();
        const sql = 'SELECT * FROM nevnap WHERE nev1 = ? OR nev2 = ?';
        connection.query(sql, [nev, nev], (error, results, fields) => {
            console.log(error);
            if (results[0]) {
                const valasz = {
                    "datum":monthNames[results[0].ho - 1] + " " + results[0].nap + ".",
                    "nevnap1":results[0].nev1,
                    "nevnap2":results[0].nev2
                };
                res.send(valasz);
            }
            else {
                res.send({ "hiba":"nincs találat" });
            }
        });
    }
    else {
        res.send({ "minta1":"/?nap=12-31","minta2":"/?nev=Szilveszter" })
    }
});

app.listen(5000);