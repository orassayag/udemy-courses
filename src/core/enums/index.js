const { CourseStatus, CourseStatusLog, CourseType } = require('./files/course.enum');
const { Placeholder } = require('./files/placeholder.enum');
const { CoursesDatesType, Environment, Method, Mode, ScriptType, Status } = require('./files/system.enum');
const { StatusIcon, Color, ColorCode } = require('./files/text.enum');

module.exports = {
    Color, ColorCode, CourseStatus, CourseStatusLog, CourseType, CoursesDatesType,
    Environment, Method, Mode, Placeholder, ScriptType, Status, StatusIcon
};