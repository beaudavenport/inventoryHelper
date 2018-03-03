import jwt from 'jwt-simple';
import bcrypt from 'bcrypt-nodejs';
import moment from 'moment';

export function getTokenFromLogin(collectionName, passwordAttempt, hashedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(passwordAttempt, hashedPassword, function(err, hashRes) {
      if (err || hashRes !== true) {
        reject('Error comparing password');
      } else {
        const token = jwt.encode({
          iss: collectionName,
          exp: moment().add(7, 'days').valueOf()
        }, process.env.jwtString);
        resolve(token);
      }
    });
  });
}

export function createHashedPassword(rawPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(rawPassword, null, null, function(err, hashedPassword) {
      if (err) {
        reject('Error creating password');
      } else {
        resolve(hashedPassword);
      }
    });
  });
}

export function createToken(collectionName) {
  const token = jwt.encode({
    iss: collectionName,
    exp: moment().add(7, 'days').valueOf()
  }, process.env.jwtString);
  return token;
}
