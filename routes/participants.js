const express = require("express");
const jwt = require("jsonwebtoken");
const Participant = require("../models/participant");
const User = require("../models/user");
const router = express.Router();

// Middleware to authenticate supervisor
const adminAuth = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    // console.log(decoded)
    if (!decoded.isAdmin) {
      throw "Not Authorided";
    }
    next();
  } catch (error) {
    console.log("we have an error");
    res.status(401).send({ success: false, error: "Please login as admin." });
  }
};

// Middleware to authenticate users
const userAuth = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log("we hane an error");
    console.error(error);
    res.status(401).send({ success: false, error: "Please login." });
  }
};

// Get all participants
router.get("/", userAuth, async (req, res) => {
  try {
    const { role, name } = req.query;
    console.log("Query Parameters - Role:", role, "Name:", name);

    if (!role || !name) {
      return res.status(400).send({
        success: false,
        error: "Missing or invalid user role in the request.",
      });
    }

    const user = req.user; // Populated by userAuth middleware
    console.log("User from middleware:", user);

    // Fetch participants as per role
    let participants = [];
    if (role === "supervisor") {
      participants = await Participant.find({});
    } else if (role === "participant") {
      participants = await Participant.find({ name });
    }

    res.status(200).send({ success: true, data: participants });
  } catch (error) {
    console.error("Error fetching participants:", error.message);
    res.status(500).send({
      success: false,
      error: "Server error while fetching participants.",
    });
  }
});




// Add participant (Admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const participant = new Participant(req.body);
    await participant.save();
    res.status(201).send({
      success: true,
      data: participant,
      message: "Participant created successfuly",
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, error });
  }
});

// Add episode data to a participant (Admin only)
// router.post('/:id/episodes', adminAuth, async (req, res) => {
//     try {
//         const participant = await Participant.findById(req.params.id);
//         if (!participant) {
//             return res.status(404).send({ success: false, error: "Perticipant not found" });
//         }
//         const { FINAL_STRESS, INITIAL_STRESS } = req.body;
//         participant.episodes.push({ FINAL_STRESS, INITIAL_STRESS });
//         await participant.save();
//         res.send({ success: true, data: participant, message: "participant updated succesfully" });
//     } catch (error) {
//         console.error(error)
//         res.status(400).send({ success: false, error });
//     }
// });

// Add or update the episode object for a participant (Admin only)
router.post("/:id/episode", adminAuth, async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res
        .status(404)
        .send({ success: false, error: "Participant not found" });
    }

    const { FINAL_STRESS, INITIAL_STRESS } = req.body;

    // Set or update the episode object
    participant.episodes = { FINAL_STRESS, INITIAL_STRESS };
    await participant.save();

    res.send({
      success: true,
      data: participant,
      message: "Participant updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, error });
  }
});

// Add comment to a participant (Admin only)
router.post("/:id/comment", adminAuth, async (req, res) => {
  if (!req.body.comment)
    return res
      .status(400)
      .send({ success: false, error: "Error: comment is required" });
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res
        .status(404)
        .send({ success: false, error: "Participant not found" });
    }
    const user = await User.findById(req.userId, "name");
    participant.comments.push({ message: req.body.comment, name: user.name });
    await participant.save();
    return res.send({
      success: true,
      data: participant,
      message: "comment added succesfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send({ success: false, error: "Error: could not add comment" });
  }
});
// get comments a participant (User only)
router.get("/:id/comment", userAuth, async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res
        .status(404)
        .send({ success: false, error: "Perticipant not found" });
    }

    res.send({
      success: true,
      data: participant.comments,
      message: "comment fetched",
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send({ success: false, error: "Error: Something wrong happened" });
  }
});

// Add episode data to a participant (Admin only)
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res
        .status(404)
        .send({ success: false, error: "Participant not found" });
    }
    res.send({
      success: true,
      data: participant,
      message: "participant found",
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, error });
  }
});

// Add episode data to a participant (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const participant = await Participant.findByIdAndDelete(req.params.id);

    res.send({ success: true, message: "participant deleted" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, error });
  }
});

// // Delete a specific episode of a participant (Admin only)
// router.delete('/:participantId/episodes/:episodeIndex', adminAuth, async (req, res) => {
//     try {
//         const participant = await Participant.findById(req.params.participantId);
//         if (!participant) {
//             return res.status(404).send({ success: false, error: 'Participant not found' });
//         }

//         const episodeIndex = parseInt(req.params.episodeIndex) - 1; // Convert to zero-based index
//         if (episodeIndex < 0 || episodeIndex >= participant.episodes.length) {
//             return res.status(404).send({ success: false, error: 'Episode not found' });
//         }

//         participant.episodes.splice(episodeIndex, 1);
//         await participant.save();
//         res.send({ success: true, message: 'Episode deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(400).send({ success: false, error });
//     }
// });

// // Edit a specific episode of a participant (Admin only)
// router.patch('/:participantId/episodes/:episodeIndex', adminAuth, async (req, res) => {
//     try {
//         const participant = await Participant.findById(req.params.participantId);
//         if (!participant) {
//             return res.status(404).send({ success: false, error: 'Participant not found' });
//         }

//         const episodeIndex = parseInt(req.params.episodeIndex) - 1; // Convert to zero-based index
//         if (episodeIndex < 0 || episodeIndex >= participant.episodes.length) {
//             return res.status(404).send({ success: false, error: 'Episode not found' });
//         }

//         const { INITIAL_STRESS, FINAL_STRESS } = req.body;
//         if (INITIAL_STRESS) participant.episodes[episodeIndex].INITIAL_STRESS = INITIAL_STRESS;
//         if (FINAL_STRESS) participant.episodes[episodeIndex].FINAL_STRESS = FINAL_STRESS;

//         await participant.save();
//         res.send({ success: true, data: participant, message: 'Episode updated successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(400).send({ success: false, error });
//     }
// });

router.delete("/:participantId/episode", adminAuth, async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.participantId);
    if (!participant) {
      return res
        .status(404)
        .send({ success: false, error: "Participant not found" });
    }

    participant.episodes = undefined; // Remove the episode object
    await participant.save();
    res.send({ success: true, message: "Episode deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, error });
  }
});

// router.delete("/:participantId/episode", adminAuth, async (req, res) => {
//   try {
//     const participant = await Participant.findById(req.params.participantId);
//     if (!participant) {
//       return res
//         .status(404)
//         .send({ success: false, error: "Participant not found" });
//     }

//     participant.episodes = undefined; // Remove the episode object
//     await participant.save();
//     res.send({ success: true, message: "Episode deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(400).send({ success: false, error });
//   }
// });

// Edit the episode object of a participant (Admin only)
router.patch("/:participantId/episode", adminAuth, async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.participantId);
    if (!participant) {
      return res
        .status(404)
        .send({ success: false, error: "Participant not found" });
    }

    const { INITIAL_STRESS, FINAL_STRESS } = req.body;

    // Update fields directly as frontend already validates them
    participant.episodes[0].INITIAL_STRESS = INITIAL_STRESS;
    participant.episodes[0].FINAL_STRESS = FINAL_STRESS;

    await participant.save();
    res.send({
      success: true,
      data: participant,
      message: "Episode updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
