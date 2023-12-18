import { adventurer, micah } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { generateStr } from "~/utils/string-utils";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatedDate = (date: Date, withHour = false) => {
    const format = withHour ? "HH:mm:ss DD/MM/YYYY" : "DD/MM/YYYY";
    return dayjs(date).format(format);
};

export const generateAvatar = () => {
    return createAvatar(micah, {
        seed: generateStr(5),
        size: 128,
    }).toDataUriSync();
};
