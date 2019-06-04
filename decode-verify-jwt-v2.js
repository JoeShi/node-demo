'use strict';

const jwt = require('jsonwebtoken');
const request = require('request');
const jwkToPem = require('jwk-to-pem');

const userPoolId = 'us-west-2_r0k5rfBa5';
const region = 'us-west-2'; //e.g. us-east-1
const iss = 'https://cognito-idp.' + region + '.amazonaws.com/' + userPoolId;
let pems;

const handler = (event, context, callback) => {
  //Download PEM for your UserPool if not already downloaded
  if (!pems) {
    //Download the JWKs and save it as PEM
    request({
      url: iss + '/.well-known/jwks.json',
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        pems = {};
        const keys = body['keys'];
        for(let i = 0; i < keys.length; i++) {
          //Convert each key to PEM
          const key_id = keys[i].kid;
          const modulus = keys[i].n;
          const exponent = keys[i].e;
          const key_type = keys[i].kty;
          const jwk = { kty: key_type, n: modulus, e: exponent};
          pems[key_id] = jwkToPem(jwk);
        }
        //Now continue with validating the token
        ValidateToken(pems, event, function (err) {
          callback(err)
        });
      } else {
        //Unable to download JWKs, fail the call
        callback('fail to download JWKs');
      }
    });
  } else {
    //PEMs are already downloaded, continue with validating the token
    ValidateToken(pems, event, function (err) {
      callback(err)
    });
  }
};

function ValidateToken(pems, event, callback) {

  const token = event.token;
  //Fail if the token is not jwt
  const decodedJwt = jwt.decode(token, {complete: true});
  if (!decodedJwt) {
    return callback("Not a valid JWT token");
  }

  //Fail if token is not from your UserPool
  if (decodedJwt.payload.iss !== iss) {
    return callback("invalid issuer");
  }

  //Get the kid from the token and retrieve corresponding PEM
  const kid = decodedJwt.header.kid;
  const pem = pems[kid];
  if (!pem) {
    return callback('no key found');
  }

  //Verify the signature of the JWT token to ensure it's really coming from your User Pool

  jwt.verify(token, pem, { issuer: iss }, function(err, payload) {
    if(err) {
      return callback(err)
    } else {
      //Valid token. Generate the API Gateway policy for the user
      //Always generate the policy on value of 'sub' claim and not for 'username' because username is reassignable
      //sub is UUID for a user which is never reassigned to another user.
      return callback()
    }
  });
}

exports.handler = handler;


const token = 'eyJraWQiOiJrYnhFYm9GalRyRjlOVWFjbzFVenNZOUxkUEVYZ2hlaTJ2aVlwQ0NhQUxVPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiMkFjWEN2QkdtTThNQzdHTlR3VjVvdyIsInN1YiI6IjlhMDk5ZDI5LTdhNDktNGYxNi1hZTY1LWFlNTkzY2YxNTljMSIsImF1ZCI6ImRuMGY1OWh1ZGF1cDdsODVvMHVxNm5yaDIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NDk5Mzc2MzksImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX3IwazVyZkJhNSIsImNvZ25pdG86dXNlcm5hbWUiOiI5YTA5OWQyOS03YTQ5LTRmMTYtYWU2NS1hZTU5M2NmMTU5YzEiLCJleHAiOjE1NDk5NDEyMzksImlhdCI6MTU0OTkzNzYzOSwiZW1haWwiOiIyMTQ3MDYyNTdAcXEuY29tIn0.Pv7UlrBo-20xRoZ7g4lv5-n4xR4IYUx15LM9xlBGdhLjWgCF7SueRsmFcKI6Acrz8EXUA_arZDCg2nKsQ9fcFHW-i53Z5XILO390NXE-ixc4e-PMVA9TtMz9UoyxHVeLN2AtfWthFshGTnpTsOXbY2fWlcZbPFmXXUlug4_SYXZcVcEejsbyZQPkHgaLHq8yRkIOLhXYRi8H6tw-YEPmZ6JOuRA7Ojaj-j22zN9GuKedacfc0iePgtdCimIBGkh-vRs_5FZRPFveGGUy-E70uvf0re2vIV8DYkf_2g8tQ_JtBmPY7c_jVsqd4DjLEHknZnFFGeER78juAjX0vZiPew'

handler({
  token: token
}, null, function (err) {
  if (err) {
    console.error(err)
  } else {
    console.log('valid token')
  }
});
