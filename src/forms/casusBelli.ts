import { TextInputStyle } from "discord.js";
import { Form } from "../types/form";

const CasusBelli: Form = {
    id: "casus-belli",
    title: "Casus Belli",
    inputs: [
        {
            id: "username",
            label: "Pseudo Minecraft",
            style: TextInputStyle.Short,
            required: true,
            placeholder: "e.g. Oskey44",
            minLength: 3,
            maxLength: 16,
        },
        {
            id: "against",
            label: "Camp adverse",
            style: TextInputStyle.Short,
            required: true,
            placeholder: "e.g. Ville.s, Nation.s, groupement de joueurs...",
            minLength: 3,
            maxLength: 16,
        },
        {
            id: "file_url",
            label: "Lien vers document complet",
            style: TextInputStyle.Short,
            required: false,
            placeholder: "Lien optionel vers un google doc, pdf...",
        },
        {
            id: "request",
            label: "Casus Belli",
            style: TextInputStyle.Paragraph,
            required: true,
            placeholder: "Décrivez votre casus belli précisément.",
            minLength: 16,
            maxLength: 1024,
        },
    ],
};

export default CasusBelli;
