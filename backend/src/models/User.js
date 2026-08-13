import mongooswe from 'mongoose';
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50
    },
    email  : {
        type : String,
        required : true,
        unique : true, //creates a unique index for email. It is database vlaidation.
        trim : true,
        lowercase : true
    },
    passwordHash : {
        type : String,
        required : true,
        minlength : 6,
        select : false // excludes that field from database query results by default.
    },
    role : {
        type : String,
        enum : ['customer', 'admin'],
        default : 'customer'
    },
    status : {
        type : String,
        enum : ['active', 'blocked'],
        default : 'active'
    }
},{timestamp : true});

const User = mongoose.model('User', userSchema);
export default User;