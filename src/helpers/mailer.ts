import nodemailer from 'nodemailer';

export const sendEmail = async ({ email, emailType, userId } :any   ) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: emailType === 'VERIFY' ? 'Verify Your Account' : 'Reset Your Password',
            html: `<p>Please click the link to verify your account: <a href="${process.env.FRONTEND_URL}/verify/${userId}">Verify Account</a></p>`,
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;
    } catch (error: any) {
        throw new Error(error.message);
    }

}