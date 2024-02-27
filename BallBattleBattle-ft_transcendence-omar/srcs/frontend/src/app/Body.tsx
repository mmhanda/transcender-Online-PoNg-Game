import { FC } from "react";
import MyApp from "./app";
interface StartApp {
    Pathname: string;
    setter: any;
    children: React.ReactNode;
}
const Body: FC<StartApp> = ({ Pathname, setter, children }) => {
    return (
        <MyApp Pathname={Pathname} setter={setter}>
            {children}
        </MyApp>
    )
};

export default Body;