import { AbilityMap } from "src/config/rabc/abilities";
import { Modules } from "src/config/rabc/modules";
import Admin from "src/models/Admin";
import Role, { RoleLevel } from "src/models/Role";
import { HashPassword } from "src/utils/hash";


export const Seeder = async () => {
    const superAdminRole =
        await Role.create({
            name: "SUPER ADMIN",
            level: RoleLevel.L1,
            permissions: {},
            super_admin: true
        })

    await Role.findOneAndUpdate(
        {
            name: "REVIEWER",
        },
        {
            name: "REVIEWER",

            super_admin: false,

            level: RoleLevel.L2,

            permissions: {
                [Modules.DASHBOARD]: [
                    AbilityMap.READ,
                ],

                [Modules.BLOGS]: [
                    AbilityMap.READ,
                    AbilityMap.UPDATE,
                    AbilityMap.REVIEW,
                ],
            },
        },
        {
            new: true,
            upsert: true,
        },
    );

    await Role.findOneAndUpdate(
        {
            name: "PUBLISHER",
        },
        {
            name: "PUBLISHER",

            super_admin: false,

            level: RoleLevel.L3,

            permissions: {
                [Modules.DASHBOARD]: [
                    AbilityMap.READ,
                ],

                [Modules.BLOGS]: [
                    AbilityMap.READ,
                    AbilityMap.PUBLISH,
                ],
            },
        },
        {
            new: true,
            upsert: true,
        },
    );

    const superAdminExists =
        await Admin.findOne({
            email: "admin@example.com",
        });

    if (!superAdminExists) {
        await Admin.create({
            name: "Super Admin",

            email: "admin@example.com",

            password: await HashPassword(
                "Admin@123",
            ),

            phone: "9999999999",

            role: superAdminRole._id,

            super_admin: true,
        });
    }

    console.log(
        "✅ Seeder Completed Successfully",
    );
};