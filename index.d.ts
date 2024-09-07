declare global {
  namespace Express {
    interface User {
      sub: bigint;
      sessionId?: string;
      email: string;
      refreshToken?: string;
    }
  }
  interface BigInt {
    toJSON: () => string;
  }
}

export {};
