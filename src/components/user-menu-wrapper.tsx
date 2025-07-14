import { cookies } from "next/headers";
import { UserMenuClient } from "./user-menu-client";

export function UserMenuWrapper() {
  const authToken = cookies().get('auth-token')?.value;
  const isLoggedIn = !!authToken;
  
  return <UserMenuClient isLoggedIn={isLoggedIn} />;
}
