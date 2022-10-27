class UserDto {
    id;
    phone;
    name;
    avatar;
    createdAt;

    constructor(user,field) {
        this.id = user._id;
        this.phone = user.phone;
        this.name = user.studentName || user.teacherName || user.name;
        this.avatar = user.avatar;
        this.userRole = user.userRole
        this.createdAt = user.createdAt;
        field = user[field]
    }
}

module.exports = UserDto;