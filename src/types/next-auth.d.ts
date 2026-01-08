import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    username: string;
    mobile?: string;
    email?: string | null;
  }

  interface Session {
    user: User;
  }
}
