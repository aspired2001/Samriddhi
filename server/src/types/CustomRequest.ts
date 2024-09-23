import { Request } from "express";

interface CustomRequest extends Request {
    user: {
        id:String;
    }
}

export default CustomRequest;