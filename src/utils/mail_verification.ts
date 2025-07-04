import { AUSPHORA_MAIL_PASSWORD, AUSPHORA_SENDERMAIL } from "../config";
import nodemailer from "nodemailer";
import prisma from "../db/prisma";
import { Response } from "express";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: AUSPHORA_SENDERMAIL,
        pass: AUSPHORA_MAIL_PASSWORD,
    },
});

export const sendOtp = async (to: string, otpGenerated: string) => {
    const inServerGeneratedOtp = otpGenerated;

    const mailOptions = {
        from: AUSPHORA_SENDERMAIL,
        to,
        subject: "Ausphora Email Verification",
        text: `HERE IS YOUR OTP: ${inServerGeneratedOtp} FOR AUSPHORA ACCOUNT VERIFICATION`,
    };

    await transporter.sendMail(mailOptions);
};


export const FINAL_MAIL_VERIFICATION = async (otpEntered: string, mail: string, res: Response) => {
    const user = await prisma.user.findFirst({
        where: {
            email: mail
        }
    })

    if (!user) {
        res.status(401).json({
            message: "USER NOT FOUND!"
        })
        return;
    }
    else {
        if (user.otpForVerification === otpEntered) {
            await prisma.user.update({
                where: {
                    email: mail
                },
                data: {
                    isMailVerified: true
                }
            })

            await prisma.user.update({
                where: {
                    email: mail
                },
                data: {
                    otpForVerification: "MAIL_VERIFICATION_DONE"
                }
            })
            res.status(200).json({
                message: `${user.username}'s EMAIL VERIFIED SUCCESFULLY!!`
            })
            return;
        }
        else {
            res.status(400).json({
                message: "INVALID OTP ENTERED!"
            })
            return;
        }
    }
}