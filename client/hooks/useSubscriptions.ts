import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as storage from "@/lib/storage";
import type { SubscriptionInput } from "@/types/subscription";

const QUERY_KEY = ["subscriptions"];

export function useSubscriptions() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: storage.getSubscriptions,
  });
}

export function useSubscription(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => storage.getSubscriptionById(id),
    enabled: !!id,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: SubscriptionInput) => storage.createSubscription(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: SubscriptionInput }) =>
      storage.updateSubscription(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => storage.deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
