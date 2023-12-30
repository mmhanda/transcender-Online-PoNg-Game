import Image from "next/image";

const NoOne = () => {
    return (
        <div>
            <div className="flex h-[calc(100vh-80px)] items-center justify-center p-5 w-full bg-[#4f4270]">
                <div className="flex items-center justify-between flex-col">
                             <Image unoptimized  src='/noone.png' alt="Branze" width={100} height={100} />
                    <h1 className="mt-5 text-[36px] font-bold text-white lg:text-[50px]">This User is No One</h1>
                    {/* <p className="text-white mt-5 lg:text-lg">Oops something went wrong. Try to refresh this page or <br /> feel free to contact us if the problem presists.</p> */}
                </div>
            </div>
        </div>
    );
}

export default NoOne;