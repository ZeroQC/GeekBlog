var mongoose = require('mongoose');

var BlogSchema = new mongoose.Schema({
    author: String,
    title: {
        unique: true,
        type: String
    },
    category: String,
    content: String,
    praise: {
        type: Number,
        default: 0
    },
    commentNum: {
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

BlogSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }

    next()
});

BlogSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort({'meta.updateAt': -1})
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
};

module.exports = BlogSchema;