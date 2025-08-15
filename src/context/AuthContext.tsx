import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Role, getDashboardPathForRole } from "@/utils/roles";

// LocalStorage keys
const LS_USERS = "auth_users";
const LS_SESSION = "auth_session";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
  name?: string;
};

type StoredUser = AuthUser & { password: string };

type RegisterInput = {
  email: string;
  password: string;
  role: Role;
  name?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => void;
  getDashboardPath: (role?: Role) => string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(LS_USERS);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

function seedDemoUsers() {
  const users = readUsers();
  if (users.length === 0) {
    const demoUsers: StoredUser[] = [
      {
        id: "demo-super-admin",
        email: "super@demo.com",
        password: "demo123",
        role: "super-admin",
        name: "Super Admin Demo"
      },
      {
        id: "demo-business-admin",
        email: "business@demo.com",
        password: "demo123",
        role: "business-admin",
        name: "Business Admin Demo"
      },
      {
        id: "demo-customer",
        email: "customer@demo.com",
        password: "demo123",
        role: "customer",
        name: "Customer Demo"
      }
    ];
    writeUsers(demoUsers);
  }
}

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(LS_SESSION);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeSession(user: AuthUser | null) {
  if (!user) localStorage.removeItem(LS_SESSION);
  else localStorage.setItem(LS_SESSION, JSON.stringify(user));
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    seedDemoUsers();
    setUser(readSession());
  }, []);

  const login = async (email: string, password: string) => {
    const users = readUsers();
    const u = users.find(
      (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password
    );
    if (!u) throw new Error("Invalid email or password");
    const publicUser: AuthUser = { id: u.id, email: u.email, role: u.role, name: u.name };
    setUser(publicUser);
    writeSession(publicUser);
    return publicUser;
  };

  const register = async (input: RegisterInput) => {
    const users = readUsers();
    const exists = users.some((x) => x.email.toLowerCase() === input.email.toLowerCase());
    if (exists) throw new Error("Email already registered");
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email: input.email,
      password: input.password,
      role: input.role,
      name: input.name,
    };
    const next = [...users, newUser];
    writeUsers(next);
    const publicUser: AuthUser = { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name };
    setUser(publicUser);
    writeSession(publicUser);
    return publicUser;
  };

  const logout = () => {
    setUser(null);
    writeSession(null);
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    login,
    register,
    logout,
    getDashboardPath: (role?: Role) => getDashboardPathForRole(role ?? user?.role ?? "customer"),
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
