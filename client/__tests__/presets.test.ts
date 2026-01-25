import {
  presetServices,
  getServiceById,
  getPlanById,
  servicesByCategory,
} from "@/constants/presets";
import type { PresetService, ServicePlan } from "@/constants/presets";

describe("Preset Services", () => {
  describe("presetServices array", () => {
    it("should have at least 30 services", () => {
      expect(presetServices.length).toBeGreaterThanOrEqual(30);
    });

    it("should have unique service IDs", () => {
      const ids = presetServices.map((s) => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have unique plan IDs across all services", () => {
      const allPlanIds: string[] = [];
      presetServices.forEach((service) => {
        service.plans.forEach((plan) => {
          allPlanIds.push(plan.id);
        });
      });
      const uniquePlanIds = new Set(allPlanIds);
      expect(uniquePlanIds.size).toBe(allPlanIds.length);
    });

    it("should have valid category for each service", () => {
      const validCategories = ["entertainment", "work", "health", "education", "other"];
      presetServices.forEach((service) => {
        expect(validCategories).toContain(service.category);
      });
    });

    it("should have at least one plan for each service", () => {
      presetServices.forEach((service) => {
        expect(service.plans.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("should have valid billing cycle for each plan", () => {
      const validCycles = ["monthly", "yearly"];
      presetServices.forEach((service) => {
        service.plans.forEach((plan) => {
          expect(validCycles).toContain(plan.billingCycle);
        });
      });
    });

    it("should have positive price for each plan", () => {
      presetServices.forEach((service) => {
        service.plans.forEach((plan) => {
          expect(plan.price).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Entertainment services", () => {
    it("should include Netflix with 3 plans", () => {
      const netflix = presetServices.find((s) => s.id === "netflix");
      expect(netflix).toBeDefined();
      expect(netflix?.name).toBe("Netflix");
      expect(netflix?.category).toBe("entertainment");
      expect(netflix?.plans.length).toBe(3);
    });

    it("should include Spotify with multiple plans", () => {
      const spotify = presetServices.find((s) => s.id === "spotify");
      expect(spotify).toBeDefined();
      expect(spotify?.name).toBe("Spotify");
      expect(spotify?.plans.length).toBeGreaterThanOrEqual(3);
    });

    it("should include YouTube Premium", () => {
      const youtube = presetServices.find((s) => s.id === "youtube-premium");
      expect(youtube).toBeDefined();
      expect(youtube?.name).toBe("YouTube Premium");
    });
  });

  describe("AI services", () => {
    it("should include ChatGPT with Plus and Pro plans", () => {
      const chatgpt = presetServices.find((s) => s.id === "chatgpt");
      expect(chatgpt).toBeDefined();
      expect(chatgpt?.name).toBe("ChatGPT");
      expect(chatgpt?.plans.length).toBe(2);
      
      const planNames = chatgpt?.plans.map((p) => p.name);
      expect(planNames).toContain("Plus");
      expect(planNames).toContain("Pro");
    });

    it("should include Claude with Pro and Max plans", () => {
      const claude = presetServices.find((s) => s.id === "claude");
      expect(claude).toBeDefined();
      expect(claude?.name).toBe("Claude");
      expect(claude?.plans.length).toBe(3);
    });

    it("should include Gemini", () => {
      const gemini = presetServices.find((s) => s.id === "gemini");
      expect(gemini).toBeDefined();
      expect(gemini?.name).toBe("Gemini");
    });

    it("should include Midjourney with 4 plans", () => {
      const midjourney = presetServices.find((s) => s.id === "midjourney");
      expect(midjourney).toBeDefined();
      expect(midjourney?.plans.length).toBe(4);
    });

    it("should include GitHub Copilot", () => {
      const copilot = presetServices.find((s) => s.id === "github-copilot");
      expect(copilot).toBeDefined();
      expect(copilot?.name).toBe("GitHub Copilot");
    });

    it("should include Cursor", () => {
      const cursor = presetServices.find((s) => s.id === "cursor");
      expect(cursor).toBeDefined();
      expect(cursor?.name).toBe("Cursor");
    });
  });

  describe("getServiceById", () => {
    it("should return Netflix when given 'netflix'", () => {
      const service = getServiceById("netflix");
      expect(service).toBeDefined();
      expect(service?.name).toBe("Netflix");
      expect(service?.category).toBe("entertainment");
    });

    it("should return ChatGPT when given 'chatgpt'", () => {
      const service = getServiceById("chatgpt");
      expect(service).toBeDefined();
      expect(service?.name).toBe("ChatGPT");
    });

    it("should return undefined for non-existent service", () => {
      const service = getServiceById("non-existent-service");
      expect(service).toBeUndefined();
    });

    it("should return undefined for empty string", () => {
      const service = getServiceById("");
      expect(service).toBeUndefined();
    });
  });

  describe("getPlanById", () => {
    it("should return Netflix Standard plan", () => {
      const plan = getPlanById("netflix", "netflix-standard");
      expect(plan).toBeDefined();
      expect(plan?.name).toBe("スタンダード");
      expect(plan?.price).toBe(1590);
      expect(plan?.billingCycle).toBe("monthly");
    });

    it("should return ChatGPT Plus plan", () => {
      const plan = getPlanById("chatgpt", "chatgpt-plus");
      expect(plan).toBeDefined();
      expect(plan?.name).toBe("Plus");
      expect(plan?.price).toBe(3000);
    });

    it("should return undefined for non-existent plan", () => {
      const plan = getPlanById("netflix", "non-existent-plan");
      expect(plan).toBeUndefined();
    });

    it("should return undefined for non-existent service", () => {
      const plan = getPlanById("non-existent-service", "some-plan");
      expect(plan).toBeUndefined();
    });
  });

  describe("servicesByCategory", () => {
    it("should have entertainment category with services", () => {
      expect(servicesByCategory.entertainment).toBeDefined();
      expect(servicesByCategory.entertainment.length).toBeGreaterThan(0);
    });

    it("should have work category with services", () => {
      expect(servicesByCategory.work).toBeDefined();
      expect(servicesByCategory.work.length).toBeGreaterThan(0);
    });

    it("should have education category with services", () => {
      expect(servicesByCategory.education).toBeDefined();
      expect(servicesByCategory.education.length).toBeGreaterThan(0);
    });

    it("should include Netflix in entertainment category", () => {
      const netflix = servicesByCategory.entertainment.find((s) => s.id === "netflix");
      expect(netflix).toBeDefined();
    });

    it("should include ChatGPT in work category", () => {
      const chatgpt = servicesByCategory.work.find((s) => s.id === "chatgpt");
      expect(chatgpt).toBeDefined();
    });

    it("should include Duolingo in education category", () => {
      const duolingo = servicesByCategory.education.find((s) => s.id === "duolingo");
      expect(duolingo).toBeDefined();
    });
  });

  describe("Price data integrity", () => {
    it("should have reasonable prices for Japanese market (100 - 100000 yen)", () => {
      presetServices.forEach((service) => {
        service.plans.forEach((plan) => {
          expect(plan.price).toBeGreaterThanOrEqual(100);
          expect(plan.price).toBeLessThanOrEqual(100000);
        });
      });
    });

    it("should have ChatGPT Plus at ¥3,000", () => {
      const plan = getPlanById("chatgpt", "chatgpt-plus");
      expect(plan?.price).toBe(3000);
    });

    it("should have Netflix Premium more expensive than Standard", () => {
      const standard = getPlanById("netflix", "netflix-standard");
      const premium = getPlanById("netflix", "netflix-premium");
      expect(premium!.price).toBeGreaterThan(standard!.price);
    });
  });

  describe("Management URLs", () => {
    it("should have valid URLs for major services", () => {
      const servicesWithUrls = ["netflix", "spotify", "chatgpt", "claude"];
      servicesWithUrls.forEach((id) => {
        const service = getServiceById(id);
        expect(service?.managementUrl).toBeDefined();
        expect(service?.managementUrl).toMatch(/^https?:\/\//);
      });
    });
  });
});
