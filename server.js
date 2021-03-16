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
app.get('/',homeHandler);
app.post('/favorites',favoritesHandler);
app.get('/favorites',favoritesHandler2);
app.get('/details/:id',detailsHandler);
app.delete('/delete/:id',deleteHandler);
app.put('/update/:id',updateHandler);








//handler
function homeHandler(req,res){
  let url='https://official-joke-api.appspot.com/jokes/programming/ten';
  superagent.get(url)
  .then((data)=>{
    let jokeData= data.body.map((item)=>{
      return new Joke(item);
    })
    res.render('pages/home',{data:jokeData})
  })
}

function favoritesHandler(req,res){
  let {type,setup,punchline}=req.body;
  let sql='INSERT INTO jokes (type,setup,punchline) VALUES ($1,$2,$3);';
  let values=[type,setup,punchline];
  client.query(sql,values)
  .then((results)=>{
    res.redirect('/favorites')
  })
}


function favoritesHandler2(req,res){
  let sql='SELECT * FROM jokes;';
  client.query(sql)
  .then((results)=>{
    res.render('pages/favorites',{data:results.rows});
  })

}

function detailsHandler(req,res){
  let id=req.params.id;
  let sql='SELECT * FROM jokes WHERE id=$1;';
  let value=[id];
  client.query(sql,value)
  .then((results)=>{
    res.render('pages/details',{data:results.rows[0]})
  })
}

function deleteHandler(req,res){
  let id=req.params.id;
  let sql='DELETE FROM jokes WHERE id=$1;';
  let value=[id];
  client.query(sql,value)
  .then((results)=>{
    res.redirect('/favorites')
  })
}

function updateHandler(req,res){
  let id=req.params.id;
  let {type,setup,punchline}=req.body;
  let sql='UPDATE jokes SET type=$1,setup=$2,punchline=$3 WHERE id=$4'
  let values=[type,setup,punchline,id];
  client.query(sql,values)
  .then((results)=>{
    res.redirect('/favorites')
  })
}

//constructor
function Joke(data) {
  this.idx = data.id;
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
