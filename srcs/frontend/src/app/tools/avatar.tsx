import { Avatar } from "@material-tailwind/react";
 
export default function Avtr({ src}: { src: string; }) {
  return <Avatar
  src={src}
  alt="avatar"
  withBorder={true}
  className="p-0.5 rounded-full w-10 h-10"
/>;
}