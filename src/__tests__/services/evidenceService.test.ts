import { describe, it, expect, vi, beforeEach } from "vitest";
import * as evidenceService from "@/services/evidenceService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("evidenceService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getEvidenceLibrary", () => {
    it("should fetch evidence items for organization", async () => {
      const mockEvidence = [
        {
          id: "1",
          title: "Safeguarding Policy",
          category: "Safeguarding",
          content: "Our safeguarding approach...",
        },
      ];

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockEvidence,
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(
        mockFrom()
      );

      const result = await evidenceService.getEvidenceLibrary("org-123");

      expect(result).toEqual(mockEvidence);
    });
  });

  describe("createEvidence", () => {
    it("should create a new evidence item", async () => {
      const evidenceData = {
        title: "New Policy",
        category: "Quality Assurance",
        content: "Policy content...",
      };

      const mockFrom = vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "evidence-123", organisation_id: "org-123", ...evidenceData },
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(
        mockFrom()
      );

      const result = await evidenceService.createEvidence("org-123", evidenceData);

      expect(result).toHaveProperty("id");
      expect(result?.title).toBe("New Policy");
    });
  });
});