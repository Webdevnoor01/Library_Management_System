const LibraryStaff = require("../../models/libraryStaff");
const createError = require("http-errors");
const UserDto = require("../../userDTO/userDto");

class LibraryStaffService {
  async create(payload) {
    try {
      const libraryStaff = await LibraryStaff.create(payload);
      if (!libraryStaff) {
        return {
          error: true,
          message: "There was a problem to create new staff",
        };
      }
      return {
        error: false,
        data: libraryStaff,
      };
    } catch (e) {
      console.log(e);
      throw createError({
        message: e.message,
      });
    }
  }

  async findLibraryStaffByProperty(query) {
    try {
      let libraryStaff;
      if (query) {
        if (query.id) {
          libraryStaff = await LibraryStaff.findById(query.id, "name email phone userRole avatar");
        }
      } else if (query === undefined) {
        libraryStaff = await LibraryStaff.find({},"name email phone userRole avatar");
      } else {
        libraryStaff = await LibraryStaff.findOne(
          query,
          "name email phone userRole"
        );
      }

      if (!libraryStaff) {
        return {
          error: true,
          message: "Library staff not found",
        };
      }
      return {
        error: false,
        data: libraryStaff,
      };
    } catch (e) {
      throw createError({
        message: e.message,
      });
    }
  }

  async delete(staffId) {
    try {
      const staff = await LibraryStaff.findByIdAndRemove(staffId);
      if (!staff) {
        return {
          error: true,
          message: "There was a errro to delete staff",
        };
      }

      return {
        error: false,
        message: staff,
      };
    } catch (e) {
      throw createError(e.message);
    }
  }

  async update(staffId, payload){
    try {
        console.log(payload)
        const staff = await LibraryStaff.findByIdAndUpdate(staffId, payload)
        if(!staff){
            return {
                error:true,
                message:"There was a problem to updta this staff"
            }
        }
        return {
            error:false,
            data:new UserDto(staff)
        }
    } catch (e) {
        throw createError(e.message)
    }
  }
}

module.exports = new LibraryStaffService();
