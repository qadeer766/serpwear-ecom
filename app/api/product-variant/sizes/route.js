

import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/productVariant.model";



export async function GET() {
  try {
  

    await connectDB();

    
    const getSize = await ProductVariantModel.aggregate([
  { $match: { deletedAt: null } },
  { $group: { _id: "$size" } },
  { $sort: { _id: 1 } },
]);


    if(!getSize.length){
        return response(false, 404, 'Size not found.')
    }

    const sizes = getSize.map(item => item._id);

    

    return response(true, 200, "Size found successfully.", sizes);
  } catch (error) {
    return catchError(error);
  }
}