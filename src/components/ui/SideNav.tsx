import { Role } from "@prisma/client";
import {
    HomeIcon,
    LineChartIcon,
    LogOutIcon,
    SettingsIcon,
    UsersIcon,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
    ComponentPropsWithoutRef,
    ReactNode,
    useEffect,
    useState,
} from "react";
import { api } from "~/utils/api";
import { displayName } from "~/utils/string-utils";

interface SideMenuProps extends ComponentPropsWithoutRef<"div"> {
    active?: boolean;
    icon: ReactNode;
    name: string;
    url?: string;
    role?: Role;
}
const Menus: SideMenuProps[] = [
    {
        icon: <HomeIcon />,
        name: "Home",
        url: "/",
    },
    {
        icon: <LineChartIcon />,
        name: "Analytic",
        url: "/analytic",
        role: Role.COMPANY,
    },
    {
        icon: <UsersIcon />,
        name: "User Company",
        url: "/user/",
        role: Role.ADMIN,
    },
    {
        icon: <SettingsIcon />,
        name: "Config Segmentation",
        url: "/configuration",
        role: Role.ADMIN,
    },
];
const SideNav = () => {
    const router = useRouter();
    const { status, data } = useSession();
    console.log("data", data);
    const [activePage, setActivePage] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const { data: userData } = api.user.findById.useQuery(data?.user.id ?? "", {
        enabled: data?.user ? true : false,
    });
    useEffect(() => {
        if (typeof window !== "undefined" && window.localStorage) {
            if (userData && !localStorage.getItem("image")) {
                localStorage.setItem("image", userData.image ?? "");
            }
            setImage(userData?.image ?? "");
        }
    }, [userData]);
    return (
        <nav className="sticky left-0 top-0 h-screen w-full max-w-[16rem] px-2 py-4">
            <div className="flex h-full flex-col items-center px-5 pt-5">
                <div className="mb-6 flex w-full items-center justify-start gap-3 rounded-xl">
                    <Image
                        alt="avatar"
                        src={
                            image ||
                            "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20360%20360%22%20fill%3D%22none%22%20shape-rendering%3D%22auto%22%20width%3D%22128%22%20height%3D%22128%22%3E%3Cdesc%3E%22Avatar%20Illustration%20System%22%20by%20%22Micah%20Lanier%22%2C%20licensed%20under%20%22CC%20BY%204.0%22.%20%2F%20Remix%20of%20the%20original.%20-%20Created%20with%20dicebear.com%3C%2Fdesc%3E%3Cmetadata%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%3E%3Crdf%3ARDF%3E%3Ccc%3AWork%3E%3Cdc%3Atitle%3EAvatar%20Illustration%20System%3C%2Fdc%3Atitle%3E%3Cdc%3Acreator%3E%3Ccc%3AAgent%20rdf%3Aabout%3D%22https%3A%2F%2Fdribbble.com%2Fmicahlanier%22%3E%3Cdc%3Atitle%3EMicah%20Lanier%3C%2Fdc%3Atitle%3E%3C%2Fcc%3AAgent%3E%3C%2Fdc%3Acreator%3E%3Cdc%3Asource%3Ehttps%3A%2F%2Fwww.figma.com%2Fcommunity%2Ffile%2F829741575478342595%3C%2Fdc%3Asource%3E%3Ccc%3Alicense%20rdf%3Aresource%3D%22https%3A%2F%2Fcreativecommons.org%2Flicenses%2Fby%2F4.0%2F%22%20%2F%3E%3C%2Fcc%3AWork%3E%3C%2Frdf%3ARDF%3E%3C%2Fmetadata%3E%3Cmask%20id%3D%22viewboxMask%22%3E%3Crect%20width%3D%22360%22%20height%3D%22360%22%20rx%3D%220%22%20ry%3D%220%22%20x%3D%220%22%20y%3D%220%22%20fill%3D%22%23fff%22%20%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23viewboxMask)%22%3E%3Cg%20transform%3D%22translate(80%2023)%22%3E%3Cpath%20d%3D%22M154%20319.5c-14.4-20-25.67-58.67-27-78L58.5%20212%2030%20319.5h124Z%22%20fill%3D%22%23ac6651%22%20stroke%3D%22%23000%22%20stroke-width%3D%224%22%2F%3E%3Cpath%20d%3D%22M130.37%20263.69c-2.1.2-4.22.31-6.37.31-30.78%200-56.05-21.57-58.76-49.1L127%20241.5c.38%205.48%201.55%2013.32%203.37%2022.19Z%22%20fill%3D%22%23000%22%20style%3D%22mix-blend-mode%3Amultiply%22%2F%3E%3Cpath%20d%3D%22M181.94%20151.37v.01l.1.4.14.65A75.72%2075.72%200%200%201%2034.93%20187.7l-.2-.74L18%20117.13l-.06-.29A75.72%2075.72%200%200%201%20165.2%2081.55l.05.21.02.08.05.2.05.2v.01l16.4%2068.44.08.34.08.34Z%22%20fill%3D%22%23ac6651%22%20stroke%3D%22%23000%22%20stroke-width%3D%224%22%2F%3E%3Cg%20transform%3D%22translate(34%20102.3)%22%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(170%20183)%22%3E%3Cpath%20d%3D%22M-.5%2017.5c2.5%2017%2031%2025%2057%205.5%22%20stroke%3D%22%23000000%22%20stroke-width%3D%224%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(110%20102)%22%3E%3Cpath%20d%3D%22M99%2010.21c5.67-2.66%2019-5.1%2027%206.5M23.58%2035.52c2.07-5.9%209.68-17.12%2023.56-14.7%22%20stroke%3D%22%23000000%22%20stroke-width%3D%224%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(49%2011)%22%3E%3Cg%20fill%3D%22%236bd9e9%22%3E%3Cpath%20opacity%3D%22.1%22%20d%3D%22M187.99%2077.18c-8-6.4-21.84-7-27.5-6.5l-8-26.5c13.6%203.2%2032%2024%2035.5%2033Z%22%2F%3E%3Cpath%20d%3D%22M85.8%2011.76S91.52%207.8%20115.74%201.7c24.21-6.1%2033.04-3.72%2033.04-3.72l11.8%2072.84s-8.05-.18-28.04%204.19c-20%204.38-29.56%209.67-29.56%209.67l-17.2-72.9Z%22%2F%3E%3Cpath%20d%3D%22M48.99%2086.68c-6.8-41.6%2023.33-68.17%2037-75.5l16.98%2073.5c-19.2-39.6-45.33-15.17-54%202Z%22%2F%3E%3Cpath%20opacity%3D%22.1%22%20d%3D%22M67.49%20130.68c-7.2-27.2%2022-41.84%2035.5-46-7-16.34-23-31-42.5-13-18%2030.5-11%2054-5.5%2072l12.5-13Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(142%20119)%22%3E%3Cpath%20d%3D%22M26.47%2024.36c1.86%206.36-5.04%201.48-11.4%203.33-6.36%201.86-9.78%209.76-11.64%203.4a12%2012%200%200%201%2023.04-6.73ZM90.26%2015.17c1.64%206.42-4.7%201.52-11.11%203.15-6.43%201.64-10.51%209.19-12.15%202.77a12%2012%200%201%201%2023.26-5.92Z%22%20fill%3D%22%23D2EFF3%22%2F%3E%3Cpath%20d%3D%22M5.29%2034.07c.11.82%201.14%201%201.72.41%202.46-2.52%206.25-4.36%2010.65-4.89%202.6-.3%205.1-.12%207.32.48.75.2%201.5-.44%201.23-1.17A10.84%2010.84%200%200%200%205.3%2034.07ZM69.38%2024.07c.12.82%201.15%201%201.73.41%202.44-2.48%206.19-4.3%2010.54-4.83%202.56-.3%205.03-.12%207.23.47.75.2%201.5-.44%201.23-1.17a10.74%2010.74%200%200%200-20.73%205.12Z%22%20fill%3D%22%23000000%22%2F%3E%3Cg%20transform%3D%22translate(-40%20-8)%22%3E%3Cg%20stroke%3D%22%23ffeba4%22%20stroke-width%3D%224%22%3E%3Cpath%20d%3D%22M34.5%2042.5%200%2049.12%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M35.47%2018.53%2074.2%2013.1a6%206%200%200%201%206.77%205.1l5.57%2039.62a6%206%200%200%201-5.1%206.78l-34.48%204.84a6%206%200%200%201-6.65-4.48l-9.81-39.01a6%206%200%200%201%204.98-7.4ZM145.92%203.22%20107.2%208.66a6%206%200%200%200-5.1%206.78l5.56%2039.6a6%206%200%200%200%206.78%205.11l34.47-4.84a6%206%200%200%200%205.16-6.14l-1.32-40.2a6%206%200%200%200-6.83-5.75ZM83.5%2037.12l22-3.5%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22rotate(-8%201149.44%20-1186.92)%22%3E%3Cpath%20d%3D%22M12.3%2012.34c5.45-1.24%2014.38.62%2012.42%2010.54-1.74%208.82-11.1%209.3-13.72%206.82%22%20stroke%3D%22%23000%22%20stroke-width%3D%224%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(84%20154)%22%3E%3Cpath%20d%3D%22M37%208.25V7.13l-.95-.59A24.91%2024.91%200%200%200%2023.08%203C17.44%203%2012.16%204.75%208.4%208.3c-3.8%203.58-5.86%208.83-5.31%2015.37.52%206.37%202.66%2011.06%206.2%2014.17-.29%201-.37%202.08-.24%203.21a8.98%208.98%200%200%200%204.6%207.08C16.09%2049.5%2019.2%2050%2022.52%2050c5.48%200%2010.29-2.95%2013.95-6.89l.53-.57V8.25Z%22%20stroke%3D%22%23000%22%20stroke-width%3D%224%22%2F%3E%3Cpath%20d%3D%22M42.97%2023.98c.07-.65.1-1.3.1-1.98%200-10.22-9.5-17-20-17C12.6%205%204.09%2011.5%205.09%2023.5c.56%206.68%202.95%2011.07%206.65%2013.72a5.7%205.7%200%200%200-.68%203.6C11.68%2046.1%2016.19%2048%2022.52%2048c11.1%200%2019.9-14.05%2020.45-24.02Z%22%20fill%3D%22%23ac6651%22%2F%3E%3Cpath%20d%3D%22M27.5%2013.5c-4-1.83-12.8-2.8-16%208%22%20stroke%3D%22%23000%22%20stroke-width%3D%224%22%2F%3E%3Cpath%20d%3D%22M17%2014c2.17%201.83%206.3%207.5%205.5%2015.5%22%20stroke%3D%22%23000%22%20stroke-width%3D%224%22%2F%3E%3Cg%20transform%3D%22translate(3%2042)%22%3E%3Cpath%20d%3D%22M24%200A24%2024%200%201%201%200%2024c0-6.4%203.5-11.5%206.57-16.5L7.5%206%22%20stroke%3D%22%23f4d150%22%20stroke-width%3D%224%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(53%20272)%22%3E%3Cg%20stroke%3D%22%23000%22%20stroke-width%3D%224%22%3E%3Cpath%20d%3D%22M260.7%2091H-12.64C3.67%2061.66%2026.86%2042.98%2064.44%2034.4c16.02-3.65%2034.67-5.47%2056.56-5.47%209.46%200%2016.81%201.44%2023.8%203.35%202.58.7%205.18%201.5%207.84%202.3%204.4%201.34%208.97%202.72%2013.91%203.86l.14.03.15.01c46.12%203.8%2073.78%2024.3%2093.85%2052.5Z%22%20fill%3D%22%236bd9e9%22%2F%3E%3Cpath%20d%3D%22m52.93%2036.58%209.15-19.6a1%201%200%200%201%201.25-.51c37.93%2013.42%2072.43%2012.48%20104.4%203.57a1%201%200%200%201%201.09.38l13.93%2019.05a.98.98%200%200%201-.42%201.5c-33.6%2013.2-96.67%2010.95-128.91-3.07a.98.98%200%200%201-.49-1.32Z%22%20fill%3D%22%236bd9e9%22%2F%3E%3Cpath%20opacity%3D%22.75%22%20d%3D%22m52.93%2036.58%209.15-19.6a1%201%200%200%201%201.25-.51c37.93%2013.42%2072.43%2012.48%20104.4%203.57a1%201%200%200%201%201.09.38l13.93%2019.05a.98.98%200%200%201-.42%201.5c-33.6%2013.2-96.67%2010.95-128.91-3.07a.98.98%200%200%201-.49-1.32Z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                        }
                        width={40}
                        height={40}
                        className="rounded-full border border-neutral-400 bg-white "
                    />
                    <div className="flex flex-col">
                        <p>{displayName(data?.user.name ?? "")}</p>
                        <span className="text-sm font-light capitalize text-neutral-600 dark:text-neutral-400">
                            User {data?.user.role.toLowerCase()}
                        </span>
                    </div>
                </div>
                {Menus.filter((item) => {
                    if (!item.role) return true;
                    if (data?.user.role === "COMPANY") {
                        return item.role === "COMPANY";
                    }
                    return true;
                }).map((item) => (
                    <Menu
                        key={item.name}
                        {...item}
                        onClick={() => void router.push(item.url || "")}
                        // active={router.asPath === item.url}
                        active={item.url ? activePage === item.url : false}
                    />
                ))}
                <Menu
                    icon={<LogOutIcon />}
                    name={status === "authenticated" ? "Sign Out" : "Sign in"}
                    onClick={
                        status === "authenticated"
                            ? () => void signOut()
                            : () => void signIn()
                    }
                />
            </div>
        </nav>
    );
};

const Menu: React.FC<SideMenuProps> = (props) => {
    return (
        <div
            className={`flex w-full cursor-pointer items-center justify-start rounded-xl p-4 font-semibold text-neutral-600 last:mt-auto last:border-t hover:bg-primary/40 hover:text-primary dark:text-neutral-300`}
            onClick={props.onClick ?? undefined}
        >
            <div
                className={`flex items-center justify-center gap-2 rounded-xl`}
            >
                {props.icon}
                {/* <FontAwesomeIcon size="sm" icon={props.icon} /> */}
                <p className="flex-1 text-xs">{props.name}</p>
            </div>
        </div>
    );
};
export default SideNav;
