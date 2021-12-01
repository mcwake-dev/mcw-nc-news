const { deleteComment } = require("../models/comments.model");

exports.deleteComment = async (req, res, next) => {
  const { comment_id } = req.params;
  const deleteSuccessful = await deleteComment(comment_id);

  if (deleteSuccessful) {
    res.sendStatus(204);
  } else {
    next({ msg: "Invalid Comment ID", status: 400 });
  }
};
