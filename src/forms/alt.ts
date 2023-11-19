import { TextInputStyle } from "discord.js";
import { Form } from "../types/form";
import formIds from "../form-ids";

const Alt: Form = {
    id: "doublecompte",
    visible: true,
    isModeration: true,
    googleId: formIds.alt,
    title: "Déclaration de double compte",
    inputs: [
        {
            id: "username",
            label: "Pseudo Minecraft du compte principal",
            style: TextInputStyle.Short,
            required: true,
            placeholder: "e.g. PainOchoco",
            minLength: 3,
            maxLength: 16,
        },
        {
            id: "alt_username",
            label: "Pseudo Minecraft du double compte",
            style: TextInputStyle.Short,
            required: true,
            placeholder: "e.g. PainOraisins",
            minLength: 3,
            maxLength: 32,
        },
        {
            id: "reason",
            label: "Raison",
            style: TextInputStyle.Paragraph,
            required: true,
            placeholder:
                "Donnez une raison concise de comment vous allez utiliser ce double compte.",
            minLength: 16,
            maxLength: 1024,
        },
    ],
};

export default Alt;
