import { create } from "zustand";
import axiosInstance from "../utils/axiosInstence";

const useJobStore = create((set, get) => ({
  isLoading: false,
  data: null,
  saveData: null,
  lastFetchedAllUrl: null,
  lastFetchedSaveUrl: null,

  allJobData: async (url, force = false) => {
    const { lastFetchedAllUrl, data } = get();
    if (!force && data && lastFetchedAllUrl === url) {
      return data;
    }
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(url);
      set({
        data: res.data.allPosts,
        lastFetchedAllUrl: url,
        isLoading: false,
      });
      return res.data.allPosts;
    } catch (error) {
      console.error("API Error:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  savedPostData: async (url, force = false) => {
    const { lastFetchedSaveUrl, saveData } = get();
    if (!force && saveData && lastFetchedSaveUrl === url) {
      return saveData;
    }
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(url);
      set({
        saveData: res.data.allposts,
        lastFetchedSaveUrl: url,
        isLoading: false,
      });
      return res.data.allPosts;
    } catch (error) {
      console.error("API Error:", error);
      set({ isLoading: false });
      throw error;
    }
  },
}));

export default useJobStore;
