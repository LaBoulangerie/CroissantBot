import { TextInputStyle } from "discord.js";
import { Form } from "../types/form";

const Grief: Form = {
    id: "grief",
    title: "Demande de dérogation de grief",
    inputs: [
        {
            id: "username",
            label: "Pseudo Minecraft",
            style: TextInputStyle.Short,
            required: true,
            placeholder: "e.g. Eomelius",
            minLength: 3,
            maxLength: 16,
        },
        {
            id: "request",
            label: "Demande détaillée",
            style: TextInputStyle.Paragraph,
            required: true,
            placeholder:
                "Décrivez votre demande précisément. Coordonnées des endroits touchés, moyens utilisés...",
            minLength: 16,
            maxLength: 1024,
        },
    ],
};

export default Grief;
