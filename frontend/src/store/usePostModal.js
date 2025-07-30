import { create } from "zustand";

const usePostModal = create((set) => ({
  isOpen: false,
  mode: "create",
  jobData: null,

  openPostModal: (mode = "create", jobData) =>
    set({ isOpen: true, mode, jobData }),
  closePostModal: () => set({ isOpen: false, mode: "create", jobData: null }),
}));

export default usePostModal;
