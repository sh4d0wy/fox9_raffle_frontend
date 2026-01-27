import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_AVATAR = "/icons/user-avatar.png";

interface UserState {
  profilePicture: string;
  profilePictureVersion: number;
  isUploadingProfilePicture: boolean;
  profilePictureError: string | null;
  setProfilePicture: (picture: string) => void;
  updateProfilePictureVersion: () => void;
  setIsUploadingProfilePicture: (isUploading: boolean) => void;
  setProfilePictureError: (error: string | null) => void;
  resetProfilePicture: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profilePicture: DEFAULT_AVATAR,
      profilePictureVersion: Date.now(),
      isUploadingProfilePicture: false,
      profilePictureError: null,
      
      setProfilePicture: (picture: string) => set({ profilePicture: picture, profilePictureError: null }),
      
      updateProfilePictureVersion: () => set({ profilePictureVersion: Date.now() }),
      
      setIsUploadingProfilePicture: (isUploading: boolean) => set({ isUploadingProfilePicture: isUploading }),
      
      setProfilePictureError: (error: string | null) => set({ profilePictureError: error }),
      
      resetProfilePicture: () => set({ profilePicture: DEFAULT_AVATAR, profilePictureError: null }),
    }),
    {
      name: "fox-user-storage",
      partialize: (state) => ({ profilePicture: state.profilePicture, profilePictureVersion: state.profilePictureVersion }),
    }
  )
);

export { DEFAULT_AVATAR };
