import { TextInputStyle } from "discord.js";
import { Form } from "../types/form";

const VoiceChannel: Form = {
    id: "voice-channel",
    visible: false,
    isModeration: false,
    title: "Demande de surnom",
    inputs: [
        {
            id: "name",
            label: "Nom du salon vocal",
            style: TextInputStyle.Paragraph,
            required: true,
            placeholder: "e.g. forum des brasseurs",
            maxLength: 128,
        },
        {
            id: "limit",
            label: "Limite de connexions",
            style: TextInputStyle.Short,
            required: false,
            placeholder: "e.g. 4",
        },
        {
            id: "isrp",
            label: "Vocal RP ? (oui|non)",
            style: TextInputStyle.Short,
            required: false,
            placeholder: "e.g. non",
            minLength: 3,
            maxLength: 3,
        },
    ],
};

export default VoiceChannel;
