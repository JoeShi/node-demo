const Validator = require('cognito-jwt-token-validator').Validator;
const validator = new Validator('https://cognito-idp.us-west-2.amazonaws.com/us-west-2_r0k5rfBa5', 'dn0f59hudaup7l85o0uq6nrh2');

const token = 'eyJraWQiOiJrYnhFYm9GalRyRjlOVWFjbzFVenNZOUxkUEVYZ2hlaTJ2aVlwQ0NhQUxVPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiMkFjWEN2QkdtTThNQzdHTlR3VjVvdyIsInN1YiI6IjlhMDk5ZDI5LTdhNDktNGYxNi1hZTY1LWFlNTkzY2YxNTljMSIsImF1ZCI6ImRuMGY1OWh1ZGF1cDdsODVvMHVxNm5yaDIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NDk5Mzc2MzksImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX3IwazVyZkJhNSIsImNvZ25pdG86dXNlcm5hbWUiOiI5YTA5OWQyOS03YTQ5LTRmMTYtYWU2NS1hZTU5M2NmMTU5YzEiLCJleHAiOjE1NDk5NDEyMzksImlhdCI6MTU0OTkzNzYzOSwiZW1haWwiOiIyMTQ3MDYyNTdAcXEuY29tIn0.Pv7UlrBo-20xRoZ7g4lv5-n4xR4IYUx15LM9xlBGdhLjWgCF7SueRsmFcKI6Acrz8EXUA_arZDCg2nKsQ9fcFHW-i53Z5XILO390NXE-ixc4e-PMVA9TtMz9UoyxHVeLN2AtfWthFshGTnpTsOXbY2fWlcZbPFmXXUlug4_SYXZcVcEejsbyZQPkHgaLHq8yRkIOLhXYRi8H6tw-YEPmZ6JOuRA7Ojaj-j22zN9GuKedacfc0iePgtdCimIBGkh-vRs_5FZRPFveGGUy-E70uvf0re2vIV8DYkf_2g8tQ_JtBmPY7c_jVsqd4DjLEHknZnFFGeER78juAjX0vZiPew'

// Authorize function
const authorize = function (token) {
  return validator.validate(token)
    .then((payload) => {
      console.log(payload);
      return { userid: payload.sub };
    });
};

authorize(token);
