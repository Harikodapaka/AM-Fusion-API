const passport = require('passport'),
    GooglePlusTokenStrategy = require('passport-google-plus-token'),
    UserSchema = require('./models/user-model');

// Google OAuth Strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: '2387600941-5u5j008fesmdksobv31dobtv0cs1pv9e.apps.googleusercontent.com',
    clientSecret: 'G7Zhw63sGml15zx7dsT6D4XQ'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let email = profile.emails[0].value
        let query = { $or: [ { _id: profile.id }, { email: email } ] }
        console.log(`Google Sign in Query - ${JSON.stringify(query)}`);
        const existingUser = await UserSchema.findOne(query);
        console.log(`User already exist ${existingUser._id}`);
        if (existingUser) {
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