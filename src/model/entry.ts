export enum Frequency {
    DAILY = 365, WEEKLY = 52, BI_WEEKLY = 26, MONTHLY = 12, TEN_MONTHS=10, YEARLY=1, CUSTOM=0
}

export class Entry {
    id: string
    groupId: string
    amount: number
    frequency: Frequency
    factor?: number
    description: string
    createdOn: string
    createdBy: string
}