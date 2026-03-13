import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { showToast } from "@/lib/showToast";

const useDeleteMutation = (queryKey, deleteEndpoint) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, deleteType }) => {
      if (!ids || !deleteType) {
        throw new Error("Invalid delete request");
      }

      const { data: response } = await axios({
        url: deleteEndpoint,
        method: deleteType === "PD" ? "DELETE" : "PUT",
        data: { ids, deleteType },
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },

    onSuccess: (data) => {
      showToast("success", data.message || "Deleted successfully");

      // React Query v5 correct syntax
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },

    onError: (error) => {
      showToast("error", error.message || "Delete failed");
    },
  });
};

export default useDeleteMutation;