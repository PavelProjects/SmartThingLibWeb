import { DeviceApi, FETCH_FAILED_CATION } from "../api";
import { Components } from "../components";
import { toast } from "../toast";

export const MetricsTab = {
  name: "Metrics",
  title: "Device metrics",
  content: async () => {
    const metrics = await DeviceApi.getMetrics();
    if (!metrics) {
      toast.error({
        caption: FETCH_FAILED_CATION,
        description: "Failed to fetch device metrics",
      });
      return;
    }
    return Components.tree(metrics);
  }
}