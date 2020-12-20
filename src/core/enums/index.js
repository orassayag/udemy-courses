const { CourseStatus, CourseStatusLog, CourseType } = require('./files/course.enum');
const { Placeholder } = require('./files/placeholder.enum');
const { Method, Mode, ScriptType, Status } = require('./files/system.enum');
const { StatusIcon, Color, ColorCode } = require('./files/text.enum');

module.exports = {
    CourseStatus, CourseStatusLog, CourseType, Color, ColorCode, Method, Mode,
    Placeholder, ScriptType, Status, StatusIcon
};