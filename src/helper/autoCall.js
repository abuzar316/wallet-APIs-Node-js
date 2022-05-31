const roleSchema = require('../models/role');
const userSchema = require('../models/user');
const loginUserSchema = require('../models/loginUser');
const helper = require('../helper/helper');

module.exports = () => {
    try {
        (async () => {
            const allRole = await roleSchema.find();
            if (allRole.length == 0) {
                const role = await roleSchema.create([
                    { roleName: 'admin' },
                    { roleName: 'user' },
                ]);
            }
            const adminRole = await roleSchema.findOne({ roleName: 'admin' });
            const adminUser = await userSchema.findOne({ roleId: adminRole._id });
            if (adminUser == null) {
                const createAdminUser = await userSchema.create({
                    email: "shivam@yopmail.com",
                    firstName: "shivam",
                    lastName: "kumar",
                    mobile: "8279459394",
                    gender: "male",
                    password: await helper.hashPassword("Chetu@123"),
                    roleId: adminRole._id,
                    username: "shivam",
                    status: true
                });
                const loginUserCreate = await loginUserSchema.create({
                    userId: createAdminUser._id
                })
            }
        })()
    } catch (error) {
        console.log(error);
    }
}