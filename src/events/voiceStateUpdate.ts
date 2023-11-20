import { Events, VoiceState } from "discord.js";
import { Event } from "../types/event";

const VoiceStateUpdate: Event = {
    name: Events.VoiceStateUpdate,
    once: false,
    run(client, oldState: VoiceState, newState: VoiceState) {
        // Deleting custom voice chat if there's no one in it anymore
        const voiceChannelIds = Array.from(client.voiceChannels.values());
        const memberAmout = newState.channel.members.size;

        if (
            newState.channel === null &&
            voiceChannelIds.includes(oldState.channelId) &&
            memberAmout == 0
        ) {
            const voiceChannel = client.channels.cache.get(oldState.channelId);
            voiceChannel.delete();
        }
    },
};

export default VoiceStateUpdate;
