import { TextInputStyle } from "discord.js";
import { Form } from "../types/form";

const Nickname: Form = {
    id: "nickname",
    title: "Changement de nom",
    inputs: [
        {
            id: "username",
            label: "Nom actuel du compte",
            style: TextInputStyle.Short,
            required: true,
            placeholder: "e.g. Salamanders",
            minLength: 3,
            maxLength: 16,
        },
        {
            id: "nickname",
            label: "Nouveau nom",
            style: TextInputStyle.Short,
            required: true,
            placeholder: "e.g. Farëanor. Espaces, accents et caractères spéciaux possibles.",
            minLength: 3,
            maxLength: 32,
        },
        {
            id: "reason",
            label: "Raison",
            style: TextInputStyle.Paragraph,
            required: true,
            placeholder: "Donnez une raison concise de pourquoi vous voulez ce surnom.",
            minLength: 16,
            maxLength: 1024,
        },
    ],
};

export default Nickname;
