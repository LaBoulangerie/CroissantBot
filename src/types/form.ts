import { TextInputStyle } from "discord.js";

export type Form = {
    id: string;
    googleId: string;
    title: string;
    inputs: Array<FormInput>;
};

export type FormResponse = {
    form: Form;
    timestamp: Date;
    answers: Array<FormInputAnswer>;
};

export type FormInputAnswer = {
    id: string;
    answer: string;
};

type FormInput = {
    id: string;
    label: string;
    style: TextInputStyle;
    required: boolean;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    value?: string;
};
