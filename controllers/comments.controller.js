const {
  deleteComment,
  updateComment,
  mostRecentComments,
  highestVotedComments,
} = require("../models/comments.model");

exports.deleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const deleteSuccessful = await deleteComment(comment_id);

    if (deleteSuccessful) {
      res.sendStatus(204);
    } else {
      next({ msg: "Invalid Comment ID", status: 400 });
    }
  } catch (err) {
    next(err);
  }
};

exports.voteOnComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    if (comment_id && inc_votes) {
      const comment = await updateComment(comment_id, inc_votes);

      if (comment) {
        res.status(200).send({ comment });
      } else {
        next({ status: 404, msg: "Comment not found" });
      }
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    next(err);
  }
};

exports.topThreeMostRecent = async (req, res, next) => {
  try {
    const comments = await mostRecentComments();

    res.status(200).send({ comments });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.topThreeHighestVoted = async (req, res, next) => {
  try {
    const comments = await highestVotedComments();

    res.status(200).send({ comments });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
