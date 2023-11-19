import { Events, VoiceState } from "discord.js";
import { Event } from "../types/event";

const VoiceStateUpdate: Event = {
    name: Events.VoiceStateUpdate,
    once: false,
    run(client, oldState: VoiceState, newState: VoiceState) {
        // Deleting custom voice chat if there's no one in it anymore
        if (newState.channel === null && client.voiceChannelIds.includes(oldState.channelId)) {
            client.channels.cache.delete(oldState.channelId);
        }
    },
};

export default VoiceStateUpdate;
