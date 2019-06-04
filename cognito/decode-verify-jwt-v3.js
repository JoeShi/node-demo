//Usage: node verifyJWT.js <token_type> <ignoreExpiration> <userpoolID> <region> <ignoreExpirytoken> [pub]
//Example: node verifyJWT.js access true us-east-1_Hjsxxxx us-east-1 mytoken pub
var jwt = require('jsonwebtoken');
var request = require('request');
var jwkToPem = require('jwk-to-pem');

var userPoolId = process.argv[4];
var region = process.argv[5];

var token_type = process.argv[2];
var ignoreExpiry = process.argv[3];
var token = process.argv[6];
var print_pub = process.argv[7];

var iss = 'https://cognito-idp.' + region + '.amazonaws.com/' + userPoolId;
var pems;

verify(token);

function verify(token) {
  console.log('Verifying...');
  //Download PEM for your UserPool if not already downloaded
  if (!pems) {
    //Download the JWKs and save it as PEM
    request({
      url: iss + '/.well-known/jwks.json',
      json: true
    }, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        pems = {};
        var keys = body.keys;
        for (var i = 0; i < keys.length; i++) {
          //Convert each key to PEM
          var key_id = keys[i].kid;
          var modulus = keys[i].n;
          var exponent = keys[i].e;
          var key_type = keys[i].kty;
          var jwk = {
            kty: key_type,
            n: modulus,
            e: exponent
          };
          var pem = jwkToPem(jwk);
          pems[key_id] = pem;
        }
        //Now continue with validating the token
        var isValid = ValidateToken(pems, token);
        console.log("Is token valid?");
        console.log(isValid);
      } else {
        //Unable to download JWKs, fail the call
        console.log("Error downloading JWK!");
      }
    });
  } else {
    //PEMs are already downloaded, continue with validating the token
    var isValid = ValidateToken(pems, token);
    console.log("Is token valid?");
    console.log(isValid);
  }
}

function ValidateToken(pems, token) {
  var isValid = false;
  //Fail if the token is not jwt
  var decodedJwt = jwt.decode(token, {
    complete: true
  });
  //console.log(decodedJwt);
  if (!decodedJwt) {
    console.log("Not a valid JWT token");
    return;
  }

  //Fail if token is not from your UserPool
  if (decodedJwt.payload.iss != iss) {
    console.log("invalid issuer");
    return;
  }

  //Reject the jwt if it's not an 'Access Token'
  if (decodedJwt.payload.token_use != token_type) {
    console.log("Not an " + token_type + " token");
    return;
  }

  //Get the kid from the token and retrieve corresponding PEM
  var kid = decodedJwt.header.kid;
  var pem = pems[kid];
  if (print_pub == 'pub') {
    console.log('Public Key: ');
    console.log(pem);
  }
  if (!pem) {
    console.log('Invalid access token');
    return;
  }

  //Verify the signature of the JWT token to ensure it's really coming from your User Pool
  console.log('Ignore expiry?\n' + ignoreExpiry);
  if (ignoreExpiry == 'true') {
    console.log('Skipping expiration check...');
    jwt.verify(token, pem, {
      issuer: iss,
      ignoreExpiration: true
    }, function(err, payload) {
      if (err) {
        console.log(err);
      } else {
        console.log(payload);
        isValid = true;
      }
    });
  } else {
    console.log('Also checking token expiration...');
    jwt.verify(token, pem, {
      issuer: iss,
      ignoreExpiration: false
    }, function(err, payload) {
      if (err) {
        console.log('Error verifying token: ' + err.name + ':' + err.message);
      } else {
        console.log(payload);
        isValid = true;
      }
    });
  }
  return isValid;
}
