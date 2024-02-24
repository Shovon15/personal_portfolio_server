import { Router } from "express";
import { userRegister, userLogin, userLogout, userInfo } from "../controller/userController";
import { upload } from "../middleware/multer.middleware";
import { isAuthenticated } from "../middleware/auth.middleware";

const userRouter = Router();

// userRouter.post(
//     "/signup",
//     upload.fields([
//         {
//             name: "avatar",
//             maxCount: 1,
//         },
//     ]),
//     userRegister
// );
userRouter.post("/signup", upload.single("avatar"), userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/logout", isAuthenticated, userLogout);
userRouter.get("/user-info", isAuthenticated, userInfo);


export default userRouter;
