const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "books",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    issueTime: {
        type: Date,
        default: Date.now
    },
    dueTime: {
        type: Date,
        default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days from now
    },
    returnTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ["issued", "returned", "overdue"],
        default: "issued" // Default status is "issued"
    }
});

// Validation for status transitions
loanSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'returned') {
        if (!this.returnTime) {
            this.returnTime = Date.now();
        }
    } else if (this.isModified('status') && this.status === 'overdue') {
        // Add additional logic for handling overdue status, if needed
    }
    next();
});

const Loan = mongoose.model("loans", loanSchema);
module.exports = Loan;
