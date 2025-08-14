const AWS = require('aws-sdk');
const https = require('https');
const querystring = require('querystring');
const ses = new AWS.SES();

const RECAPTCHA_SECRET = 'YOUR_SECRET_KEY'; // replace with actual secret key

exports.handler = async (event) => {
  try {
    const { name, email, message, token } = JSON.parse(event.body);

    // 1. Verify reCAPTCHA
    const captchaValid = await verifyCaptcha(token);
    if (!captchaValid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'reCAPTCHA verification failed' }),
      };
    }

    // 2. Compose email
    const params = {
      Source: 'konradhendley8@gmail.com',
      Destination: {
        ToAddresses: ['konradhendley8@gmail.com'],
      },
      Message: {
        Subject: { Data: `Contact Form Submission from ${name}` },
        Body: {
          Text: {
            Data: `You have a new message from ${name} (${email}):\n\n${message}`,
          },
        },
      },
    };

    // 3. Send email via SES
    await ses.sendEmail(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email' }),
    };
  }
};

// Helper to verify reCAPTCHA
function verifyCaptcha(token) {
  const postData = querystring.stringify({
    secret: RECAPTCHA_SECRET,
    response: token,
  });

  const options = {
    hostname: 'www.google.com',
    path: '/recaptcha/api/siteverify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.success);
        } catch (err) {
          console.error('Error parsing reCAPTCHA response:', err);
          resolve(false);
        }
      });
    });

    req.on('error', err => {
      console.error('Error sending request to reCAPTCHA:', err);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}