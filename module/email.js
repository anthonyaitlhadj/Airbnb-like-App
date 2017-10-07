/**
 * Created by gregoire on 07/10/2017.
 */
var nodemailer = require('nodemailer');

function mailsend(to , subject, text, html){
	nodemailer.createTestAccount(function (err, account) {
		if (err) {
			console.error('Failed to create a testing account. ' + err.message);
			return process.exit(1);
		}
		// create reusable transporter object using the default SMTP transport
		var transporter = nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: account.user, // generated ethereal user
				pass: account.pass  // generated ethereal password
			}
		});

		// setup email data with unicode symbols
		var mailOptions = {
			from: '"AirBnB Like" <account@airbnblike.com>', // sender address
			to: to, // list of receivers
			subject: subject, // Subject line
			text: text, // plain text body
			html: html // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		});
	})
}
module.exports = mailsend;