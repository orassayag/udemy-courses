const enumUtils = require('../enum.utils');

const EnvironmentEnum = enumUtils.createEnum([
    ['PRODUCTION', 'PRODUCTION'],
    ['DEVELOPMENT', 'DEVELOPMENT']
]);

const MethodEnum = enumUtils.createEnum([
    ['CREATE_COURSES', 'CREATE COURSES'],
    ['UPDATE_COURSES', 'UPDATE COURSES'],
    ['PURCHASE_COURSES', 'PURCHASE COURSES']
]);

const ModeEnum = enumUtils.createEnum([
    ['STANDARD', 'STANDARD'],
    ['SESSION', 'SESSION'],
    ['SILENT', 'SILENT']
]);

const ScriptTypeEnum = enumUtils.createEnum([
    ['INITIATE', 'initiate'],
    ['BACKUP', 'backup'],
    ['PURCHASE', 'purchase'],
    ['TEST', 'test']
]);

const StatusEnum = enumUtils.createEnum([
    ['ABORT_BY_THE_USER', 'ABORT BY THE USER'],
    ['INITIATE', 'INITIATE'],
    ['VALIDATE', 'VALIDATE'],
    ['CREATE_COURSES', 'CREATE COURSES'],
    ['LOGIN', 'LOGIN'],
    ['LOGIN_LOAD_FAILED', 'LOGIN LOAD FAILED'],
    ['LOGIN_FAILED', 'LOGIN FAILED'],
    ['INVALID_METHOD', 'INVALID METHOD'],
    ['CREATE_UPDATE_ERROR_IN_A_ROW', 'CREATE UPDATE ERROR IN A ROW'],
    ['UPDATE_COURSES', 'UPDATE COURSES'],
    ['PURCHASE_ERROR_IN_A_ROW', 'PURCHASE ERROR IN A ROW'],
    ['NO_COURSES_EXISTS', 'NO COURSES EXISTS'],
    ['NO_VALID_COURSES_EXISTS', 'NO VALID COURSES EXISTS'],
    ['UNEXPECTED_ERROR', 'UNEXPECTED ERROR'],
    ['PURCHASE_LIMIT_EXCEEDED', 'PURCHASE LIMIT EXCEEDED'],
    ['PAUSE', 'PAUSE'],
    ['PURCHASE', 'PURCHASE'],
    ['LOGOUT', 'LOGOUT'],
    ['LOGOUT_FAILED', 'LOGOUT FAILED'],
    ['BROWSER_CLOSE', 'BROWSER CLOSE'],
    ['FINISH', 'FINISH']
]);

module.exports = { EnvironmentEnum, MethodEnum, ModeEnum, ScriptTypeEnum, StatusEnum };