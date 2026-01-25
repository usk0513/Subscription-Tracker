import type {
  Subscription,
  BillingCycle,
  CategoryId,
} from "@/types/subscription";

const createMockSubscription = (
  overrides: Partial<Subscription> = {}
): Subscription => ({
  id: "test-id",
  name: "Test Subscription",
  price: 1000,
  billingCycle: "monthly",
  startDate: "2024-01-01",
  category: "entertainment",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

const calculateMonthlyPrice = (
  price: number,
  billingCycle: BillingCycle
): number => {
  return billingCycle === "yearly" ? Math.round(price / 12) : price;
};

const calculateMonthlyTotal = (subscriptions: Subscription[]): number => {
  return subscriptions.reduce((total, sub) => {
    return total + calculateMonthlyPrice(sub.price, sub.billingCycle);
  }, 0);
};

const formatPrice = (price: number): string => {
  return `¥${price.toLocaleString()}`;
};

const getCategoryLabel = (category: CategoryId): string => {
  const labels: Record<CategoryId, string> = {
    entertainment: "エンタメ",
    work: "仕事",
    health: "健康",
    education: "教育",
    other: "その他",
  };
  return labels[category];
};

const getBillingCycleLabel = (cycle: BillingCycle): string => {
  return cycle === "monthly" ? "月額" : "年額";
};

describe("Subscription Utility Functions", () => {
  describe("calculateMonthlyPrice", () => {
    it("should return same price for monthly subscriptions", () => {
      expect(calculateMonthlyPrice(1490, "monthly")).toBe(1490);
    });

    it("should divide by 12 for yearly subscriptions", () => {
      expect(calculateMonthlyPrice(12000, "yearly")).toBe(1000);
    });

    it("should round yearly price to nearest integer", () => {
      expect(calculateMonthlyPrice(10000, "yearly")).toBe(833);
    });
  });

  describe("calculateMonthlyTotal", () => {
    it("should return 0 for empty array", () => {
      expect(calculateMonthlyTotal([])).toBe(0);
    });

    it("should sum all monthly subscriptions", () => {
      const subscriptions = [
        createMockSubscription({ price: 1000, billingCycle: "monthly" }),
        createMockSubscription({
          id: "2",
          price: 500,
          billingCycle: "monthly",
        }),
      ];
      expect(calculateMonthlyTotal(subscriptions)).toBe(1500);
    });

    it("should convert yearly to monthly before summing", () => {
      const subscriptions = [
        createMockSubscription({ price: 1000, billingCycle: "monthly" }),
        createMockSubscription({
          id: "2",
          price: 12000,
          billingCycle: "yearly",
        }),
      ];
      expect(calculateMonthlyTotal(subscriptions)).toBe(2000);
    });

    it("should handle mixed billing cycles", () => {
      const subscriptions = [
        createMockSubscription({ price: 1490, billingCycle: "monthly" }),
        createMockSubscription({
          id: "2",
          price: 980,
          billingCycle: "monthly",
        }),
        createMockSubscription({
          id: "3",
          price: 11800,
          billingCycle: "yearly",
        }),
      ];
      expect(calculateMonthlyTotal(subscriptions)).toBe(1490 + 980 + 983);
    });
  });

  describe("formatPrice", () => {
    it("should format price with yen symbol", () => {
      expect(formatPrice(1000)).toBe("¥1,000");
    });

    it("should handle small prices", () => {
      expect(formatPrice(100)).toBe("¥100");
    });

    it("should handle large prices", () => {
      expect(formatPrice(100000)).toBe("¥100,000");
    });

    it("should handle zero", () => {
      expect(formatPrice(0)).toBe("¥0");
    });
  });

  describe("getCategoryLabel", () => {
    it("should return correct label for entertainment", () => {
      expect(getCategoryLabel("entertainment")).toBe("エンタメ");
    });

    it("should return correct label for work", () => {
      expect(getCategoryLabel("work")).toBe("仕事");
    });

    it("should return correct label for health", () => {
      expect(getCategoryLabel("health")).toBe("健康");
    });

    it("should return correct label for education", () => {
      expect(getCategoryLabel("education")).toBe("教育");
    });

    it("should return correct label for other", () => {
      expect(getCategoryLabel("other")).toBe("その他");
    });
  });

  describe("getBillingCycleLabel", () => {
    it("should return 月額 for monthly", () => {
      expect(getBillingCycleLabel("monthly")).toBe("月額");
    });

    it("should return 年額 for yearly", () => {
      expect(getBillingCycleLabel("yearly")).toBe("年額");
    });
  });
});

describe("Subscription Type Validation", () => {
  describe("BillingCycle", () => {
    it("should accept monthly", () => {
      const cycle: BillingCycle = "monthly";
      expect(cycle).toBe("monthly");
    });

    it("should accept yearly", () => {
      const cycle: BillingCycle = "yearly";
      expect(cycle).toBe("yearly");
    });
  });

  describe("CategoryId", () => {
    const validCategories: CategoryId[] = [
      "entertainment",
      "work",
      "health",
      "education",
      "other",
    ];

    validCategories.forEach((category) => {
      it(`should accept ${category}`, () => {
        const cat: CategoryId = category;
        expect(cat).toBe(category);
      });
    });
  });

  describe("Subscription", () => {
    it("should have all required fields", () => {
      const subscription = createMockSubscription();

      expect(subscription.id).toBeDefined();
      expect(subscription.name).toBeDefined();
      expect(subscription.price).toBeDefined();
      expect(subscription.billingCycle).toBeDefined();
      expect(subscription.startDate).toBeDefined();
      expect(subscription.category).toBeDefined();
      expect(subscription.createdAt).toBeDefined();
      expect(subscription.updatedAt).toBeDefined();
    });

    it("should allow optional managementUrl", () => {
      const withUrl = createMockSubscription({
        managementUrl: "https://example.com",
      });
      const withoutUrl = createMockSubscription();

      expect(withUrl.managementUrl).toBe("https://example.com");
      expect(withoutUrl.managementUrl).toBeUndefined();
    });
  });
});
