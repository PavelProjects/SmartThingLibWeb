import { DeviceApi, FETCH_FAILED_CATION } from "../api";
import { Components } from "../components";
import { toast } from "../toast";

export const MetricsTab = {
  name: "Metrics",
  title: "Device metrics",
  content: async () => {
    try {
      return Components.tree(await DeviceApi.metrics());
    } catch (error) {
      console.log(error)
      toast.error({
        caption: FETCH_FAILED_CATION,
        description: "Failed to fetch device metrics",
      });
    }
  }
}