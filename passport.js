const passport = require('passport'),
    GooglePlusTokenStrategy = require('passport-google-plus-token'),
    UserSchema = require('./models/user-model');

var config = require('./config.json');

// Google OAuth Strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: config.google_clientID,
    clientSecret: config.google_clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let email = profile.emails[0].value
        let query = { $or: [ { _id: profile.id }, { email: email } ] }
        console.log(`Google Sign in Query - ${JSON.stringify(query)}`);
        const existingUser = await UserSchema.findOne(query);
        if (existingUser) {
            console.log(`User already exist ${existingUser._id}`);
            return done(null, existingUser);
        }
        var obj = {
            'loginType': 'google',
            'username': email.split('@')[0],
            'email': email,
            '_id': profile.id
        };
        const newUser = new UserSchema(obj);
        console.log(`Creating User - ${JSON.stringify(newUser)}`);
        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message);
    }
}));