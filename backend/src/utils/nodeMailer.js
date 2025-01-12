import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL,
        pass:process.env.MAIL_PASS
    }
});

const mailUser = (receiverMail, subject, message) => {
    //testMail("DONE");
    const mailOptions = {
        from: process.env.MAIL,
        to: receiverMail,
        subject: subject,
        html: message
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const testMail = (message) => {
    const mailOptions ={
        from: process.env.MAIL,
        to: process.env.MAIL,
        subject: "TestMailRun",
        html: "NPM RUN DEV" + message
    }

    transporter.sendMail(mailOptions, (info, error) => {
        if(error){
            console.log(error);
        }else{
            console.log("INFO" + info.response);
        }
    })
}

export { mailUser };