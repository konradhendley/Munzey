const AWS = require('aws-sdk');
const ses = new AWS.SES();

exports.handler = async (event) => {
  const { name, email, message } = JSON.parse(event.body);

  const params = {
    Source: 'konradhendley8@gmail.com',
    Destination: {
      ToAddresses: ['konradhendley8@gmail.com'], 
    },
    Message: {
      Subject: { Data: `Contact Form Submission from ${name}` },
      Body: {
        Text: { Data: `You have a new message from ${name} (${email}):\n\n${message}` },
      },
    },
  };

  try {
    await ses.sendEmail(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email' }),
    };
  }
};