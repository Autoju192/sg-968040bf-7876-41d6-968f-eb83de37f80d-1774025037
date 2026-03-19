import { describe, it, expect, vi, beforeEach } from "vitest";
import { tenderService } from "@/services/tenderService";
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

      expect(result.data).toEqual(mockTenders);
      expect(result.error).toBeNull();
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

      const result = await tenderService.getTenders("org-123");

      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe("createTender", () => {
    it("should create a new tender", async () => {
      const tenderData = {
        organisation_id: "org-123",
        title: "New Tender",
        authority: "Test Council",
        deadline: "2026-06-01",
        value: 500000,
        status: "new" as const,
      };

      const mockFrom = vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "tender-123", ...tenderData },
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(
        mockFrom()
      );

      const result = await tenderService.createTender(tenderData);

      expect(result.data).toHaveProperty("id");
      expect(result.data?.title).toBe("New Tender");
      expect(result.error).toBeNull();
    });
  });

  describe("updateTenderStatus", () => {
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

      const result = await tenderService.updateTenderStatus("tender-123", "bid");

      expect(result.data?.status).toBe("bid");
      expect(result.error).toBeNull();
    });
  });
});