const Team = require("../models/teams");
const User = require("../models/users");

const createTeam = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const creator = req.userId;

        if (!name) {
            return res.status(400).json({ message: "Team name is required" });
        }

        const team = new Team({
            name,
            description,
            creator,
            members: [creator, ...members]
        });

        await team.save();
        res.status(201).json({team: team});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const inviteMember = async (req, res) => {
    try {
        const { teamId, memberId } = req.body;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        if (team.members.includes(memberId)) {
            return res.status(400).json({ message: "User is already a member of this team" });
        }

        team.members.push(memberId);
        await team.save();

        res.status(200).json({ message: "Member added to the team", team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTeam, inviteMember };
