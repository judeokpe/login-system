const express = require('express');
require("dotenv").config();
const session = require('express-session')
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}))
const {checkLoggedIn, byPassLoggin} = require('./middlewares')
app.use(session({
    secret: "my_session_secret",
    resave:true,
    saveUninitialized: false,
    name: "firstSession",
    cookie:{
        maxAge: 10000
    }
}))

app.use((req,res,next)=>{
res.locals.user = req.session.user
next()
})

app.get('/', checkLoggedIn, (req, res)=>{
    res.render('home')
})

app.get('/login', byPassLoggin, (req, res)=>{
    res.render('login', {error:null})
})
app.post('/login', (req, res)=>{
   if(req.body.username ==="jude" && req.body.password==="123"){
    // create user and store login detail 
    req.session.user= {
        id:1, username:'jude', name:"Jude Ifeanyi" 
    }
    res.redirect('/')

   }
    else{
        res.render('login', {error:"wrong credentials"
        })
    }
});

app.get('/logout', (req,res)=>{
    req.session.destroy();
    res.clearCookie('firstSession')
    res.redirect('/')
})

port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Server is connected to port: ${port}`)
})