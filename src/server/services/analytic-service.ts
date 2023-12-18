import { DetailAnalytic } from "@prisma/client";
import _ from "underscore";
import { AnalyticForm, SummaryAnalyticForm } from "~/type";
import { diffDays, strToDate } from "~/utils/date-utils";

export const calculateRFM = (
    data: _.Dictionary<DetailAnalytic[]>
): SummaryAnalyticForm[] => {
    const arr: SummaryAnalyticForm[] = [];
    for (const key in data) {
        const item = data[key];
        if (item && item.length) {
            const recency = calculateRecency(item);
            const frequency = calculateFrequency(item);
            const monetary = calculateMonetary(item);
            arr.push({
                frequency,
                monetary,
                recency,
                customerId: key,
                customerName: item[0]?.customerName || "",
            });
        }
    }
    const avgRecency =
        arr.reduce((sum, item) => sum + item.recency, 0) / arr.length;
    const avgFrequency =
        arr.reduce((sum, item) => sum + item.frequency, 0) / arr.length;
    const avgMonetary =
        arr.reduce((sum, item) => sum + item.monetary, 0) / arr.length;
    arr.forEach((item) => {
        item.recencyScore = calculateScore(item.recency, avgRecency, true);
        item.frequencyScore = calculateScore(item.frequency, avgFrequency);
        item.monetaryScore = calculateScore(item.monetary, avgMonetary);
    });
    return arr.sort((a, b) => {
        const sigmaA =
            ((a.frequencyScore ?? 0) +
                (a.monetaryScore ?? 0) +
                (a.recencyScore ?? 0)) /
            3;
        const sigmaB =
            ((b.frequencyScore ?? 0) +
                (b.monetaryScore ?? 0) +
                (b.recencyScore ?? 0)) /
            3;
        return sigmaB - sigmaA;
    });
};
const calculateMonetary = (data: DetailAnalytic[]) => {
    const largest = data.reduce((prev, next) => prev + next.totalPurchase, 0);
    return largest;
};
const calculateFrequency = (data: DetailAnalytic[]) => {
    return data.length;
};
const calculateRecency = (data: DetailAnalytic[]) => {
    const now = new Date();
    const latest = data.reduce((prev, next) => {
        return prev.purchaseDate.getTime() > next.purchaseDate.getTime()
            ? prev
            : next;
    });
    return diffDays(latest.purchaseDate, now);
};

const calculateScore = (value: number, average: number, recency = false) => {
    if (recency) {
        if (value >= average * 1.8) {
            return 1;
        } else if (value >= average * 1.6) {
            return 2;
        } else if (value >= average * 1.4) {
            return 3;
        } else if (value >= average * 1.2) {
            return 4;
        } else {
            return 5;
        }
    }
    if (value >= average * 1.8) {
        return 5;
    } else if (value >= average * 1.6) {
        return 4;
    } else if (value >= average * 1.4) {
        return 3;
    } else if (value >= average * 1.2) {
        return 2;
    } else {
        return 1;
    }
};
