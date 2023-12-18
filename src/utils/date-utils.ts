export const diffDays = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};
export const strToDate = (dateString: string) => {
    if (!dateString) return new Date();
    // Split the date string into parts (month, day, year) using "/"
    const dateParts: string[] = dateString.split("/");
    const month: number = parseInt(dateParts[0] ?? "1", 10); // Parse the month as a number
    const day: number = parseInt(dateParts[1] ?? "1", 10); // Parse the day as a number
    const year: number = parseInt(dateParts[2] ?? "1999", 10); // Parse the year as a number

    // Create a Date object using the parsed values (months are 0-based in JavaScript)
    const date: Date = new Date(year, month - 1, day);
    return date;
};
