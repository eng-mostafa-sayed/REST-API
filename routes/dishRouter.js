const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Dishes = require("../models/dishes");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter
    .route("/")
    .get((req, res, next) => {
        Dishes.find({})
            .then(
                (dishes) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dishes);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Dishes.create(req.body)
            .then(
                (dish) => {
                    console.log("Dish Created ", dish);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /dishes");
    })
    .delete((req, res, next) => {
        Dishes.remove({})
            .then(
                (resp) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(resp);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

dishRouter
    .route("/:dishId")
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then(
                (dish) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /dishes/" + req.params.dishId);
    })
    .put((req, res, next) => {
        Dishes.findByIdAndUpdate(
                req.params.dishId, {
                    $set: req.body,
                }, { new: true }
            )
            .then(
                (dish) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then(
                (resp) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(resp);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });
/////////////////////////////////////////////////////////////////////////////////
dishRouter
    .route("/dishId/comments")
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then(
                (dishes) => {
                    if (dish != null) {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(dish.comments);
                    } else {
                        err = new Error("Dish" + req.params.dishId + "not found");
                        err.status = 404;
                        return next(err);
                    }
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Dishes.create(req.body)
            .then(
                (dish) => {
                    if (dish != null) {
                        dish.comments.push(req.body);
                        dish.save().then((dish) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(dish);
                            (err) => next(err);
                        });
                        res.json(dish.comments);
                    } else {
                        err = new Error("Dish" + req.params.dishId + "not found");
                        err.status = 404;
                        return next(err);
                    }
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end(
            "PUT operation not supported on /dishes/" + req.params.dishId + "comments"
        );
    })
    .delete((req, res, next) => {
        //delete all comments from the dish
        Dishes.findById(req.params.dishId)
            .then(
                (dish) => {
                    if (dish != null) {
                        for (var i = dish.comments.length - 1; i > 0; i--) {
                            dish.comments.id(dish.comments[i]._id).remove();
                        } //end of for
                        //saving after deleting all comments
                        dish.save().then(
                            (dish) => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(dish);
                            }, //end of then
                            (err) => next(err)
                        );
                    } //end of if
                    else {
                        err = new Error("Dish" + req.params.dishId + "not found");
                        err.status = 404;
                        return next(err);
                    }
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });
dishRouter
    .route("/:dishId/comments/:commentId")
    /* .get((req, res, next) => {
                          Dishes.findById(req.params.dishId)
                              .then(
                                  (dish) => {
                                      //checking the dish itself exist and comment exist
                                      if (dish != null && dish.comments.id(req.params.commentId) != null) {
                                          res.statusCode = 200;
                                          res.setHeader("Content-Type", "application/json");
                                          res.json(dish.comments.id(req.params.commentId));
                                      } else if (dish == null) {
                                          //here if the dish  which not exist
                                          err = new Error("Dish" + req.params.dishId + "not found");
                                          err.status = 404;
                                          return next(err);
                                      } else {
                                          //here if the comment only which not exist
                                          err = new Error("comment" + req.params.commentId + "not found");
                                          err.status = 404;
                                          return next(err);
                                      }
                                  },
                                  (err) => next(err)
                              )
                              .catch((err) => next(err));
                      })*/

.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then(
            (dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish.comments.id(req.params.commentId));
                } else if (dish == null) {
                    err = new Error("Dish " + req.params.dishId + " not found");
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error("Comment " + req.params.commentId + " not found");
                    err.status = 404;
                    return next(err);
                }
            },
            (err) => next(err)
        )
        .catch((err) => next(err));
})

.post((req, res, next) => {
        res.statusCode = 403;
        res.end(
            "POST operation not supported on /dishes/" +
            req.params.dishId +
            "/comments/" +
            req.params.commentId
        );
    })
    .put((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then(
                (dish) => {
                    //checking the dish itself exist and comment exist
                    if (dish != null && dish.comments.id(req.params.commentId) != null) {
                        // taring is the name of rating dont miss it i didnt changed it
                        if (req.body.taring) {
                            //if the updated is rating
                            dish.comments.id(req.params.commentId).taring = req.body.taring;
                        }
                        if (req.body.comment) {
                            //if the updated is comment
                            dish.comments.id(req.params.commentId).taring = req.body.comment;
                        }
                        //after updating we have to save the dish
                        dish.save().then(
                            (dish) => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(dish);
                            }, //end of the first part of then
                            (err) => next(err)
                        ); //end of then
                    } //end of if
                    else if (dish == null) {
                        //here if the dish  which not exist
                        err = new Error("Dish" + req.params.dishId + "not found");
                        err.status = 404;
                        return next(err);
                    } else {
                        //here if the comment only which not exist
                        err = new Error("comment" + req.params.commentId + "not found");
                        err.status = 404;
                        return next(err);
                    }
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

.delete((req, res, next) => {
    //delete a specific comment
    Dishes.findById(req.params.dishId)
        .then(
            (dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    dish.comments.id(req.params.commentId).remove();
                    //saving after deleting the specific comment
                    dish.save().then(
                        (dish) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(dish);
                        }, //end of then
                        (err) => next(err)
                    );
                } //end of if
                else if (dish == null) {
                    //here if the dish  which not exist
                    err = new Error("Dish" + req.params.dishId + "not found");
                    err.status = 404;
                    return next(err);
                } else {
                    //here if the comment only which not exist
                    err = new Error("comment" + req.params.commentId + "not found");
                    err.status = 404;
                    return next(err);
                }
            },
            (err) => next(err)
        )
        .catch((err) => next(err));
});
module.exports = dishRouter;