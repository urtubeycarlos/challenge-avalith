const nodemailer = require('nodemailer');
require('dotenv').config();

function sendMail({ subject, content, recipients }) {
    if (!subject || !content || !recipients) {
        const error = new Error('missing params');
        error.code = 'ER_NOT_PARAM';
        throw error;
    }

    const {
        DIFFUSION_SERVICE,
        DIFFUSION_EMAIL,
        DIFFUSION_PASSWORD,
    } = process.env;

    const transporter = nodemailer.createTransport({
        service: DIFFUSION_SERVICE,
        auth: {
            user: DIFFUSION_EMAIL,
            pass: DIFFUSION_PASSWORD,
        },
    });

    const mailOptions = {
        from: DIFFUSION_EMAIL,
        to: recipients,
        subject,
        text: content,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }
            return resolve(info);
        });
    });
}

module.exports = {
    sendMail,
};
