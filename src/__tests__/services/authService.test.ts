import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "@/services/authService";

// Mock Supabase
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      insert: vi.fn(),
    })),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signUp", () => {
    it("should create a new user account", async () => {
      const mockUser = {
        id: "123",
        email: "test@example.com",
      };

      const { supabase } = await import("@/lib/supabase");
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      const result = await authService.signUp(
        "test@example.com",
        "password123",
        "Test User",
        "Test Org",
        "admin"
      );

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        options: {
          data: {
            full_name: "Test User",
            organisation_name: "Test Org",
            role: "admin",
          },
        },
      });

      expect(result.error).toBeNull();
    });

    it("should handle signup errors", async () => {
      const { supabase } = await import("@/lib/supabase");
      const mockError = new Error("Email already exists");

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      const result = await authService.signUp(
        "test@example.com",
        "password123",
        "Test User",
        "Test Org",
        "admin"
      );

      expect(result.error).toBe(mockError);
    });
  });

  describe("signIn", () => {
    it("should sign in existing user", async () => {
      const { supabase } = await import("@/lib/supabase");
      const mockSession = {
        user: { id: "123", email: "test@example.com" },
        access_token: "token",
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockSession.user, session: mockSession },
        error: null,
      });

      const result = await authService.signIn("test@example.com", "password123");

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.error).toBeNull();
    });

    it("should handle invalid credentials", async () => {
      const { supabase } = await import("@/lib/supabase");
      const mockError = new Error("Invalid login credentials");

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      const result = await authService.signIn("test@example.com", "wrongpass");

      expect(result.error).toBe(mockError);
    });
  });

  describe("signOut", () => {
    it("should sign out user", async () => {
      const { supabase } = await import("@/lib/supabase");

      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: null,
      });

      const result = await authService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });
  });

  describe("resetPassword", () => {
    it("should send password reset email", async () => {
      const { supabase } = await import("@/lib/supabase");

      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({
        data: {},
        error: null,
      });

      const result = await authService.resetPassword("test@example.com");

      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        "test@example.com",
        expect.objectContaining({
          redirectTo: expect.stringContaining("/reset-password"),
        })
      );

      expect(result.error).toBeNull();
    });
  });
});