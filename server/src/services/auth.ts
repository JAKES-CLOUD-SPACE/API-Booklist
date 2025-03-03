import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { Request } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = ({ req }: { req: Request }) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }
console.log('token:', token);
  if (!token) {
    console.log('No token provided');
    return req;
  }

    try {
      const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '6hr' });
      req.user = data;
    } catch (error) {
      console.log('Token Invalid');
    }

    return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}