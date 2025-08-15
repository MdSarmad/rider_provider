const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minLength: [3, "Min 3 char required"],
        },
        lastname: {
            type: String,
            minLength: [3, "Min 3 char required"],
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: [6, "Min 6 char required"]
    },
    socketId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minLength: [3, 'Color must be at least 3 characters long']
        },
        plate: {
            type: String,
            required: true,
            minLength: [3, 'Plate must be at least 3 characters long'],
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'motorcycle','auto']
        },
        location: {
            lat: {
                type: Number,
            },
            lang: {
                type: Number,
            }
        }
    }
});

captainSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET_KEY, { expiresIn: '24h'});
    return token;
}

captainSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const captainModel = mongoose.model("captain", captainSchema);

module.exports = captainModel;