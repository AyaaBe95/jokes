'use strict';

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
const cors = require('cors');

//server setup
const app = express();

//middlewares
require('dotenv').config();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

//routes
app.get('/',homeHndler);
app.post('/favorites',addfavoritesHandler);
app.get('/favorites',addfavoritesHandler2);
app.get('/details/:id', detailsHandler);
app.put('/update/:id', updateDetails);
app.delete('/delete/:id', deleteCard);




//handler
function homeHndler(req,res){
    let url='https://official-joke-api.appspot.com/jokes/programming/ten';
    superagent.get(url)
    .then((data)=>{
        let jokesData = data.body.map((item)=>{
            return new Joke(item)
        })

        res.render('pages/home',{data:jokesData})
        console.log(jokesData)
    })


}

function addfavoritesHandler(req, res){
    let {joke_id,type,setup,punchline}=req.body;
    let SQL = 'INSERT INTO jokes (joke_id, type, setup, punchline) VALUES ($1, $2, $3, $4) RETURNING id; ';
    let values=[joke_id,type,setup,punchline]

    client.query(SQL, values).then(() => {
      res.redirect('/favorites');
    })
  }
  
  function addfavoritesHandler2(req, res){
    var SQL = 'SELECT * FROM jokes;';
  
    client.query(SQL).then(results => {
        console.log(results.rows)
      res.render('pages/favorites', {
        data: results.rows
});
    })
  }

  function detailsHandler(req,res){
    var sql = 'SELECT * FROM jokes WHERE id=$1;';
    var values = [req.params.id];

    client.query(sql,values)
    .then((results)=>{
        res.render('pages/details',{data:results.rows[0]});

    })

}

function updateDetails(req,res){

}

function deleteCard(req,res){
    
}


//constructor
function Joke(data) {
    this.joke_id = data.id;
    this.type = data.type;
    this.setup = data.setup;
    this.punchline = data.punchline;
  }

//database setup
const client = new pg.Client(process.env.DATABASE_URL);

// const client = new pg.Client({
// 	connectionString: process.env.DATABASE_URL,
// 	ssl: { rejectUnauthorized: false },
// });


const PORT = process.env.PORT || 3030;

client.connect().then(() => {
	app.listen(PORT, () => {
		console.log(`listening on PORT ${PORT}`);
	});
});
