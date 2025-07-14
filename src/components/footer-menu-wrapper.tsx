
import { cookies } from "next/headers";
import { AdminFooterMenu } from "./admin-footer-menu";
import { UserFooterMenu } from "./user-footer-menu";

export function FooterMenuWrapper() {
  const isAdmin = cookies().has('admin-session');
  const isCustomer = cookies().has('auth-token');

  if (isAdmin) {
    return <AdminFooterMenu />;
  }
  
  if (isCustomer) {
    return <UserFooterMenu />;
  }

  return null;
}
