"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module auth */
const _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const HttpResponseSender_1 = require("../services/HttpResponseSender");
class BasicAuthManager {
    anybody() {
        return (req, res, next) => {
            next();
        };
    }
    signed() {
        return (req, res, next) => {
            if (req.user == null) {
                HttpResponseSender_1.HttpResponseSender.sendError(req, res, new pip_services3_commons_node_1.UnauthorizedException(null, 'NOT_SIGNED', 'User must be signed in to perform this operation').withStatus(401));
            }
            else {
                next();
            }
        };
    }
}
exports.BasicAuthManager = BasicAuthManager;
//# sourceMappingURL=BasicAuthManager.js.map