const mongoose = require("mongoose");
const composeWithMongoose =
  require("graphql-compose-mongoose").composeWithMongoose;
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5; // attempts within our LOCK_TIME period
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

let UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: { unique: true },
    },
    account: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    passwordExpires: {
      type: Date,
      required: false,
    },
    loginAttempts: {
      type: Number,
      required: false,
      default: 0,
    },
    lockUntil: {
      type: Number,
      required: false,
    },
    role: {
      type: String,
      required: true,
    },
    sso: {
      type: String,
      required: false,
    },
    sso_sub: {
      type: String,
      required: false,
    },
    locale: {
      type: String,
      required: true,
    },
    zoneInfo: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    lastLoggedIn: {
      type: Date,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

UserSchema.virtual("isLocked").get(function () {
  // check for a future lockUntil timestamp
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.pre("save", function (next) {
  let user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  // compare the hashed password to the one passed in
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    // if there's an error, return it
    if (err) return cb(err);
    // otherwise return whether the password matches or not
    cb(null, isMatch);
  });
};

UserSchema.methods.incLoginAttempts = function (cb) {
  // if we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.update(
      {
        $set: { loginAttempts: 1 },
        $unset: { lockUntil: 1 },
      },
      cb
    );
  }
  // otherwise we're incrementing
  let updates = { $inc: { loginAttempts: 1 } };
  // lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }
  return this.update(updates, cb);
};

UserSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2,
};

UserSchema.statics.getAuthenticated = function (username, password, cb) {
  this.findOne({ username: username }, function (err, user) {
    if (err) return cb(err);
    // make sure the user exists
    if (!user) {
      return cb(null, null, reasons.NOT_FOUND);
    }

    // check if the account is currently locked
    if (user.isLocked) {
      // just increment login attempts if account is already locked
      return user.incLoginAttempts(function (err) {
        if (err) return cb(err);
        return cb(null, null, reasons.MAX_ATTEMPTS);
      });
    }

    // test for a matching password
    user.comparePassword(password, function (err, isMatch) {
      if (err) return cb(err);

      // check if the password was a match
      if (isMatch) {
        // if there's no lock or failed attempts, just return the user
        if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
        // reset attempts and lock info
        let updates = {
          $set: { loginAttempts: 0 },
          $unset: { lockUntil: 1 },
        };
        return user.update(updates, function (err) {
          if (err) return cb(err);
          return cb(null, user);
        });
      }

      // password is incorrect, so increment login attempts before responding
      user.incLoginAttempts(function (err) {
        if (err) return cb(err);
        return cb(null, null, reasons.PASSWORD_INCORRECT);
      });
    });
  });
};

const User = mongoose.model("User", UserSchema);
const UserTC = composeWithMongoose(User);

module.exports = {
  User,
  UserTC,
};
