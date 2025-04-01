import { NextApiRequest, NextApiResponse } from "next";

export type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

export interface ApiError {
  message: string;
  status: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
} 