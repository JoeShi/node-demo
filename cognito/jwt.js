
const https = require('https');
const jose = require('node-jose');

const region = 'us-west-2';
const userpool_id = 'us-west-2_r0k5rfBa5';
const app_client_id = 'dn0f59hudaup7l85o0uq6nrh2';
const keys_url = 'https://cognito-idp.' + region + '.amazonaws.com/' + userpool_id + '/.well-known/jwks.json';

exports.handler = (event, context, callback) => {
  const token = event.token;
  const sections = token.split('.');
  // get the kid from the headers prior to verification
  let header = jose.util.base64url.decode(sections[0]);
  header = JSON.parse(header);
  const kid = header.kid;
  // download the public keys
  https.get(keys_url, function(response) {
    if (response.statusCode === 200) {
      response.on('data', function(body) {
        const keys = JSON.parse(body)['keys'];
        // search for the kid in the downloaded public keys
        let key_index = -1;
        for (let i=0; i < keys.length; i++) {
          if (kid === keys[i].kid) {
            key_index = i;
            break;
          }
        }
        if (key_index === -1) {
          console.log('Public key not found in jwks.json');
          callback('Public key not found in jwks.json');
        }
        // construct the public key
        jose.JWK.asKey(keys[key_index]).
        then(function(result) {
          // verify the signature
          console.log(result)
          jose.JWS.createVerify(result).
          verify(token).
          then(function(result) {
            // now we can use the claims
            const claims = JSON.parse(result.payload);
            // additionally we can verify the token expiration
            const current_ts = Math.floor(new Date() / 1000);
            if (current_ts > claims.exp) {
              callback('Token is expired');
            }
            // and the Audience (use claims.client_id if verifying an access token)
            if (claims.aud !== app_client_id) {
              callback('Token was not issued for this audience');
            }
            callback(null, claims);
          }).
          catch(function(err) {
            console.error(err)
            callback('Signature verification failed');
          });
        });
      });
    }
  });
};

