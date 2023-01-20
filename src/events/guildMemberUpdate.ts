import { Events, GuildMember } from "discord.js";
import { Event } from "../types/event";
import roles from "../roles.json";
import { ExtendedClient } from "../types/extendedClient";

const GuildMemberUpdate: Event = {
    name: Events.GuildMemberUpdate,
    once: false,
    run(
        client: ExtendedClient,
        oldMember: GuildMember,
        newMember: GuildMember
    ) {
        if (!newMember || !oldMember) return;

        if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            const newRole = newMember.roles.cache
                .filter((role) => !oldMember.roles.cache.has(role.id))
                .first();

            const role = roles[newRole.id];
            if (role) {
                const roleGroup = newMember.guild.roles.cache.get(role.group);
                newMember.roles.add(roleGroup);

                const nick = `${role.tag} ${newMember.displayName}`;

                if (nick.length <= 32) {
                    newMember.setNickname(
                        `${role.tag} ${newMember.displayName}`
                    );
                }
            }
        }
    },
};

export default GuildMemberUpdate;
