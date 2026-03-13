import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/user.model";



export async function GET() {
    try{
      await connectDB()
      const auth = await isAuthenticated('user')
      if(!auth.isAuth){
        return response(false, 401, 'Unauthorized')
      }

      const userId = auth.userId
     const user = await UserModel.findById(userId)
  .select("-password")
  .lean()

      return response(true, 200, 'User data.', user)

    }catch(error){
        return catchError(error)
    }
}