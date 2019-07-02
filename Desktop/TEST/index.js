const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const bodyParser = require('body-parser')
const keys = require('./config/keys')
require('./models/User')
require('./models/Survey')
require('./services/passport')
//const authRoutes = require('./routes/authRoutes')


mongoose.connect(keys.mongoURI,{
    useNewUrlParser:true
})

const app = express()

app.use(bodyParser.json())

app.use(
    cookieSession({
        maxAge:60*24*60*60*1000,
        keys:[keys.cookieKey]
    })
)

app.use(passport.initialize())
app.use(passport.session())

//authRoutes(app)

require('./routes/authRoutes')(app)
require('./routes/billingRoutes')(app)
require('./routes/surveyRoutes')(app)

if(process.env.NODE_ENV === 'production'){
    //Express will serve up production assets like main.js or main.css file
    app.use(express.static('client/build'))

    //Express will serve up index.html file if it doesn't recognize the route
    const path = require('path')
    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Listenining on post 5000')
})