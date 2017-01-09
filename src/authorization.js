import jwt from 'jwt-simple';
import bcrypt from 'bcrypt-nodejs';
import jwtAuth from './jwtauth.js';
import moment from 'moment';

export function getTokenFromLogin(collectionName, passwordAttempt, hashedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(passwordAttempt, hashedPassword, function(hashErr, hashRes) {
      if (hashErr || hashRes !== true) {
        reject();
      } else {
        let token = jwt.encode({
          iss: collectionName,
          exp: moment().add(7, 'days').valueOf()
        }, process.env.jwtString);
        resolve(token);
      }
    });
  });
}
