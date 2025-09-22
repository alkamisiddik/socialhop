'use client'
import { Drawer } from "antd";
import useWindowDimensions from "@/hooks/useWindowDimensions";
const SidebarContainer = ({
    isDrawrOpen,
    setIsDrawerOpen,
    children,
    ...other
}) => {
    const { width } = useWindowDimensions();

    if (width <= 1268) {
        return (
            <Drawer
                {...other}
                placement={"left"}
                open={isDrawrOpen}
                onClose={() => setIsDrawerOpen(false)}
                height={"100%"}
            >
                <div className='h-full'>{children}</div>
            </Drawer>
        );
    } else {
        return (children);
    }
};

export default SidebarContainer;