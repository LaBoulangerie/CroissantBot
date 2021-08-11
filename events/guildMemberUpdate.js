const roles = require("../roles.json");

module.exports = async (bot, oldMember, newMember) => {
  if (!newMember || !oldMember) return;

  if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    const newRole = newMember.roles.cache
      .filter((role) => !oldMember.roles.cache.has(role.id))
      .first();

    const role = roles[newRole.id];
    if (role) {
      const roleGroup = newMember.guild.roles.cache.get(role.group);
      newMember.roles.add(roleGroup);

      newMember.setNickname(`${role.tag} ${newMember.displayName}`);
    }
  }
};
