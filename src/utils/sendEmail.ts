import NodeMailer from 'nodemailer'

export const sendEmail = async (email: string, text: string, subject: string) => {

    try {
        const transporter = NodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT as string, 10),
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            text: text
        });

        console.log("email sent!");

    } catch (error: any) {
        console.error(error.message);
    }
}