import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateToken = (id: number): string => {
  return jwt.sign({ id: id.toString() }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  } as jwt.SignOptions);
};

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
}

export const paginationHelper = (query: PaginationParams): PaginationResult => {
  const page = Math.max(1, parseInt(query.page as any) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as any) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  data?: any,
  message?: string,
  meta?: any
) => {
  const response: any = { success };
  if (message) response.message = message;
  if (data !== undefined) response.data = data;
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};

export const sendError = (res: Response, statusCode: number, message: string, errors?: any) => {
  const response: any = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

export const sanitizeUser = (user: any) => {
  if (!user) return null;
  const { password, ...safeUser } = user.toJSON ? user.toJSON() : user;
  return safeUser;
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
};
