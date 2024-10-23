import { DeviceApi, FETCH_FAILED_CATION } from "../api";
import { Components } from "../components";
import { toast } from "../toast";

export const MetricsTab = {
  name: "Metrics",
  content: async () => {
    const { data } = await DeviceApi.metrics().catch(() => toast.error({
      caption: FETCH_FAILED_CATION,
      description: "Failed to fetch device metrics",
    }))
    return Components.tree(data);
  },
};
