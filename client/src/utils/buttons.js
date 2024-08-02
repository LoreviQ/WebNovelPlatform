// Utility functions triggered by various buttons scattered around the app to reduce code duplication
import { apiEndpoints, axiosAuthed } from "./api";

// Deletes the provided fiction
const deleteFiction = async (fictionID) => {
    const userInput = window.prompt(`Please type the fiction ID (${fictionID}) to confirm deletion:`);

    if (userInput === fictionID.toString()) {
        await axiosAuthed("DELETE", apiEndpoints.fiction(fictionID));
    } else if (userInput) {
        window.alert("The fiction ID does not match.");
    }
};

const buttons = {
    deleteFiction: deleteFiction,
};

export default buttons;
