module.exports = (sequelize, Sequelize) => {
    const Courses = sequelize.define('courses',
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            teacherId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'teachers',
                    key: 'id'
                }
            },
            description: {
                type: Sequelize.STRING(255)
            },
            categoryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'categories',
                    key: 'id'
                }
            },
            accessPeriod: Sequelize.INTEGER,
            priceId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'prices',
                    key: 'id'
                }
            },
            untilDate:{
                type: Sequelize.DATE
            }
        },
        {
            freezeTableName: true,
            timestamps: false
        }
    );
    return Courses;
}