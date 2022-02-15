"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = require("../db/mongo");
const task_1 = require("../model/task");
(0, mongo_1.connectToDatabase)("mongodb://localhost:27017/task-manager-api");
task_1.Task.findByIdAndRemove("61fc0ea4963025ee27dd1214").then((doc) => {
    return task_1.Task.countDocuments({ completed: false });
}).then((incompleteTasks) => {
    console.log(incompleteTasks);
});
const deleteTaskAndFindIncompleteTasks = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    yield task_1.Task.findByIdAndDelete(taskId);
    const count = yield task_1.Task.countDocuments({ completed: false });
    return count;
});
deleteTaskAndFindIncompleteTasks("61fd4a525d47cdff97d9056f").then((count) => {
    console.log("count", count);
}).catch((err) => {
    console.log("Error", err);
});
