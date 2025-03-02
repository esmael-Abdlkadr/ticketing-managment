import { IUser } from "./types";
declare module "mongoose" {
  interface Document {
    comparePassword(
      candidatePassword: string,
      userPassword: string
    ): Promise<boolean>;
  }
}

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}
