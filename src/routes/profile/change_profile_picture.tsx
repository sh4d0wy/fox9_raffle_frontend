import { API_URL } from '@/constants';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { updateProfilePicture } from 'api/routes/userRoutes';
import { DEFAULT_AVATAR, useUserStore } from 'store/userStore';
import { toast } from 'react-toastify';
import { useEffect, useMemo, useState } from 'react';
import { useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMyProfile } from 'hooks/profile/useMyProfile';
import { motion } from 'motion/react';
export const Route = createFileRoute('/profile/change_profile_picture')({
  component: RouteComponent,
})

function RouteComponent() {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragCounter = useRef(0);
    const navigate = useNavigate();
    const { 
        profilePicture, 
        setProfilePicture, 
        isUploadingProfilePicture, 
        setIsUploadingProfilePicture,
        setProfilePictureError,
        updateProfilePictureVersion
      } = useUserStore();
      const {publicKey} = useWallet();
      const {data:profileData} = useMyProfile(!!publicKey && !!localStorage.getItem("authToken"));
      const queryClient = useQueryClient();
      const currentImage = useMemo(() => profilePicture?profilePicture: DEFAULT_AVATAR, [profilePicture]);
      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          processFile(file);
        }
      };
      const processFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload an image file");
          return;
        }
    
        if (file.size > 300 * 1024) {
          toast.error("Image size should be less than 300kb");
          return;
        }
    
        setSelectedFile(file);
    
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      };

      const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
      };

      const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        dragCounter.current++;
        if (dragCounter.current === 1) {
          setIsDragging(true);
        }
      };
    
      const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        dragCounter.current--;
        if (dragCounter.current === 0) {
          setIsDragging(false);
        }
      };
    
      const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        dragCounter.current = 0;
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
          processFile(file);
        }
      };

      const triggerFileInput = () => {
        fileInputRef.current?.click();
      };

      const handleProfilePictureChange = async (file: File, previewUrl: string) => {
        try {
          setIsUploadingProfilePicture(true);
          setProfilePictureError(null);
          
          const response = await updateProfilePicture(file);
          console.log(response);
          if (response.user.profileImage) {
            console.log("inside if")
            const fullImageUrl = `${API_URL}${response.user.profileImage}?t=${Date.now()}`;
            console.log(fullImageUrl);
            setProfilePicture(fullImageUrl);
            updateProfilePictureVersion();
            queryClient.invalidateQueries({ queryKey: ["my-profile"] });
            queryClient.invalidateQueries({ queryKey: ["profile-raffle-created", publicKey?.toBase58()] });
            queryClient.invalidateQueries({ queryKey: ["profile-raffle-purchased", publicKey?.toBase58()] });
            queryClient.invalidateQueries({ queryKey: ["profile-raffle-favourite", publicKey?.toBase58()] });
            queryClient.invalidateQueries({ queryKey: ["profile-gumball-created", publicKey?.toBase58()] });
            queryClient.invalidateQueries({ queryKey: ["profile-gumball-purchased", publicKey?.toBase58()] });
            queryClient.invalidateQueries({ queryKey: ["profile-gumball-favourite", publicKey?.toBase58()] });
            queryClient.invalidateQueries({ queryKey: ["profile-auction-created", publicKey?.toBase58()] });
            queryClient.invalidateQueries({ queryKey: ["profile-auction-purchased", publicKey?.toBase58()] });
            queryClient.invalidateQueries({ queryKey: ["profile-auction-favourite", publicKey?.toBase58()] });
            queryClient.invalidateQueries({ queryKey: ["favourite-raffle", publicKey?.toBase58()] });
            queryClient.invalidateQueries({ queryKey: ["favourite-gumball", publicKey?.toBase58()] });
            queryClient.invalidateQueries({ queryKey: ["favourite-auction", publicKey?.toBase58()] });
            queryClient.invalidateQueries({ queryKey: ["profile-raffle-stats", publicKey?.toBase58()] });
            queryClient.invalidateQueries({ queryKey: ["profile-gumball-stats", publicKey?.toBase58()] });
            queryClient.invalidateQueries({ queryKey: ["profile-auction-stats", publicKey?.toBase58()] });
          }
          
          toast.success("Profile picture updated successfully!");
        } catch (error) {
          console.error("Failed to update profile picture:", error);
          setProfilePictureError("Failed to update profile picture");
          toast.error("Failed to update profile picture. Please try again.");
        } finally {
          setIsUploadingProfilePicture(false);
        }
      };

      const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedFile && previewImage) {
          await handleProfilePictureChange(selectedFile, previewImage);
          navigate({ to: "/profile" });
        }
      };

      useEffect(() => {
        if (profileData?.user?.profileImage) {
          // Add cache-busting timestamp to ensure fresh image is loaded
          const fullImageUrl = `${API_URL}${profileData.user.profileImage}?t=${Date.now()}`;
          setProfilePicture(fullImageUrl);
        } else if (profileData?.user) {
          setProfilePicture(DEFAULT_AVATAR);
        }
      }, [profileData, setProfilePicture]);

  return <main className='bg-black-1100'>
    <motion.section 
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -100 }}
    transition={{ duration: 0.3 }}
    onDragOver={isUploadingProfilePicture ? undefined : handleDragOver}
    onDragEnter={isUploadingProfilePicture ? undefined : handleDragEnter}
    onDragLeave={isUploadingProfilePicture ? undefined : handleDragLeave}
    onDrop={isUploadingProfilePicture ? undefined : handleDrop}
    className='w-full min-h-screen md:pt-48 pt-36 pb-16 px-4'>
        <div className="w-full max-w-[1000px] mx-auto ">
            <div className="w-full mb-10">
                <h1 className="md:text-[40px] text-3xl text-center font-semibold text-white mb-3">Change Profile Picture</h1>
                <p className='md:text-xl text-base font-inter text-center text-cream-1000'>Upload a new profile picture</p>
            </div>

            <div className="w-full flex flex-col md:flex-row md:gap-[100px] gap-10 md:p-8 px-4 py-8 rounded-[12px] bg-primary-color/10">
                <div className="md:w-1/3 w-full text-center flex flex-col items-center">
                <h3 className='text-2xl font-inter font-semibold text-white mb-6'>{previewImage ? "New Image Preview" : "Current Picture"}</h3>
                <div className="w-[175px] h-[175px] relative">
                    <div className="w-full h-full rounded-full border-2 border-primary-color bg-gray-1200 flex items-center justify-center">
                        <img src={previewImage || currentImage} className="object-cover w-full h-full rounded-full" />
                    </div>
                </div>

                </div>

                <form onSubmit={handleSave} className="md:w-2/3 flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-2 hover:bg-primary-color/10 transition duration-300 rounded-[12px] p-4">
                        <label className="text-white gap-3 px-4 py-10 cursor-pointer border-2 border-dashed border-gray-1000 font-medium text-lg md:h-[217px] bg-black-1400 rounded-[12px] flex items-center justify-center flex-col" htmlFor="profilePicture">
                        <input 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            type="file" 
                            id="profilePicture" 
                            accept="image/*" 
                            hidden
                            disabled={isUploadingProfilePicture}
                            className="w-full p-3 object-cover bg-black-1000 border border-gray-800 text-white"
                        />

                        <h4 className='text-center text-white font-inter font-medium'>{isDragging ? "Drop the image here" : "Drag & drop your image here"}</h4>
                        <h4 className='text-center text-white md:text-base text-sm font-inter font-medium'>or</h4>
                        <div className={`bg-primary-color md:text-base text-sm rounded-full py-1.5 px-10 text-black-1000 ${isUploadingProfilePicture ? "opacity-50 cursor-not-allowed" : ""}`} onClick={(e) => { e.stopPropagation(); e.preventDefault(); triggerFileInput(); }}>Browse Files</div>
                        <p className='text-center text-gray-1000 font-medium text-sm'>PNG, JPG Max 300kb Square images recommended</p>

                        </label>

                    </div>
                <div className="grid  grid-cols-2 gap-5 place-items-center w-full">
                         <button 
                        type="button" 
                        disabled={isUploadingProfilePicture}
                        className="w-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105  cursor-pointer py-3 border border-gray-1200 text-gray-1200 font-semibold rounded-full hover:opacity-90 transition duration-300"
                        onClick={() => navigate({ to: "/profile" })}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isUploadingProfilePicture || !selectedFile || !previewImage}
                        className="w-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 border border-transparent cursor-pointer py-3 bg-primary-color text-black-1000 font-semibold rounded-full hover:opacity-90 transition duration-300"
                    >
                        {isUploadingProfilePicture ? "Saving..." : "Save"}
                    </button>

                </div>
                   
                </form>

            </div>

        </div>
    </motion.section>
  </main>
}
