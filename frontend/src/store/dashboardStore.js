import { create } from 'zustand';
import dashboardService from '../services/dashboardService';

let isFetching = false;

export const useDashboardStore = create((set, get) => ({
  data: {
    monthlyRevenue: [],
    topProducts: [],
    topCustomers: [],
    deliveryStats: {},
    revenueInsights: {},
    productInsights: {},
    customerInsights: {},
    qualityInsights: {},
    geographyInsights: {},
    stateData: [],
  },
  loading: false,
  error: null,

  fetchAllData: async () => {
    if (isFetching) {
      return;
    }

    isFetching = true;
    set({ loading: true, error: null });

    try {
      const monthlyRevenueRes = await dashboardService.getMonthlyRevenue();
      const monthlyRevenue = monthlyRevenueRes.data?.data || monthlyRevenueRes.data || [];

      const topProductsRes = await dashboardService.getTopProducts();
      const topProducts = topProductsRes.data?.data || topProductsRes.data || [];

      const topCustomersRes = await dashboardService.getTopCustomers();
      const topCustomers = topCustomersRes.data?.data || topCustomersRes.data || [];

      const deliveryStatsRes = await dashboardService.getDeliveryStats();
      const deliveryStats = deliveryStatsRes.data?.data || deliveryStatsRes.data || {};

      const revenueInsightsRes = await dashboardService.getRevenueInsights();
      const revenueInsights = revenueInsightsRes.data?.data || revenueInsightsRes.data || {};

      const productInsightsRes = await dashboardService.getProductInsights();
      const productInsights = productInsightsRes.data?.data || productInsightsRes.data || {};

      const customerInsightsRes = await dashboardService.getCustomerInsights();
      const customerInsights = customerInsightsRes.data?.data || customerInsightsRes.data || {};

      const qualityInsightsRes = await dashboardService.getQualityInsights();
      const qualityInsights = qualityInsightsRes.data?.data || qualityInsightsRes.data || {};

      const geographyInsightsRes = await dashboardService.getGeographyInsights();
      const geographyInsights = geographyInsightsRes.data?.data || geographyInsightsRes.data || {};

      const stateDataRes = await dashboardService.getStateData();
      const stateData = stateDataRes.data?.data || stateDataRes.data || [];

      set({
        data: {
          monthlyRevenue: Array.isArray(monthlyRevenue) ? monthlyRevenue : [],
          topProducts: Array.isArray(topProducts) ? topProducts : [],
          topCustomers: Array.isArray(topCustomers) ? topCustomers : [],
          deliveryStats: typeof deliveryStats === 'object' ? deliveryStats : {},
          revenueInsights: typeof revenueInsights === 'object' ? revenueInsights : {},
          productInsights: typeof productInsights === 'object' ? productInsights : {},
          customerInsights: typeof customerInsights === 'object' ? customerInsights : {},
          qualityInsights: typeof qualityInsights === 'object' ? qualityInsights : {},
          geographyInsights: typeof geographyInsights === 'object' ? geographyInsights : {},
          stateData: Array.isArray(stateData) ? stateData : [],
        },
        loading: false,
      });

    } catch (error) {
      set({
        error: error.message || 'Failed to fetch data',
        loading: false,
      });
    } finally {
      isFetching = false;
    }
  },
}));