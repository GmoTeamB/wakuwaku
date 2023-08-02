import { getAccount } from "./login";
import { getGraphClient } from "../graph";

export async function getCalendar() {
    const account = getAccount();
    if (!account) {
        console.log("Account not found.");
    }

    const client = getGraphClient(account);

    try {
        let calendar = await client.api("/me/calendars").get();
        console.log(calendar);
    } catch (error) {
        throw error;
    }
}