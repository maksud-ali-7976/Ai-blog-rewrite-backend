import jwt from "jsonwebtoken";
import env from "src/config/env";


export default {
    sign: (payload: object, expiresIn: any) => {
        const token = jwt.sign(payload, env.secret, { expiresIn: expiresIn });
        return token;
    },

    verify: (token: string): { _id: string; admin: boolean } => {
        const payload = jwt.verify(token, env.secret) as any;
        return payload;
    },
    signRefresh: (payload: object) => {
        return jwt.sign(
            payload,
            env.ref_secret,
            {
                expiresIn: "7d"
            }
        );
    },
    refreshVerify: (token: string): { _id: string; admin: boolean } => {
        const payload = jwt.verify(token, env.ref_secret) as any;
        return payload
    }
};
