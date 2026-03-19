import { describe, it, expect, vi, beforeEach } from "vitest";
import * as tenderService from "@/services/tenderService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe("tenderService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTenders", () => {
    it("should fetch tenders for organization", async () => {
      const mockTenders = [
        {
          id: "1",
          title: "Adult Social Care Services",
          authority: "Manchester City Council",
          deadline: "2026-05-15",
          value: 800000,
          status: "new",
        },
      ];

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockTenders,
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(
        mockFrom()
      );

      const result = await tenderService.getTenders("org-123");

      expect(result).toEqual(mockTenders);
      expect(supabase.from).toHaveBeenCalledWith("tenders");
    });

    it("should handle fetch errors", async () => {
      const mockError = { message: "Database error", code: "500" };

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: mockError,
            }),
          }),
        }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(
        mockFrom()
      );

      await expect(tenderService.getTenders("org-123")).rejects.toEqual(mockError);
    });
  });

  describe("createTender", () => {
    it("should create a new tender", async () => {
      const tenderData = {
        title: "New Tender",
        authority: "Test Council",
        deadline: "2026-06-01",
        value: 500000,
      };

      const mockFrom = vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "tender-123", organisation_id: "org-123", status: "new", ...tenderData },
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(
        mockFrom()
      );

      const result = await tenderService.createTender("org-123", tenderData);

      expect(result).toHaveProperty("id");
      expect(result?.title).toBe("New Tender");
    });
  });

  describe("updateTender", () => {
    it("should update tender status", async () => {
      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "tender-123", status: "bid" },
                error: null,
              }),
            }),
          }),
        }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(
        mockFrom()
      );

      const result = await tenderService.updateTender("tender-123", { status: "bid" });

      expect(result?.status).toBe("bid");
    });
  });
});