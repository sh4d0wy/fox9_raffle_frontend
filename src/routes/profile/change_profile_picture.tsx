import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/change_profile_picture')({
  component: RouteComponent,
})

function RouteComponent() {
  return <main className='bg-black-1100'>
    <section className='w-full min-h-screen md:pt-48 pt-36 pb-16 px-4'>
        <div className="w-full max-w-[1000px] mx-auto ">
            <div className="w-full mb-10">
                <h1 className="md:text-[40px] text-3xl text-center font-semibold text-white mb-3">Change Profile Picture</h1>
                <p className='md:text-xl text-base font-inter text-center text-cream-1000'>Upload a new profile picture</p>
            </div>

            <div className="w-full flex flex-col md:flex-row md:gap-[100px] gap-10 md:p-8 px-4 py-8 rounded-[12px] bg-primary-color/10">
                <div className="md:w-1/3 w-full text-center flex flex-col items-center">
                <h3 className='text-2xl font-inter font-semibold text-white mb-6'>Current Picture</h3>
                <div className="w-[175px] h-[175px] relative">
                    <div className="w-full h-full rounded-full border-2 border-primary-color bg-gray-1200 flex items-center justify-center">
                        <img src="/images/default_profile_picture.png" className="rounded-full object-cover" />
                        <div className="absolute bottom-0 right-0">
                            <img src="/images/profile-pic-checked.svg" alt="" />
                        </div>
                    </div>
                </div>

                </div>

                <form className="md:w-2/3 flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-2">
                        <label className="text-white gap-3 px-4 py-10 cursor-pointer border-2 border-dashed border-gray-1000 font-medium text-lg md:h-[217px] bg-black-1400 rounded-[12px] flex items-center justify-center flex-col" htmlFor="profilePicture">
                        <input 
                            type="file" 
                            id="profilePicture" 
                            accept="image/*" 
                            hidden
                            className="w-full p-3 rounded-[8px] bg-black-1000 border border-gray-800 text-white"
                        />

                        <h4 className='text-center text-white font-inter font-medium'>Drag & drop your image here</h4>
                        <h4 className='text-center text-white md:text-base text-sm font-inter font-medium'>or</h4>
                        <div className="bg-primary-color md:text-base text-sm rounded-full py-1.5 px-10 text-black-1000">Browse Files</div>
                        <p className='text-center text-gray-1000 font-medium text-sm'>PNG, JPG Max 5MB Square images recommended</p>

                        </label>

                    </div>
                <div className="grid md:grid-cols-3 grid-cols-2 gap-5">
                    <div className="hidden md:block"></div>
                         <button 
                        type="button" 
                        className="w-full hover:bg-primary-color hover:text-black-1000 hover:border-primary-color cursor-pointer py-3 border border-gray-1200 text-gray-1200 font-semibold rounded-full hover:opacity-90 transition duration-300"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="w-full hover:bg-transparent hover:text-primary-color border border-transparent hover:border-primary-color cursor-pointer py-3 bg-primary-color text-black-1000 font-semibold rounded-full hover:opacity-90 transition duration-300"
                    >
                        Save
                    </button>

                </div>
                   
                </form>

            </div>

        </div>
    </section>
  </main>
}
