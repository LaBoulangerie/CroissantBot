import { TextInputStyle } from "discord.js";
import { Form } from "../types/form";
import formIds from "../form-ids";

const Nickname: Form = {
    id: "nickname",
    visible: true,
    googleId: formIds.nickname,
    title: "Demande de surnom",
    inputs: [
        {
            id: "username",
            label: "Pseudo Minecraft",
            style: TextInputStyle.Short,
            required: true,
            placeholder: "e.g. Salamenders_",
            minLength: 3,
            maxLength: 16,
        },
        {
            id: "nickname",
            label: "Surnom demandé",
            style: TextInputStyle.Short,
            required: true,
            placeholder: "e.g. Farëanor. Espaces, accents et caractères spéciaux.",
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
        {
            id: "wiki",
            label: "Page wiki du personnage",
            style: TextInputStyle.Short,
            required: true,
            placeholder: "e.g. https://laboulangerie.fandom.com/fr/wiki/Far%C3%ABanor",
            minLength: 3,
            maxLength: 100,
        },
    ],
};

export default Nickname;
