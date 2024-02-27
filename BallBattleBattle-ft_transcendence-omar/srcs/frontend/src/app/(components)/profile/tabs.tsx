import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import BasicInfo from "./info";
import Friends from "./firends";
import React from "react";
import LastMatch from "./last_matches";
import "./tabs.css"
import { User } from "./ProfileComp";

interface Props 
{
    user : User;
    userId?: number;
}
export function TabsDefault({userId, user}: Props) {
    const [activeTab, setActiveTab] = React.useState("info");
    React.useEffect(() => {
        function enableSliderBehavior(slider: HTMLElement) {
          let isDown = false;
          let startX: number;
          let scrollLeft: number;
    
          const handleMouseDown = (e: MouseEvent) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - (slider.offsetLeft || 0);
            scrollLeft = slider.scrollLeft || 0;
          };
          const handleMouseLeave = () => {
            isDown = false;
            slider.classList.remove('active');
          };
    
          const handleMouseUp = () => {
            isDown = false;
            slider.classList.remove('active');
          };
    
          const handleMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - (slider.offsetLeft || 0);
            const walk = (x - startX);
            slider.scrollLeft = (scrollLeft || 0) - walk;
          };
    
          slider.addEventListener('mousedown', handleMouseDown);
          slider.addEventListener('mouseleave', handleMouseLeave);
          slider.addEventListener('mouseup', handleMouseUp);
          slider.addEventListener('mousemove', handleMouseMove);
    
          return () => {
            slider.removeEventListener('mousedown', handleMouseDown);
            slider.removeEventListener('mouseleave', handleMouseLeave);
            slider.removeEventListener('mouseup', handleMouseUp);
            slider.removeEventListener('mousemove', handleMouseMove);
          };
        }
        const sliders = document.querySelectorAll('.our-tab-scroll');
        sliders.forEach((slider) => {
          enableSliderBehavior(slider as HTMLElement);
        });
    }, []);
    const data = [
        {
            label: 'BASIC INFO',
            value: 'info',
            width: 'min-w-[8.5rem] w-[8.5rem]',
            desc: <BasicInfo idUser={userId} user={user} />,
        },
        {
            label: "MATCHES",
            value: "matches",
            width: 'flex lg:hidden min-w-[8rem] w-[8rem]',
            desc: <LastMatch type={1}/>,
        },
        {
            label: "FRIENDS",
            value: "friends",
            width: 'min-w-[8rem] w-[8rem]',
            desc: <Friends ID={userId}/>,
        },
        // {
        //     label: "YOUR MATCHES",
        //     value: "your-matches",
        //     width: 'min-w-[10rem] w-[10rem] px-0 mx-0',
        //     desc: `here a component to show reciprocal matches`,
        // },
    ];
    return (
        <div className=" w-full">
            <Tabs value={activeTab} className=" relative">
                <TabsHeader
                    className="rounded-none border-blue-gray-50 bg-[#DAB6FF] bg-opacity-10 p-0 relative"
                    indicatorProps={{
                        className:
                            "bg-[#DAB6FF09] border-b-[4px] border-white shadow-none rounded-none",
                        }
                    }
                >
                    <div className=" w-full h-[62px]">
                        <div className="flex our-tab-scroll overflow-x-auto w-[100%] absolute">
                            {data.map(({ label, value , width }) => (
                                <Tab
                                    key={value}
                                    value={value}
                                    onClick={() => setActiveTab(value)}
                                    className={(activeTab === value ? " " : "text-opacity-60 ") + width + ' select-none text-[#fff] pt-5 pb-5 font-bold text-sm'}
                                >
                                    {label}
                                </Tab>
                            ))}
                        </div>
                    </div>
                </TabsHeader>
                <TabsBody>
                    {data.map(({ value, desc }) => (
                    <TabPanel key={value} value={value} className="">
                        {desc}
                    </TabPanel>
                    ))}
                </TabsBody>
            </Tabs>
        </div>
    );
}