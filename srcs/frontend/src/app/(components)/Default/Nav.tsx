import { Link } from 'react-scroll';
import LoginBtn from './btnLogin/btn';
const Nav = ({setLogin}:any) => {
    return (
        <div className="mt-6 md:mx-12 mx-4">
            <nav className="flex py-4 sm:justify-between">
                <div className="text-white flex items-center gap-2 text-2xl mr-8">
                    <h2 className=" text-white ">
                        <span className=" font-medium text-white opacity-[.9] ">Ball</span>
                        <span className=" font-normal text-white opacity-50 ">Battle</span>
                    </h2>
                </div>
                <div className="text-gray-400 gap-4 items-center pl-8 pr-8 hidden md:flex">
                    <Link smooth='true' to="#" className=" cursor-pointer text-white ">Home</Link>
                    <Link smooth='true' to="leaderboard" className=" cursor-pointer hover:text-white">Leaderboard</Link>
                    <Link smooth='true' to="matches-section" className=" cursor-pointer hover:text-white  ">Gameplays</Link>
                    <Link smooth='true' to="rooms-section" className=" cursor-pointer hover:text-white  ">Rooms</Link>
                </div>
                <LoginBtn setLogin={setLogin} />
            </nav>
        </div>
    )
}

export default Nav;