import { notionists } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { generateStr } from "~/utils/string-utils";
import { Button } from "./button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu";

const Header = () => {
    const generateAvatar = () => {
        return createAvatar(notionists, {
            seed: generateStr(5),
            size: 128,
        }).toDataUriSync();
    };
    return (
        <div className="sticky top-0 flex w-full items-center justify-end bg-black px-6 py-3">
            <div className="flex items-center justify-start gap-3">
                <div>
                    <Image
                        alt="avatar"
                        src={generateAvatar()}
                        width={40}
                        height={40}
                        className="rounded-full border-neutral-400 bg-white"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <p>Azis</p>
                        <span className="text-sm font-light text-slate-400">
                            User Company
                        </span>
                    </div>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                // onClick={() => action.actionEdit(action.id)}
                                >
                                    Profile
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Header;
