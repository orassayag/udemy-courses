const enumUtils = require('../enum.utils');

const Method = enumUtils.createEnum([
    ['GET_COURSES', 'GET COURSES'],
    ['PURCHASE_COURSES', 'PURCHASE COURSES']
]);

const Mode = enumUtils.createEnum([
    ['STANDARD', 'STANDARD'],
    ['SESSION', 'SESSION']
]);

const ScriptType = enumUtils.createEnum([
    ['BACKUP', 'backup'],
    ['PURCHASE', 'purchase'],
    ['UDEMY_SESSION', 'udemy-session'],
    ['SANDBOX', 'sandbox']
]);

const Status = enumUtils.createEnum([
    ['ABORT_BY_THE_USER', 'ABORT BY THE USER'],
    ['INITIATE', 'INITIATE'],
    ['GET_COURSES', 'GET COURSES'],
    ['LOGIN', 'LOGIN'],
    ['LOGIN_LOAD_FAILED', 'LOGIN LOAD FAILED'],
    ['LOGIN_FAILED', 'LOGIN FAILED'],
    ['INVALID_METHOD', 'INVALID METHOD'],
    ['GET_ERROR_IN_A_ROW', 'GET ERROR IN A ROW'],
    ['PURCHASE_ERROR_IN_A_ROW', 'PURCHASE ERROR IN A ROW'],
    ['NO_COURSES_EXISTS', 'NO COURSES EXISTS'],
    ['NO_VALID_COURSES_EXISTS', 'NO VALID COURSES EXISTS'],
    ['LOGOUT_FAILED', 'LOGOUT FAILED'],
    ['UNEXPECTED_ERROR', 'UNEXPECTED ERROR'],
    ['PURCHASE_LIMIT_EXCEEDED', 'PURCHASE LIMIT EXCEEDED'],
    ['PAUSE', 'PAUSE'],
    ['PURCHASE', 'PURCHASE'],
    ['LOGOUT', 'LOGOUT'],
    ['FINISH', 'FINISH']
]);

module.exports = { Method, Mode, ScriptType, Status };