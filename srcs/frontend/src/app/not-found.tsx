import Link from "next/link";

const NotFound = () => {
    return (
        <main className="w-full h-full flex items-center flex-col justify-center ">
            <h2 className="text-3xl">
                404: Page not found
            </h2>
            <div> try to Browse <Link className=" text-purple-600" href='/'>Home</Link> </div>
        </main>
    );
}
export default NotFound;