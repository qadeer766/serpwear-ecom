
import FeaturedProduct from '@/components/Application/Website/FeaturedProduct';
import MainSlider from '@/components/Application/Website/MainSlider'
import banner1 from '@/public/assets/images/banner1.png';
import banner2 from '@/public/assets/images/banner2.png';
import Image from 'next/image';
import Link from 'next/link';
import advertisingBanner from '@/public/assets/images/advertising-banner.png'
import Testimonial from '@/components/Application/Website/Testimonial';
import { GiReturnArrow } from "react-icons/gi";
import { FaShippingFast } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { TbRosetteDiscountFilled } from "react-icons/tb";

const Home = () => {
  return (
     <>
       <section>
          <MainSlider/>
       </section>
        <section className='lg:px-32 px-4 sm:pt-20 pt-5 pb-10'>
            <div className='grid grid-cols-2 sm:gap-10 gap-2'>
                <div className='border rounded-lg overflow-hidden'>
                    <Link href=''>
                      <Image src={banner1}
                          width={banner1.src}
                          height={banner1.height}
                          alt='banner 1'
                          className='transition-all hover:scale-110'
                      />
                    </Link>
                </div>
                <div className='border rounded-lg overflow-hidden'>
                    <Link href=''>
                      <Image src={banner2}
                          width={banner2.src}
                          height={banner2.height}
                          alt='banner 2'
                          className='transition-all hover:scale-110'
                      />
                    </Link>
                </div>
            </div>
         </section>   
        <FeaturedProduct/> 
        <section className='sm:pt-20 '>
           <Image
                 src={advertisingBanner.src}
                 height={advertisingBanner.height}
                 width={advertisingBanner.width}
                 alt='Advertisement'   
           />
        </section>
        <Testimonial/>
        <section className="relative bg-gradient-to-b from-gray-50 to-white lg:px-32 px-4 py-16 border-t">
  <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8">

    {/* Card 1 */}
    <div className="group bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border">
      <div className="flex justify-center items-center mb-5">
        <div className="bg-black text-white p-4 rounded-full group-hover:scale-110 transition duration-300">
          <GiReturnArrow size={26} />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">7-Days Returns</h3>
      <p className="text-gray-500 text-sm">
        Risk-free shopping with easy returns.
      </p>
    </div>

    {/* Card 2 */}
    <div className="group bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border">
      <div className="flex justify-center items-center mb-5">
        <div className="bg-black text-white p-4 rounded-full group-hover:scale-110 transition duration-300">
          <FaShippingFast size={26} />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
      <p className="text-gray-500 text-sm">
        No extra costs, just the price you see.
      </p>
    </div>

    {/* Card 3 */}
    <div className="group bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border">
      <div className="flex justify-center items-center mb-5">
        <div className="bg-black text-white p-4 rounded-full group-hover:scale-110 transition duration-300">
          <BiSupport size={26} />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
      <p className="text-gray-500 text-sm">
        Always here to help you anytime.
      </p>
    </div>

    {/* Card 4 */}
    <div className="group bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border">
      <div className="flex justify-center items-center mb-5">
        <div className="bg-black text-white p-4 rounded-full group-hover:scale-110 transition duration-300">
          <TbRosetteDiscountFilled size={26} />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">Member Discounts</h3>
      <p className="text-gray-500 text-sm">
        Special offers for our loyal customers.
      </p>
    </div>

  </div>
</section>
     </>
  )
}

export default Home
