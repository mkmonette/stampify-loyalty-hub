export type Role = "super-admin" | "business-admin" | "customer";

export function getDashboardPathForRole(role: Role): string {
  switch (role) {
    case "super-admin":
      return "/super-admin";
    case "business-admin":
      return "/business-admin";
    case "customer":
    default:
      return "/customer";
  }
}
