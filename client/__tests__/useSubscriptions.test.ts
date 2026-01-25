import * as storage from "@/lib/storage";
import type { Subscription, SubscriptionInput } from "@/types/subscription";

jest.mock("@/lib/storage");

const mockedStorage = storage as jest.Mocked<typeof storage>;

const mockSubscription: Subscription = {
  id: "test-id-1",
  name: "Netflix",
  price: 1490,
  billingCycle: "monthly",
  startDate: "2024-01-15",
  category: "entertainment",
  createdAt: "2024-01-15T00:00:00.000Z",
  updatedAt: "2024-01-15T00:00:00.000Z",
};

const mockSubscriptionInput: SubscriptionInput = {
  name: "Netflix",
  price: 1490,
  billingCycle: "monthly",
  startDate: "2024-01-15",
  category: "entertainment",
};

describe("useSubscriptions hook logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSubscriptions (query function)", () => {
    it("should call storage.getSubscriptions", async () => {
      mockedStorage.getSubscriptions.mockResolvedValue([mockSubscription]);

      const result = await storage.getSubscriptions();

      expect(mockedStorage.getSubscriptions).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockSubscription]);
    });

    it("should return empty array when no subscriptions", async () => {
      mockedStorage.getSubscriptions.mockResolvedValue([]);

      const result = await storage.getSubscriptions();

      expect(result).toEqual([]);
    });
  });

  describe("getSubscriptionById (query function)", () => {
    it("should call storage.getSubscriptionById with correct id", async () => {
      mockedStorage.getSubscriptionById.mockResolvedValue(mockSubscription);

      const result = await storage.getSubscriptionById("test-id-1");

      expect(mockedStorage.getSubscriptionById).toHaveBeenCalledWith("test-id-1");
      expect(result).toEqual(mockSubscription);
    });

    it("should return null for non-existent id", async () => {
      mockedStorage.getSubscriptionById.mockResolvedValue(null);

      const result = await storage.getSubscriptionById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("createSubscription (mutation function)", () => {
    it("should call storage.createSubscription with input", async () => {
      const newSubscription: Subscription = {
        ...mockSubscription,
        id: "new-id",
      };
      mockedStorage.createSubscription.mockResolvedValue(newSubscription);

      const result = await storage.createSubscription(mockSubscriptionInput);

      expect(mockedStorage.createSubscription).toHaveBeenCalledWith(mockSubscriptionInput);
      expect(result.name).toBe("Netflix");
      expect(result.price).toBe(1490);
    });

    it("should handle all billing cycles", async () => {
      const yearlyInput: SubscriptionInput = {
        ...mockSubscriptionInput,
        billingCycle: "yearly",
        price: 11800,
      };
      const yearlySubscription: Subscription = {
        ...mockSubscription,
        ...yearlyInput,
        id: "yearly-id",
      };
      mockedStorage.createSubscription.mockResolvedValue(yearlySubscription);

      const result = await storage.createSubscription(yearlyInput);

      expect(result.billingCycle).toBe("yearly");
      expect(result.price).toBe(11800);
    });

    it("should handle all categories", async () => {
      const categories = ["entertainment", "work", "health", "education", "other"] as const;

      for (const category of categories) {
        const input: SubscriptionInput = { ...mockSubscriptionInput, category };
        const subscription: Subscription = {
          ...mockSubscription,
          ...input,
          id: `${category}-id`,
        };
        mockedStorage.createSubscription.mockResolvedValue(subscription);

        const result = await storage.createSubscription(input);

        expect(result.category).toBe(category);
      }
    });
  });

  describe("updateSubscription (mutation function)", () => {
    it("should call storage.updateSubscription with id and input", async () => {
      const updatedSubscription: Subscription = {
        ...mockSubscription,
        price: 1990,
        name: "Netflix Premium",
      };
      mockedStorage.updateSubscription.mockResolvedValue(updatedSubscription);

      const updateInput: SubscriptionInput = {
        ...mockSubscriptionInput,
        price: 1990,
        name: "Netflix Premium",
      };
      const result = await storage.updateSubscription("test-id-1", updateInput);

      expect(mockedStorage.updateSubscription).toHaveBeenCalledWith("test-id-1", updateInput);
      expect(result?.price).toBe(1990);
      expect(result?.name).toBe("Netflix Premium");
    });

    it("should return null for non-existent subscription", async () => {
      mockedStorage.updateSubscription.mockResolvedValue(null);

      const result = await storage.updateSubscription("non-existent", mockSubscriptionInput);

      expect(result).toBeNull();
    });

    it("should handle category changes", async () => {
      const updatedSubscription: Subscription = {
        ...mockSubscription,
        category: "work",
      };
      mockedStorage.updateSubscription.mockResolvedValue(updatedSubscription);

      const result = await storage.updateSubscription("test-id-1", {
        ...mockSubscriptionInput,
        category: "work",
      });

      expect(result?.category).toBe("work");
    });
  });

  describe("deleteSubscription (mutation function)", () => {
    it("should call storage.deleteSubscription with id", async () => {
      mockedStorage.deleteSubscription.mockResolvedValue(true);

      const result = await storage.deleteSubscription("test-id-1");

      expect(mockedStorage.deleteSubscription).toHaveBeenCalledWith("test-id-1");
      expect(result).toBe(true);
    });

    it("should return false for non-existent subscription", async () => {
      mockedStorage.deleteSubscription.mockResolvedValue(false);

      const result = await storage.deleteSubscription("non-existent");

      expect(result).toBe(false);
    });
  });
});

describe("Query key structure", () => {
  const QUERY_KEY = ["subscriptions"];

  it("should have correct base query key", () => {
    expect(QUERY_KEY).toEqual(["subscriptions"]);
  });

  it("should create correct query key for single subscription", () => {
    const id = "test-id";
    const singleQueryKey = [...QUERY_KEY, id];
    expect(singleQueryKey).toEqual(["subscriptions", "test-id"]);
  });
});
