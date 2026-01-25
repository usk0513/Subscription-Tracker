import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptionById,
} from "@/lib/storage";
import type { SubscriptionInput } from "@/types/subscription";

const SUBSCRIPTIONS_KEY = "@subscriptions";

const mockSubscriptionInput: SubscriptionInput = {
  name: "Netflix",
  price: 1490,
  billingCycle: "monthly",
  startDate: "2024-01-15",
  category: "entertainment",
  managementUrl: "https://netflix.com/account",
};

describe("Storage Functions", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe("getSubscriptions", () => {
    it("should return empty array when no subscriptions exist", async () => {
      const result = await getSubscriptions();
      expect(result).toEqual([]);
    });

    it("should return stored subscriptions", async () => {
      const mockData = [
        { id: "1", name: "Netflix", price: 1490 },
        { id: "2", name: "Spotify", price: 980 },
      ];
      await AsyncStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(mockData));

      const result = await getSubscriptions();
      expect(result).toEqual(mockData);
    });

    it("should return empty array on parse error", async () => {
      await AsyncStorage.setItem(SUBSCRIPTIONS_KEY, "invalid json");

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      const result = await getSubscriptions();

      expect(result).toEqual([]);
      consoleSpy.mockRestore();
    });
  });

  describe("createSubscription", () => {
    it("should create a new subscription with generated id and timestamps", async () => {
      const result = await createSubscription(mockSubscriptionInput);

      expect(result.id).toBeDefined();
      expect(result.name).toBe("Netflix");
      expect(result.price).toBe(1490);
      expect(result.billingCycle).toBe("monthly");
      expect(result.category).toBe("entertainment");
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it("should persist the subscription to storage", async () => {
      await createSubscription(mockSubscriptionInput);

      const stored = await AsyncStorage.getItem(SUBSCRIPTIONS_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe("Netflix");
    });

    it("should add to existing subscriptions", async () => {
      await createSubscription(mockSubscriptionInput);
      await createSubscription({
        ...mockSubscriptionInput,
        name: "Spotify",
        price: 980,
      });

      const stored = await AsyncStorage.getItem(SUBSCRIPTIONS_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed).toHaveLength(2);
    });
  });

  describe("updateSubscription", () => {
    it("should update an existing subscription", async () => {
      const created = await createSubscription(mockSubscriptionInput);
      const updatedInput: SubscriptionInput = {
        ...mockSubscriptionInput,
        price: 1990,
        name: "Netflix Premium",
      };

      const result = await updateSubscription(created.id, updatedInput);

      expect(result).not.toBeNull();
      expect(result!.price).toBe(1990);
      expect(result!.name).toBe("Netflix Premium");
      expect(result!.id).toBe(created.id);
      expect(result!.createdAt).toBe(created.createdAt);
      expect(new Date(result!.updatedAt).getTime()).toBeGreaterThan(
        new Date(created.updatedAt).getTime() - 1000
      );
    });

    it("should return null for non-existent subscription", async () => {
      const result = await updateSubscription(
        "non-existent-id",
        mockSubscriptionInput
      );
      expect(result).toBeNull();
    });

    it("should persist the updated subscription", async () => {
      const created = await createSubscription(mockSubscriptionInput);
      await updateSubscription(created.id, {
        ...mockSubscriptionInput,
        price: 1990,
      });

      const stored = await AsyncStorage.getItem(SUBSCRIPTIONS_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed[0].price).toBe(1990);
    });
  });

  describe("deleteSubscription", () => {
    it("should delete an existing subscription", async () => {
      const created = await createSubscription(mockSubscriptionInput);

      const result = await deleteSubscription(created.id);

      expect(result).toBe(true);
    });

    it("should remove subscription from storage", async () => {
      const created = await createSubscription(mockSubscriptionInput);
      await deleteSubscription(created.id);

      const stored = await AsyncStorage.getItem(SUBSCRIPTIONS_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed).toHaveLength(0);
    });

    it("should return false for non-existent subscription", async () => {
      const result = await deleteSubscription("non-existent-id");
      expect(result).toBe(false);
    });

    it("should only delete the specified subscription", async () => {
      const sub1 = await createSubscription(mockSubscriptionInput);
      const sub2 = await createSubscription({
        ...mockSubscriptionInput,
        name: "Spotify",
      });

      await deleteSubscription(sub1.id);

      const stored = await AsyncStorage.getItem(SUBSCRIPTIONS_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].id).toBe(sub2.id);
    });
  });

  describe("getSubscriptionById", () => {
    it("should return the subscription with matching id", async () => {
      const created = await createSubscription(mockSubscriptionInput);

      const result = await getSubscriptionById(created.id);

      expect(result).not.toBeNull();
      expect(result!.id).toBe(created.id);
      expect(result!.name).toBe("Netflix");
    });

    it("should return null for non-existent id", async () => {
      const result = await getSubscriptionById("non-existent-id");
      expect(result).toBeNull();
    });

    it("should find correct subscription among multiple", async () => {
      await createSubscription(mockSubscriptionInput);
      const target = await createSubscription({
        ...mockSubscriptionInput,
        name: "Spotify",
      });
      await createSubscription({
        ...mockSubscriptionInput,
        name: "YouTube Premium",
      });

      const result = await getSubscriptionById(target.id);

      expect(result!.name).toBe("Spotify");
    });
  });
});
